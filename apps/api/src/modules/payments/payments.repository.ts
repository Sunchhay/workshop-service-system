import { Injectable } from '@nestjs/common';

import { InvoiceStatus, PaymentMethod } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreatePaymentDto } from './dto/create-payment.dto';
import type { QueryPaymentDto } from './dto/query-payment.dto';

const PAYMENT_SELECT = {
  id: true,
  paymentNumber: true,
  invoiceId: true,
  customerId: true,
  amount: true,
  method: true,
  referenceNo: true,
  notes: true,
  paidAt: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
  invoice: {
    select: {
      id: true,
      invoiceNumber: true,
      totalAmount: true,
      paidAmount: true,
      dueAmount: true,
      status: true,
    },
  },
  customer: { select: { id: true, code: true, name: true, phone: true } },
  createdBy: { select: { id: true, name: true } },
} as const;

@Injectable()
export class PaymentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async generatePaymentNumber(): Promise<string> {
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

  async createWithTransaction(
    dto: CreatePaymentDto,
    paymentNumber: string,
    createdById: string,
    newPaidAmount: number,
    newDueAmount: number,
    newStatus: InvoiceStatus,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          paymentNumber,
          invoiceId: dto.invoiceId,
          customerId: dto.customerId,
          amount: dto.amount,
          method: dto.method as PaymentMethod,
          referenceNo: dto.referenceNo ?? null,
          notes: dto.notes ?? null,
          paidAt: dto.paidAt ? new Date(dto.paidAt) : new Date(),
          createdById,
        },
        select: PAYMENT_SELECT,
      });

      await tx.invoice.update({
        where: { id: dto.invoiceId },
        data: {
          paidAmount: newPaidAmount,
          dueAmount: newDueAmount,
          status: newStatus,
        },
      });

      return payment;
    });
  }

  async findAll(dto: QueryPaymentDto) {
    const {
      search,
      method,
      customerId,
      invoiceId,
      dateFrom,
      dateTo,
      page = 1,
      limit = 20,
    } = dto;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (method) where.method = method;
    if (customerId) where.customerId = customerId;
    if (invoiceId) where.invoiceId = invoiceId;

    if (dateFrom || dateTo) {
      where.paidAt = {
        ...(dateFrom && { gte: new Date(dateFrom) }),
        ...(dateTo && { lte: new Date(dateTo) }),
      };
    }

    if (search) {
      where.OR = [
        { paymentNumber: { contains: search, mode: 'insensitive' } },
        { referenceNo: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
        { invoice: { invoiceNumber: { contains: search, mode: 'insensitive' } } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
        { customer: { phone: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const prismaWhere = where as any;

    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({
        where: prismaWhere,
        select: PAYMENT_SELECT,
        skip,
        take: limit,
        orderBy: { paidAt: 'desc' },
      }),
      this.prisma.payment.count({ where: prismaWhere }),
    ]);

    return { data, total };
  }

  findById(id: string) {
    return this.prisma.payment.findUnique({
      where: { id },
      select: PAYMENT_SELECT,
    });
  }

  findByInvoiceId(invoiceId: string) {
    return this.prisma.payment.findMany({
      where: { invoiceId },
      select: PAYMENT_SELECT,
      orderBy: { paidAt: 'asc' },
    });
  }

  findByCustomerId(customerId: string) {
    return this.prisma.payment.findMany({
      where: { customerId },
      select: PAYMENT_SELECT,
      orderBy: { paidAt: 'desc' },
    });
  }
}
