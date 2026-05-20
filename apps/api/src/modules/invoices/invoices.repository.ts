import { Injectable } from '@nestjs/common';

import { InvoiceStatus, ItemType } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateInvoiceDto, CreateInvoiceItemDto } from './dto/create-invoice.dto';
import type { QueryInvoiceDto } from './dto/query-invoice.dto';
import type { UpdateInvoiceDto } from './dto/update-invoice.dto';

const INVOICE_SELECT = {
  id: true,
  invoiceNumber: true,
  customerId: true,
  serviceJobId: true,
  saleId: true,
  status: true,
  subtotal: true,
  discountAmount: true,
  taxAmount: true,
  totalAmount: true,
  paidAmount: true,
  dueAmount: true,
  notes: true,
  issuedAt: true,
  dueDate: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
  customer: { select: { id: true, code: true, name: true, phone: true } },
  serviceJob: { select: { id: true, jobCode: true, partDescription: true } },
  createdBy: { select: { id: true, name: true } },
  items: {
    select: {
      id: true,
      invoiceId: true,
      type: true,
      serviceId: true,
      productId: true,
      description: true,
      quantity: true,
      unitPrice: true,
      discountAmount: true,
      totalPrice: true,
      createdAt: true,
      updatedAt: true,
      service: { select: { id: true, code: true, nameEn: true } },
      product: { select: { id: true, code: true, name: true } },
    },
    orderBy: { createdAt: 'asc' as const },
  },
} as const;

export interface InvoiceTotals {
  subtotal: number;
  totalAmount: number;
  dueAmount: number;
}

export function calcTotals(
  items: CreateInvoiceItemDto[],
  invoiceDiscount = 0,
  taxAmount = 0,
  paidAmount = 0,
): InvoiceTotals {
  const subtotal = items.reduce((sum, item) => {
    const qty = item.quantity ?? 1;
    const raw = qty * item.unitPrice;
    const itemDiscount = Math.min(item.discountAmount ?? 0, raw);
    return sum + Math.max(0, raw - itemDiscount);
  }, 0);

  const cappedDiscount = Math.min(invoiceDiscount, subtotal);
  const totalAmount = Math.max(0, subtotal - cappedDiscount + taxAmount);
  const dueAmount = Math.max(0, totalAmount - paidAmount);
  return { subtotal, totalAmount, dueAmount };
}

@Injectable()
export class InvoicesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async generateInvoiceNumber(): Promise<string> {
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

  private buildItemData(item: CreateInvoiceItemDto) {
    const qty = item.quantity ?? 1;
    const raw = qty * item.unitPrice;
    const itemDiscount = Math.min(item.discountAmount ?? 0, raw);
    return {
      type: (item.type ?? 'SERVICE') as ItemType,
      serviceId: item.serviceId ?? null,
      productId: item.productId ?? null,
      description: item.description,
      quantity: qty,
      unitPrice: item.unitPrice,
      discountAmount: itemDiscount,
      totalPrice: Math.max(0, raw - itemDiscount),
    };
  }

  async create(
    dto: CreateInvoiceDto,
    invoiceNumber: string,
    createdById: string,
    totals: InvoiceTotals,
  ) {
    return this.prisma.invoice.create({
      data: {
        invoiceNumber,
        customerId: dto.customerId,
        serviceJobId: dto.serviceJobId ?? null,
        discountAmount: Math.min(dto.discountAmount ?? 0, totals.subtotal),
        taxAmount: dto.taxAmount ?? 0,
        subtotal: totals.subtotal,
        totalAmount: totals.totalAmount,
        paidAmount: 0,
        dueAmount: totals.dueAmount,
        notes: dto.notes ?? null,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        createdById,
        items: {
          create: dto.items.map((item) => this.buildItemData(item)),
        },
      },
      select: INVOICE_SELECT,
    });
  }

  async findAll(dto: QueryInvoiceDto) {
    const {
      search,
      status,
      customerId,
      serviceJobId,
      dateFrom,
      dateTo,
      page = 1,
      limit = 20,
    } = dto;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { deletedAt: null };

    if (status) where.status = status;
    if (customerId) where.customerId = customerId;
    if (serviceJobId) where.serviceJobId = serviceJobId;

    if (dateFrom || dateTo) {
      where.issuedAt = {
        ...(dateFrom && { gte: new Date(dateFrom) }),
        ...(dateTo && { lte: new Date(dateTo) }),
      };
    }

    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
        { customer: { phone: { contains: search, mode: 'insensitive' } } },
        { notes: { contains: search, mode: 'insensitive' } },
      ];
    }

    const prismaWhere = where as any;

    const [data, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where: prismaWhere,
        select: INVOICE_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.invoice.count({ where: prismaWhere }),
    ]);

    return { data, total };
  }

  findById(id: string) {
    return this.prisma.invoice.findFirst({
      where: { id, deletedAt: null },
      select: INVOICE_SELECT,
    });
  }

  async update(
    id: string,
    dto: UpdateInvoiceDto,
    totals?: InvoiceTotals,
  ) {
    const updateData: any = {};

    if (dto.customerId !== undefined) updateData.customerId = dto.customerId;
    if (dto.serviceJobId !== undefined) updateData.serviceJobId = dto.serviceJobId;
    if (dto.notes !== undefined) updateData.notes = dto.notes;
    if (dto.dueDate !== undefined) updateData.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
    if (dto.status !== undefined) updateData.status = dto.status;

    if (dto.items !== undefined && totals) {
      updateData.discountAmount = Math.min(dto.discountAmount ?? 0, totals.subtotal);
      updateData.taxAmount = dto.taxAmount ?? 0;
      updateData.subtotal = totals.subtotal;
      updateData.totalAmount = totals.totalAmount;
      updateData.dueAmount = totals.dueAmount;

      await this.prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });
      updateData.items = {
        create: (dto.items as CreateInvoiceItemDto[]).map((item) =>
          this.buildItemData(item),
        ),
      };
    } else {
      if (dto.discountAmount !== undefined) updateData.discountAmount = dto.discountAmount;
      if (dto.taxAmount !== undefined) updateData.taxAmount = dto.taxAmount;
    }

    return this.prisma.invoice.update({
      where: { id },
      data: updateData,
      select: INVOICE_SELECT,
    });
  }

  cancel(id: string) {
    return this.prisma.invoice.update({
      where: { id },
      data: { status: InvoiceStatus.CANCELLED },
      select: INVOICE_SELECT,
    });
  }

  softDelete(id: string) {
    return this.prisma.invoice.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: INVOICE_SELECT,
    });
  }

  findServiceJobWithItems(serviceJobId: string) {
    return this.prisma.serviceJob.findFirst({
      where: { id: serviceJobId, deletedAt: null },
      select: {
        id: true,
        customerId: true,
        jobCode: true,
        items: {
          select: {
            type: true,
            serviceId: true,
            productId: true,
            description: true,
            quantity: true,
            unitPrice: true,
          },
        },
      },
    });
  }
}
