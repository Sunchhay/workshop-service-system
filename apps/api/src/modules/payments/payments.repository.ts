import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import type { CreatePaymentDto } from './dto/create-payment.dto';
import type { QueryPaymentDto } from './dto/query-payment.dto';

const PAYMENT_SELECT = {
  id: true,
  saleId: true,
  paymentMethod: true,
  amount: true,
  referenceNo: true,
  note: true,
  paidAt: true,
  createdAt: true,
  sale: {
    select: {
      id: true,
      invoiceNo: true,
      grandTotal: true,
      paidAmount: true,
      balanceAmount: true,
      paymentStatus: true,
    },
  },
} as const;

@Injectable()
export class PaymentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreatePaymentDto & { saleId: string }) {
    return this.prisma.payment.create({
      data: {
        saleId: dto.saleId,
        paymentMethod: dto.paymentMethod,
        amount: dto.amount,
        referenceNo: dto.referenceNo,
        note: dto.note,
        paidAt: dto.paidAt ? new Date(dto.paidAt) : new Date(),
      },
      select: PAYMENT_SELECT,
    });
  }

  async findAll(dto: QueryPaymentDto) {
    const { search, paymentMethod, saleId, dateFrom, dateTo, page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    const where = {
      ...(paymentMethod !== undefined && { paymentMethod }),
      ...(saleId !== undefined && { saleId }),
      ...(dateFrom !== undefined || dateTo !== undefined
        ? {
            paidAt: {
              ...(dateFrom && { gte: new Date(dateFrom) }),
              ...(dateTo && { lte: new Date(dateTo) }),
            },
          }
        : {}),
      ...(search !== undefined && {
        OR: [
          { referenceNo: { contains: search, mode: 'insensitive' as const } },
          { note: { contains: search, mode: 'insensitive' as const } },
          { sale: { invoiceNo: { contains: search, mode: 'insensitive' as const } } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        select: PAYMENT_SELECT,
        skip,
        take: limit,
        orderBy: { paidAt: 'desc' },
      }),
      this.prisma.payment.count({ where }),
    ]);

    return { data, total };
  }

  findById(id: string) {
    return this.prisma.payment.findUnique({ where: { id }, select: PAYMENT_SELECT });
  }

  findBySaleId(saleId: string) {
    return this.prisma.payment.findMany({
      where: { saleId },
      select: PAYMENT_SELECT,
      orderBy: { paidAt: 'asc' },
    });
  }
}
