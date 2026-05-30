import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { createPaginatedResponse, createResponse } from '../../common/types/api-response.type';
import {
  InvoiceStatus,
  ItemType,
  PaymentMethod,
  PosCartStatus,
  SaleStatus,
} from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { calcTotals } from '../invoices/invoices.repository';
import type { CreateInvoiceItemDto } from '../invoices/dto/create-invoice.dto';
import type { CreateSaleItemDto } from '../sales/dto/create-sale.dto';
import { calcSaleTotals, SalesRepository } from '../sales/sales.repository';
import type { AddCartItemDto } from './dto/add-cart-item.dto';
import type { CheckoutPosCartDto } from './dto/checkout-pos-cart.dto';
import type { CreatePosCartDto } from './dto/create-pos-cart.dto';
import type { QueryCartServiceCatalogDto } from './dto/query-cart-service-catalog.dto';
import type { UpdateCartItemDto } from './dto/update-cart-item.dto';
import type { UpdatePosCartDto } from './dto/update-pos-cart.dto';
import { PosCartsRepository } from './pos-carts.repository';

@Injectable()
export class PosCartsService {
  constructor(
    private readonly repo: PosCartsRepository,
    private readonly salesRepository: SalesRepository,
    private readonly prisma: PrismaService,
  ) {}

  async findActive(userId: string) {
    const carts = await this.repo.findActive(userId);
    return createResponse(carts, 'Active carts');
  }

  async create(dto: CreatePosCartDto, userId: string) {
    const cart = await this.repo.create(dto, userId);
    return createResponse(cart, 'Cart created');
  }

  async findOne(id: string) {
    const cart = await this.repo.findById(id);
    if (!cart) throw new NotFoundException('Cart not found');
    return createResponse(cart, 'Cart found');
  }

  async update(id: string, dto: UpdatePosCartDto) {
    await this.ensureExists(id);
    const nextDto = { ...dto };

    if (dto.machineModelId !== undefined) {
      if (dto.machineModelId) {
        const model = await this.prisma.machineModel.findFirst({
          where: { id: dto.machineModelId, deletedAt: null, isActive: true },
          select: { id: true, brand: true, model: true },
        });
        if (!model) throw new BadRequestException('Machine model not found');
        nextDto.modelNameSnapshot = this.formatMachineModelName(model);
      } else {
        nextDto.machineModelId = null;
        nextDto.modelNameSnapshot = null;
      }
    }

    const cart = await this.repo.update(id, nextDto);
    return createResponse(cart, 'Cart updated');
  }

  async close(id: string) {
    await this.ensureExists(id);
    const cart = await this.repo.close(id);
    return createResponse(cart, 'Cart closed');
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.repo.delete(id);
    return createResponse(null, 'Cart deleted');
  }

  // ─── CartItem operations ────────────────────────────────────────────────────

  async addItem(cartId: string, dto: AddCartItemDto) {
    const cart = await this.repo.findById(cartId);
    if (!cart) throw new NotFoundException('Cart not found');
    if (cart.status === PosCartStatus.CLOSED)
      throw new BadRequestException('Cart is closed');

    const itemDto = await this.prepareCartItem(dto);

    // Product rows merge; service rows keep their manual price as entered.
    if (itemDto.type === ItemType.PRODUCT) {
      const existing = cart.items.find((item) => {
        if (itemDto.type === ItemType.PRODUCT && itemDto.productId)
          return (
            item.productId === itemDto.productId &&
            (item.machineModelId ?? null) === (itemDto.machineModelId ?? null)
          );
        return false;
      });
      if (existing) {
        const updated = await this.repo.incrementItem(
          existing.id,
          itemDto.quantity ?? 1,
        );
        return createResponse(updated, 'Item quantity increased');
      }
    }

    const updated = await this.repo.addItem(cartId, itemDto);
    return createResponse(updated, 'Item added');
  }

  async updateItem(cartId: string, itemId: string, dto: UpdateCartItemDto) {
    await this.ensureExists(cartId);
    const updated = await this.repo.updateItem(cartId, itemId, dto);
    if (!updated) throw new NotFoundException('Cart item not found');
    return createResponse(updated, 'Item updated');
  }

  async removeItem(cartId: string, itemId: string) {
    await this.ensureExists(cartId);
    const updated = await this.repo.removeItem(cartId, itemId);
    return createResponse(updated, 'Item removed');
  }

  // ─── Checkout ───────────────────────────────────────────────────────────────

  async checkout(cartId: string, dto: CheckoutPosCartDto, userId: string) {
    const cart = await this.repo.findById(cartId);
    if (!cart) throw new NotFoundException('Cart not found');
    if (cart.status === PosCartStatus.CLOSED)
      throw new BadRequestException('Cart is already closed');
    if (cart.items.length === 0)
      throw new BadRequestException('Cart has no items');
    if (!cart.customerId)
      throw new BadRequestException('A customer is required to checkout');

    const saleItems: CreateSaleItemDto[] = cart.items.map((item) => ({
      type: item.type,
      serviceId:
        item.type === 'SERVICE' ? (item.serviceId ?? undefined) : undefined,
      productId:
        item.type === 'PRODUCT' ? (item.productId ?? undefined) : undefined,
      machineModelId: item.machineModelId ?? undefined,
      modelNameSnapshot: item.modelNameSnapshot ?? undefined,
      itemCode: item.itemCode ?? undefined,
      itemNameKh: item.itemNameKh ?? undefined,
      itemNameEn: item.itemNameEn ?? undefined,
      description:
        item.description || item.itemNameKh || item.itemNameEn || 'Item',
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      discountAmount: Number(item.discountAmount),
    }));

    const cartDiscount = Number(cart.discountAmount);
    const totals = calcSaleTotals(saleItems, cartDiscount);
    const saleNumber = await this.salesRepository.generateSaleNumber();

    const sale = await this.salesRepository.createWithTransaction(
      {
        customerId: cart.customerId ?? undefined,
        customerName: cart.customerName,
        notes: cart.note ?? undefined,
        discountAmount: cartDiscount,
        items: saleItems,
      },
      saleNumber,
      userId,
      totals,
      SaleStatus.COMPLETED,
    );

    let invoice: {
      id: string;
      invoiceNumber: string;
      totalAmount: unknown;
      dueAmount: unknown;
    } | null = null;
    let payment: { id: string; paymentNumber: string; amount: unknown } | null =
      null;

    const invoiceItems: CreateInvoiceItemDto[] = saleItems.map((item) => ({
      type: item.type,
      serviceId: item.serviceId,
      productId: item.productId,
      machineModelId: item.machineModelId,
      modelNameSnapshot: item.modelNameSnapshot,
      itemCode: item.itemCode,
      itemNameKh: item.itemNameKh,
      itemNameEn: item.itemNameEn,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discountAmount: item.discountAmount,
    }));

    const invoiceTotals = calcTotals(invoiceItems, cartDiscount);
    const invoiceNumber = await this.generateInvoiceNumber();

    invoice = await this.prisma.invoice.create({
      data: {
        invoiceNumber,
        customerId: cart.customerId,
        saleId: sale.id,
        status: InvoiceStatus.ISSUED,
        subtotal: invoiceTotals.subtotal,
        discountAmount: cartDiscount,
        taxAmount: 0,
        totalAmount: invoiceTotals.totalAmount,
        paidAmount: 0,
        dueAmount: invoiceTotals.dueAmount,
        notes: cart.note ?? null,
        createdById: userId,
        items: {
          create: invoiceItems.map((item) => ({
            type: item.type ?? ItemType.PRODUCT,
            serviceId: item.serviceId ?? null,
            productId: item.productId ?? null,
            machineModelId: item.machineModelId ?? null,
            modelNameSnapshot: item.modelNameSnapshot ?? null,
            itemCode: item.itemCode ?? null,
            itemNameKh: item.itemNameKh ?? null,
            itemNameEn: item.itemNameEn ?? null,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discountAmount: item.discountAmount ?? 0,
            totalPrice: Math.max(
              0,
              (item.quantity ?? 1) * item.unitPrice -
                (item.discountAmount ?? 0),
            ),
          })),
        },
      },
      select: {
        id: true,
        invoiceNumber: true,
        totalAmount: true,
        dueAmount: true,
      },
    });

    const paidAmount = dto.paidAmount ?? 0;
    if (paidAmount > 0) {
      const payNumber = await this.generatePaymentNumber();
      payment = await this.prisma.payment.create({
        data: {
          paymentNumber: payNumber,
          invoiceId: invoice.id,
          customerId: cart.customerId,
          amount: Math.min(paidAmount, invoiceTotals.totalAmount),
          method: dto.paymentMethod ?? PaymentMethod.CASH,
          createdById: userId,
        },
        select: { id: true, paymentNumber: true, amount: true },
      });

      invoice = await this.prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          paidAmount: Number(payment.amount),
          dueAmount: Math.max(
            0,
            invoiceTotals.totalAmount - Number(payment.amount),
          ),
          status:
            Number(payment.amount) >= invoiceTotals.totalAmount
              ? InvoiceStatus.PAID
              : InvoiceStatus.PARTIAL,
        },
        select: {
          id: true,
          invoiceNumber: true,
          totalAmount: true,
          dueAmount: true,
        },
      });
    }

    await this.repo.close(cartId);

    return createResponse({ sale, invoice, payment }, 'Checkout complete');
  }

  private async ensureExists(id: string) {
    const cart = await this.repo.findById(id);
    if (!cart) throw new NotFoundException('Cart not found');
    return cart;
  }

  private formatMachineModelName(model: { brand: string; model: string }) {
    return `${model.brand} ${model.model}`.trim();
  }

  private async prepareCartItem(dto: AddCartItemDto): Promise<AddCartItemDto> {
    const unitPrice = Number(dto.unitPrice ?? 0);

    if (dto.type === ItemType.SERVICE) {
      if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
        throw new BadRequestException('សូមបញ្ចូលតម្លៃសេវាកម្ម។');
      }
      return dto;
    }

    if (dto.type === ItemType.PRODUCT && dto.productId) {
      const product = await this.prisma.product.findFirst({
        where: { id: dto.productId, deletedAt: null, isActive: true },
        select: {
          sellingPrice: true,
          linkedReferenceBook: {
            select: {
              machineModelId: true,
              machineModel: { select: { brand: true, model: true } },
            },
          },
        },
      });
      if (!product) throw new BadRequestException('Product not found');

      const model = product.linkedReferenceBook?.machineModel;
      return {
        ...dto,
        unitPrice:
          Number.isFinite(unitPrice) && unitPrice > 0
            ? unitPrice
            : Number(product.sellingPrice),
        machineModelId:
          dto.machineModelId ??
          product.linkedReferenceBook?.machineModelId ??
          undefined,
        modelNameSnapshot:
          dto.modelNameSnapshot ??
          (model ? this.formatMachineModelName(model) : undefined),
      };
    }

    return dto;
  }

  private async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const last = await this.prisma.invoice.findFirst({
      where: { invoiceNumber: { startsWith: `INV-${year}-` } },
      orderBy: { createdAt: 'desc' },
      select: { invoiceNumber: true },
    });
    if (!last) return `INV-${year}-0001`;
    const num = parseInt(last.invoiceNumber.split('-')[2], 10);
    return `INV-${year}-${String(num + 1).padStart(4, '0')}`;
  }

  private async generatePaymentNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const last = await this.prisma.payment.findFirst({
      where: { paymentNumber: { startsWith: `PAY-${year}-` } },
      orderBy: { createdAt: 'desc' },
      select: { paymentNumber: true },
    });
    if (!last) return `PAY-${year}-0001`;
    const num = parseInt(last.paymentNumber.split('-')[2], 10);
    return `PAY-${year}-${String(num + 1).padStart(4, '0')}`;
  }

  async searchServiceCatalog(dto: QueryCartServiceCatalogDto) {
    const { page = 1, limit = 12 } = dto;
    const result = await this.repo.searchServiceCatalog(dto);
    return createPaginatedResponse(result.data as object[], result.total, page, limit);
  }
}
