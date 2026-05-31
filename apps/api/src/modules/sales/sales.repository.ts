import { Injectable } from '@nestjs/common';

import {
  CommissionStatus,
  PaymentStatus,
  SaleStatus,
} from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import type { QuerySaleDto } from './dto/query-sale.dto';

const SALE_ITEM_SELECT = {
  id: true,
  saleId: true,
  itemType: true,
  serviceId: true,
  productId: true,
  machineModelId: true,
  nameSnapshot: true,
  unitPrice: true,
  quantity: true,
  total: true,
  note: true,
  createdAt: true,
  service: { select: { id: true, code: true, name: true, nameEn: true } },
  product: { select: { id: true, code: true, name: true, nameEn: true } },
  machineModel: { select: { id: true, code: true, brand: true, modelName: true } },
} as const;

const PAYMENT_SELECT = {
  id: true,
  saleId: true,
  paymentMethod: true,
  amount: true,
  referenceNo: true,
  note: true,
  paidAt: true,
  createdAt: true,
} as const;

const SALE_SELECT = {
  id: true,
  invoiceNo: true,
  customerId: true,
  mechanicId: true,
  createdById: true,
  subtotal: true,
  grandTotal: true,
  paidAmount: true,
  balanceAmount: true,
  commissionAmount: true,
  commissionNote: true,
  commissionStatus: true,
  commissionPaidAt: true,
  paymentStatus: true,
  saleStatus: true,
  note: true,
  voidReason: true,
  voidedAt: true,
  voidedById: true,
  createdAt: true,
  updatedAt: true,
  customer: { select: { id: true, name: true, phone: true, customerType: true } },
  mechanic: { select: { id: true, name: true, phone: true, customerType: true } },
  createdBy: { select: { id: true, name: true } },
  voidedBy: { select: { id: true, name: true } },
  items: {
    select: SALE_ITEM_SELECT,
    orderBy: { createdAt: 'asc' as const },
  },
  payments: {
    select: PAYMENT_SELECT,
    orderBy: { paidAt: 'asc' as const },
  },
} as const;

@Injectable()
export class SalesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async generateInvoiceNo(): Promise<string> {
    const last = await this.prisma.sale.findFirst({
      where: { invoiceNo: { startsWith: 'INV-' } },
      orderBy: { createdAt: 'desc' },
      select: { invoiceNo: true },
    });
    if (!last) return 'INV-000001';
    const parts = last.invoiceNo.split('-');
    const num = parseInt(parts[parts.length - 1], 10);
    return `INV-${String(isNaN(num) ? 1 : num + 1).padStart(6, '0')}`;
  }

  async findAll(dto: QuerySaleDto) {
    const {
      search,
      saleStatus,
      paymentStatus,
      customerId,
      mechanicId,
      dateFrom,
      dateTo,
      page = 1,
      limit = 20,
    } = dto;
    const skip = (page - 1) * limit;

    const where = {
      ...(saleStatus !== undefined && { saleStatus }),
      ...(paymentStatus !== undefined && { paymentStatus }),
      ...(customerId !== undefined && { customerId }),
      ...(mechanicId !== undefined && { mechanicId }),
      ...(dateFrom !== undefined || dateTo !== undefined
        ? {
            createdAt: {
              ...(dateFrom && { gte: new Date(dateFrom) }),
              ...(dateTo && { lte: new Date(dateTo) }),
            },
          }
        : {}),
      ...(search !== undefined && {
        OR: [
          { invoiceNo: { contains: search, mode: 'insensitive' as const } },
          { note: { contains: search, mode: 'insensitive' as const } },
          { customer: { name: { contains: search, mode: 'insensitive' as const } } },
          { customer: { phone: { contains: search, mode: 'insensitive' as const } } },
          { mechanic: { name: { contains: search, mode: 'insensitive' as const } } },
          { mechanic: { phone: { contains: search, mode: 'insensitive' as const } } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.sale.findMany({
        where,
        select: SALE_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.sale.count({ where }),
    ]);

    return { data, total };
  }

  findById(id: string) {
    return this.prisma.sale.findUnique({ where: { id }, select: SALE_SELECT });
  }

  void(id: string, voidReason: string, voidedById: string) {
    return this.prisma.sale.update({
      where: { id },
      data: {
        saleStatus: SaleStatus.VOIDED,
        voidReason,
        voidedAt: new Date(),
        voidedById,
      },
      select: SALE_SELECT,
    });
  }

  markCommissionPaid(id: string) {
    return this.prisma.sale.update({
      where: { id },
      data: {
        commissionStatus: CommissionStatus.PAID,
        commissionPaidAt: new Date(),
      },
      select: SALE_SELECT,
    });
  }

  updatePaymentTotals(
    id: string,
    paidAmount: number,
    balanceAmount: number,
    paymentStatus: PaymentStatus,
  ) {
    return this.prisma.sale.update({
      where: { id },
      data: { paidAmount, balanceAmount, paymentStatus },
      select: SALE_SELECT,
    });
  }
}
