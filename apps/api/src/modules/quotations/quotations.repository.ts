import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

const QUOTATION_SELECT = {
  id: true,
  quotationNumber: true,
  customerId: true,
  customerName: true,
  customerPhone: true,
  status: true,
  items: true,
  subtotal: true,
  discountAmount: true,
  totalAmount: true,
  notes: true,
  validUntil: true,
  posCartId: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
  customer: { select: { id: true, code: true, name: true, phone: true } },
} as const;

interface QuotationData {
  quotationNumber: string;
  customerId?: string | null;
  customerName: string;
  customerPhone: string;
  posCartId?: string | null;
  notes?: string | null;
  validUntil?: Date | null;
  items: object[];
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  createdById: string;
}

@Injectable()
export class QuotationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async generateQuotationNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const last = await this.prisma.quotation.findFirst({
      where: { quotationNumber: { startsWith: `QUOT-${year}-` } },
      orderBy: { createdAt: 'desc' },
      select: { quotationNumber: true },
    });
    if (!last) return `QUOT-${year}-0001`;
    const num = parseInt(last.quotationNumber.split('-')[2], 10);
    return `QUOT-${year}-${String(num + 1).padStart(4, '0')}`;
  }

  async create(data: QuotationData) {
    return this.prisma.quotation.create({
      data: {
        quotationNumber: data.quotationNumber,
        customerId: data.customerId ?? null,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        posCartId: data.posCartId ?? null,
        notes: data.notes ?? null,
        validUntil: data.validUntil ?? null,
        items: data.items,
        subtotal: data.subtotal,
        discountAmount: data.discountAmount,
        totalAmount: data.totalAmount,
        createdById: data.createdById,
      },
      select: QUOTATION_SELECT,
    });
  }

  findById(id: string) {
    return this.prisma.quotation.findUnique({ where: { id }, select: QUOTATION_SELECT });
  }

  findAll(userId?: string) {
    return this.prisma.quotation.findMany({
      where: userId ? { createdById: userId } : {},
      select: QUOTATION_SELECT,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
