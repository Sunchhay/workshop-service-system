import { Injectable } from '@nestjs/common';

import { SaleStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateSaleItemDto } from './dto/create-sale.dto';
import type { QuerySaleDto } from './dto/query-sale.dto';
import type { UpdateSaleDto } from './dto/update-sale.dto';

const SALE_SELECT = {
  id: true,
  saleNumber: true,
  customerId: true,
  status: true,
  subtotal: true,
  discountAmount: true,
  totalAmount: true,
  notes: true,
  soldAt: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
  customer: { select: { id: true, code: true, name: true, phone: true } },
  createdBy: { select: { id: true, name: true } },
  items: {
    select: {
      id: true,
      saleId: true,
      productId: true,
      description: true,
      quantity: true,
      unitPrice: true,
      discountAmount: true,
      totalPrice: true,
      createdAt: true,
      updatedAt: true,
      product: {
        select: {
          id: true,
          code: true,
          name: true,
          unit: true,
          stockQuantity: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' as const },
  },
} as const;

export interface SaleTotals {
  subtotal: number;
  totalAmount: number;
}

export function calcSaleTotals(
  items: CreateSaleItemDto[],
  discountAmount = 0,
): SaleTotals {
  const subtotal = items.reduce((sum, item) => {
    const qty = item.quantity ?? 1;
    const raw = qty * item.unitPrice;
    const itemDiscount = Math.min(item.discountAmount ?? 0, raw);
    return sum + Math.max(0, raw - itemDiscount);
  }, 0);

  const cappedDiscount = Math.min(discountAmount, subtotal);
  const totalAmount = Math.max(0, subtotal - cappedDiscount);
  return { subtotal, totalAmount };
}

@Injectable()
export class SalesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async generateSaleNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const last = await this.prisma.sale.findFirst({
      where: { saleNumber: { startsWith: `SALE-${year}-` } },
      orderBy: { createdAt: 'desc' },
      select: { saleNumber: true },
    });
    if (!last) return `SALE-${year}-0001`;
    const num = parseInt(last.saleNumber.split('-')[2], 10);
    return `SALE-${year}-${String(num + 1).padStart(4, '0')}`;
  }

  private buildItemData(item: CreateSaleItemDto) {
    const qty = item.quantity ?? 1;
    const raw = qty * item.unitPrice;
    const itemDiscount = Math.min(item.discountAmount ?? 0, raw);
    return {
      productId: item.productId,
      description: item.description ?? null,
      quantity: qty,
      unitPrice: item.unitPrice,
      discountAmount: itemDiscount,
      totalPrice: Math.max(0, raw - itemDiscount),
    };
  }

  async createWithTransaction(
    dto: { customerId?: string; notes?: string; soldAt?: string; discountAmount?: number; items: CreateSaleItemDto[] },
    saleNumber: string,
    createdById: string,
    totals: SaleTotals,
    status: SaleStatus,
  ) {
    return this.prisma.$transaction(async (tx) => {
      // Validate and deduct stock only for COMPLETED sales
      if (status === SaleStatus.COMPLETED) {
        // Aggregate quantities per product
        const productQtyMap = new Map<string, number>();
        for (const item of dto.items) {
          const current = productQtyMap.get(item.productId) ?? 0;
          productQtyMap.set(item.productId, current + item.quantity);
        }

        // Check stock availability
        for (const [productId, totalQty] of productQtyMap) {
          const product = await tx.product.findUnique({
            where: { id: productId },
            select: { id: true, name: true, stockQuantity: true },
          });
          if (!product) throw new Error(`Product ${productId} not found`);
          if (product.stockQuantity < totalQty) {
            throw new Error(
              `Insufficient stock for "${product.name}". Available: ${product.stockQuantity}, Required: ${totalQty}`,
            );
          }
        }

        // Deduct stock
        for (const [productId, totalQty] of productQtyMap) {
          await tx.product.update({
            where: { id: productId },
            data: { stockQuantity: { decrement: totalQty } },
          });
        }
      }

      return tx.sale.create({
        data: {
          saleNumber,
          customerId: dto.customerId ?? null,
          status,
          subtotal: totals.subtotal,
          discountAmount: Math.min(dto.discountAmount ?? 0, totals.subtotal),
          totalAmount: totals.totalAmount,
          notes: dto.notes ?? null,
          soldAt: dto.soldAt ? new Date(dto.soldAt) : new Date(),
          createdById,
          items: { create: dto.items.map((item) => this.buildItemData(item)) },
        },
        select: SALE_SELECT,
      });
    });
  }

  async findAll(dto: QuerySaleDto) {
    const { search, status, customerId, dateFrom, dateTo, page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { deletedAt: null };

    if (status) where.status = status;
    if (customerId) where.customerId = customerId;

    if (dateFrom || dateTo) {
      where.soldAt = {
        ...(dateFrom && { gte: new Date(dateFrom) }),
        ...(dateTo && { lte: new Date(dateTo) }),
      };
    }

    if (search) {
      where.OR = [
        { saleNumber: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
        { customer: { phone: { contains: search, mode: 'insensitive' } } },
        { items: { some: { product: { name: { contains: search, mode: 'insensitive' } } } } },
      ];
    }

    const prismaWhere = where as any;

    const [data, total] = await Promise.all([
      this.prisma.sale.findMany({
        where: prismaWhere,
        select: SALE_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.sale.count({ where: prismaWhere }),
    ]);

    return { data, total };
  }

  findById(id: string) {
    return this.prisma.sale.findFirst({
      where: { id, deletedAt: null },
      select: SALE_SELECT,
    });
  }

  async update(id: string, dto: UpdateSaleDto, totals?: SaleTotals) {
    const updateData: any = {};

    if (dto.customerId !== undefined) updateData.customerId = dto.customerId || null;
    if (dto.notes !== undefined) updateData.notes = dto.notes || null;
    if (dto.soldAt !== undefined) updateData.soldAt = new Date(dto.soldAt);

    if (dto.items !== undefined && totals) {
      updateData.subtotal = totals.subtotal;
      updateData.discountAmount = Math.min(dto.discountAmount ?? 0, totals.subtotal);
      updateData.totalAmount = totals.totalAmount;

      await this.prisma.saleItem.deleteMany({ where: { saleId: id } });
      updateData.items = {
        create: dto.items.map((item) => this.buildItemData(item)),
      };
    } else if (dto.discountAmount !== undefined && totals) {
      updateData.discountAmount = Math.min(dto.discountAmount, totals.subtotal);
    }

    return this.prisma.sale.update({
      where: { id },
      data: updateData,
      select: SALE_SELECT,
    });
  }

  cancel(id: string) {
    return this.prisma.sale.update({
      where: { id },
      data: { status: SaleStatus.CANCELLED },
      select: SALE_SELECT,
    });
  }

  async cancelAndRestoreStock(
    id: string,
    items: Array<{ productId: string; quantity: any }>,
  ) {
    return this.prisma.$transaction(async (tx) => {
      // Aggregate quantities and restore stock
      const productQtyMap = new Map<string, number>();
      for (const item of items) {
        const qty = parseFloat(item.quantity.toString());
        const current = productQtyMap.get(item.productId) ?? 0;
        productQtyMap.set(item.productId, current + qty);
      }

      for (const [productId, totalQty] of productQtyMap) {
        await tx.product.update({
          where: { id: productId },
          data: { stockQuantity: { increment: totalQty } },
        });
      }

      return tx.sale.update({
        where: { id },
        data: { status: SaleStatus.CANCELLED },
        select: SALE_SELECT,
      });
    });
  }

  async completeDraft(id: string, items: Array<{ productId: string; quantity: any }>) {
    return this.prisma.$transaction(async (tx) => {
      const productQtyMap = new Map<string, number>();
      for (const item of items) {
        const qty = parseFloat(item.quantity.toString());
        const current = productQtyMap.get(item.productId) ?? 0;
        productQtyMap.set(item.productId, current + qty);
      }

      for (const [productId, totalQty] of productQtyMap) {
        const product = await tx.product.findUnique({
          where: { id: productId },
          select: { id: true, name: true, stockQuantity: true },
        });
        if (!product) throw new Error(`Product ${productId} not found`);
        if (product.stockQuantity < totalQty) {
          throw new Error(
            `Insufficient stock for "${product.name}". Available: ${product.stockQuantity}, Required: ${totalQty}`,
          );
        }
      }

      for (const [productId, totalQty] of productQtyMap) {
        await tx.product.update({
          where: { id: productId },
          data: { stockQuantity: { decrement: totalQty } },
        });
      }

      return tx.sale.update({
        where: { id },
        data: { status: SaleStatus.COMPLETED },
        select: SALE_SELECT,
      });
    });
  }

  softDelete(id: string) {
    return this.prisma.sale.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: SALE_SELECT,
    });
  }
}
