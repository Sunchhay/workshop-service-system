import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { createResponse } from '../../common/types/api-response.type';
import {
  CartStatus,
  CommissionStatus,
  PaymentStatus,
  SaleStatus,
} from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { SalesRepository } from '../sales/sales.repository';
import type { CheckoutDto } from './dto/checkout.dto';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly salesRepository: SalesRepository,
  ) {}

  async complete(dto: CheckoutDto, createdById: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { id: dto.cartId },
      include: {
        items: true,
        customer: { select: { id: true } },
      },
    });

    if (!cart) throw new NotFoundException('Cart not found');
    if (cart.status !== CartStatus.ACTIVE) {
      throw new BadRequestException('Cart is not active');
    }
    if (cart.items.length === 0) {
      throw new BadRequestException('Cart has no items');
    }
    if (!cart.customerId) {
      throw new BadRequestException('Cart must have a customer before checkout');
    }

    const paidAmount = dto.paidAmount ?? 0;
    if (paidAmount < 0) throw new BadRequestException('paidAmount must be >= 0');

    const subtotal = cart.items.reduce(
      (sum, item) => sum + parseFloat(item.total.toString()),
      0,
    );
    const grandTotal = subtotal;
    const balanceAmount = Math.max(0, grandTotal - paidAmount);
    const commissionAmount = parseFloat(cart.commissionAmount.toString());

    let paymentStatus: PaymentStatus;
    if (paidAmount <= 0) paymentStatus = PaymentStatus.UNPAID;
    else if (paidAmount >= grandTotal) paymentStatus = PaymentStatus.PAID;
    else paymentStatus = PaymentStatus.PARTIAL;

    const commissionStatus =
      cart.mechanicId && commissionAmount > 0
        ? CommissionStatus.UNPAID
        : CommissionStatus.NONE;

    const invoiceNo = await this.salesRepository.generateInvoiceNo();

    const sale = await this.prisma.$transaction(async (tx) => {
      const created = await tx.sale.create({
        data: {
          invoiceNo,
          customerId: cart.customerId,
          mechanicId: cart.mechanicId,
          createdById,
          subtotal,
          grandTotal,
          paidAmount,
          balanceAmount,
          commissionAmount,
          commissionNote: cart.commissionNote,
          commissionStatus,
          paymentStatus,
          saleStatus: SaleStatus.COMPLETED,
          note: dto.saleNote,
          items: {
            create: cart.items.map((item) => ({
              itemType: item.itemType,
              serviceId: item.serviceId,
              productId: item.productId,
              machineModelId: item.machineModelId,
              nameSnapshot: item.nameSnapshot,
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              total: item.total,
              note: item.note,
            })),
          },
        },
        select: {
          id: true,
          invoiceNo: true,
          customerId: true,
          mechanicId: true,
          subtotal: true,
          grandTotal: true,
          paidAmount: true,
          balanceAmount: true,
          commissionAmount: true,
          commissionStatus: true,
          paymentStatus: true,
          saleStatus: true,
          note: true,
          createdAt: true,
          items: { select: { id: true, nameSnapshot: true, unitPrice: true, quantity: true, total: true } },
          payments: { select: { id: true, amount: true, paymentMethod: true, paidAt: true } },
        },
      });

      if (paidAmount > 0 && dto.paymentMethod) {
        await tx.payment.create({
          data: {
            saleId: created.id,
            paymentMethod: dto.paymentMethod,
            amount: paidAmount,
            referenceNo: dto.referenceNo,
            note: dto.paymentNote,
            paidAt: new Date(),
          },
        });
      }

      await tx.cart.update({
        where: { id: dto.cartId },
        data: { status: CartStatus.CHECKED_OUT },
      });

      await tx.customer.update({
        where: { id: cart.customerId! },
        data: { lastPurchasedAt: new Date() },
      });

      return created;
    });

    return createResponse(sale, 'Checkout completed');
  }
}
