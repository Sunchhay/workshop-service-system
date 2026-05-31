import { Injectable } from '@nestjs/common';

import {
  CommissionStatus,
  ExpenseStatus,
  ItemType,
  PaymentStatus,
  SaleStatus,
} from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import type { QueryReportDto } from './dto/query-report.dto';

function toNum(val: unknown): number {
  if (val === null || val === undefined) return 0;
  return parseFloat(val.toString());
}

const SALE_SELECT = {
  id: true,
  invoiceNo: true,
  grandTotal: true,
  paidAmount: true,
  balanceAmount: true,
  paymentStatus: true,
  saleStatus: true,
  commissionStatus: true,
  commissionAmount: true,
  note: true,
  createdAt: true,
  customer: { select: { id: true, name: true, phone: true } },
  mechanic: { select: { id: true, name: true, phone: true } },
} as const;

const PAYMENT_SELECT = {
  id: true,
  paymentMethod: true,
  amount: true,
  referenceNo: true,
  note: true,
  paidAt: true,
  createdAt: true,
  sale: { select: { id: true, invoiceNo: true } },
} as const;

const EXPENSE_SELECT = {
  id: true,
  expenseNo: true,
  title: true,
  category: true,
  amount: true,
  paymentMethod: true,
  expenseStatus: true,
  referenceNo: true,
  expenseDate: true,
  note: true,
  supplier: { select: { id: true, name: true, phone: true } },
  mechanic: { select: { id: true, name: true, phone: true } },
  createdBy: { select: { id: true, name: true } },
} as const;

@Injectable()
export class ReportsRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildDateRange(dateFrom?: string, dateTo?: string) {
    if (!dateFrom && !dateTo) return undefined;
    const range: { gte?: Date; lte?: Date } = {};
    if (dateFrom) range.gte = new Date(dateFrom + 'T00:00:00');
    if (dateTo) range.lte = new Date(dateTo + 'T23:59:59');
    return range;
  }

  async getSales(dto: QueryReportDto) {
    const { page = 1, limit = 50 } = dto;
    const skip = (page - 1) * limit;
    const dateRange = this.buildDateRange(dto.dateFrom, dto.dateTo);

    const listWhere = {
      ...(dateRange && { createdAt: dateRange }),
      ...(dto.saleStatus && { saleStatus: dto.saleStatus }),
      ...(dto.paymentStatus && { paymentStatus: dto.paymentStatus }),
      ...(dto.customerId && { customerId: dto.customerId }),
      ...(dto.mechanicId && { mechanicId: dto.mechanicId }),
    };

    // For aggregates, exclude VOIDED unless caller explicitly filters by VOIDED
    const totalsWhere = {
      ...listWhere,
      ...(dto.saleStatus === undefined && { saleStatus: { not: SaleStatus.VOIDED } }),
    };

    const [rows, total, totalsAgg, totalsCount] = await Promise.all([
      this.prisma.sale.findMany({
        where: listWhere,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: SALE_SELECT,
      }),
      this.prisma.sale.count({ where: listWhere }),
      this.prisma.sale.aggregate({
        where: totalsWhere,
        _sum: { grandTotal: true, paidAmount: true, balanceAmount: true },
      }),
      this.prisma.sale.count({ where: totalsWhere }),
    ]);

    return {
      items: rows,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      summary: {
        totalSales: toNum(totalsAgg._sum.grandTotal),
        totalPaid: toNum(totalsAgg._sum.paidAmount),
        totalBalance: toNum(totalsAgg._sum.balanceAmount),
        totalOrders: totalsCount,
      },
    };
  }

  async getPayments(dto: QueryReportDto) {
    const { page = 1, limit = 50 } = dto;
    const skip = (page - 1) * limit;
    const dateRange = this.buildDateRange(dto.dateFrom, dto.dateTo);

    const where = {
      ...(dateRange && { paidAt: dateRange }),
      ...(dto.paymentMethod && { paymentMethod: dto.paymentMethod }),
    };

    const [rows, total, grouped] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { paidAt: 'desc' },
        select: PAYMENT_SELECT,
      }),
      this.prisma.payment.count({ where }),
      this.prisma.payment.groupBy({
        by: ['paymentMethod'],
        where,
        _sum: { amount: true },
        _count: { id: true },
        orderBy: { _sum: { amount: 'desc' } },
      }),
    ]);

    return {
      grouped: grouped.map((g) => ({
        paymentMethod: g.paymentMethod,
        totalAmount: toNum(g._sum.amount),
        transactionCount: g._count.id,
      })),
      items: rows,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getExpenses(dto: QueryReportDto) {
    const { page = 1, limit = 50 } = dto;
    const skip = (page - 1) * limit;
    const dateRange = this.buildDateRange(dto.dateFrom, dto.dateTo);

    const listWhere = {
      ...(dateRange && { expenseDate: dateRange }),
      ...(dto.expenseStatus && { expenseStatus: dto.expenseStatus }),
      ...(dto.paymentMethod && { paymentMethod: dto.paymentMethod }),
      ...(dto.supplierId && { supplierId: dto.supplierId }),
      ...(dto.mechanicId && { mechanicId: dto.mechanicId }),
      ...(dto.category && { category: dto.category }),
    };

    // Exclude VOIDED from totals unless explicitly filtered
    const totalsWhere = {
      ...listWhere,
      ...(dto.expenseStatus === undefined && { expenseStatus: { not: ExpenseStatus.VOIDED } }),
    };

    const [rows, total, totalsAgg] = await Promise.all([
      this.prisma.expense.findMany({
        where: listWhere,
        skip,
        take: limit,
        orderBy: { expenseDate: 'desc' },
        select: EXPENSE_SELECT,
      }),
      this.prisma.expense.count({ where: listWhere }),
      this.prisma.expense.aggregate({
        where: totalsWhere,
        _sum: { amount: true },
      }),
    ]);

    return {
      items: rows,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      summary: { totalExpenses: toNum(totalsAgg._sum.amount) },
    };
  }

  async getProfitSummary(dto: QueryReportDto) {
    const dateRange = this.buildDateRange(dto.dateFrom, dto.dateTo);

    const salesWhere = {
      saleStatus: SaleStatus.COMPLETED,
      ...(dateRange && { createdAt: dateRange }),
    };

    const expensesWhere = {
      expenseStatus: { not: ExpenseStatus.VOIDED },
      ...(dateRange && { expenseDate: dateRange }),
    };

    const [salesAgg, expensesAgg] = await Promise.all([
      this.prisma.sale.aggregate({ where: salesWhere, _sum: { grandTotal: true } }),
      this.prisma.expense.aggregate({ where: expensesWhere, _sum: { amount: true } }),
    ]);

    const totalSales = toNum(salesAgg._sum.grandTotal);
    const totalExpenses = toNum(expensesAgg._sum.amount);

    return {
      totalSales,
      totalExpenses,
      estimatedProfit: parseFloat((totalSales - totalExpenses).toFixed(2)),
      dateFrom: dto.dateFrom ?? null,
      dateTo: dto.dateTo ?? null,
    };
  }

  async getMechanicCommissions(dto: QueryReportDto) {
    const { page = 1, limit = 50 } = dto;
    const skip = (page - 1) * limit;
    const dateRange = this.buildDateRange(dto.dateFrom, dto.dateTo);

    const baseWhere = {
      commissionStatus: { not: CommissionStatus.NONE } as object,
      ...(dateRange && { createdAt: dateRange }),
      ...(dto.mechanicId && { mechanicId: dto.mechanicId }),
    };

    const listWhere = {
      ...baseWhere,
      ...(dto.commissionStatus && { commissionStatus: dto.commissionStatus }),
    };

    const [rows, total, totalAgg, paidAgg, unpaidAgg] = await Promise.all([
      this.prisma.sale.findMany({
        where: listWhere,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          invoiceNo: true,
          commissionAmount: true,
          commissionStatus: true,
          commissionPaidAt: true,
          commissionNote: true,
          saleStatus: true,
          createdAt: true,
          mechanic: { select: { id: true, name: true, phone: true } },
        },
      }),
      this.prisma.sale.count({ where: listWhere }),
      this.prisma.sale.aggregate({ where: baseWhere, _sum: { commissionAmount: true } }),
      this.prisma.sale.aggregate({
        where: { ...baseWhere, commissionStatus: CommissionStatus.PAID },
        _sum: { commissionAmount: true },
      }),
      this.prisma.sale.aggregate({
        where: { ...baseWhere, commissionStatus: CommissionStatus.UNPAID },
        _sum: { commissionAmount: true },
      }),
    ]);

    return {
      items: rows,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      summary: {
        totalCommission: toNum(totalAgg._sum.commissionAmount),
        paidCommission: toNum(paidAgg._sum.commissionAmount),
        unpaidCommission: toNum(unpaidAgg._sum.commissionAmount),
      },
    };
  }

  async getCustomerDebts(dto: QueryReportDto) {
    const { page = 1, limit = 50 } = dto;
    const skip = (page - 1) * limit;

    const where = {
      saleStatus: SaleStatus.COMPLETED,
      balanceAmount: { gt: 0 },
      paymentStatus: { not: PaymentStatus.PAID },
    };

    const [rows, total, totalAgg] = await Promise.all([
      this.prisma.sale.findMany({
        where,
        skip,
        take: limit,
        orderBy: { balanceAmount: 'desc' },
        select: {
          id: true,
          invoiceNo: true,
          grandTotal: true,
          paidAmount: true,
          balanceAmount: true,
          paymentStatus: true,
          createdAt: true,
          customer: { select: { id: true, name: true, phone: true } },
        },
      }),
      this.prisma.sale.count({ where }),
      this.prisma.sale.aggregate({ where, _sum: { balanceAmount: true } }),
    ]);

    return {
      items: rows,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      summary: { totalDebt: toNum(totalAgg._sum.balanceAmount) },
    };
  }

  async getServiceUsage(dto: QueryReportDto) {
    const { page = 1, limit = 50 } = dto;
    const skip = (page - 1) * limit;
    const dateRange = this.buildDateRange(dto.dateFrom, dto.dateTo);

    const rows = await this.prisma.saleItem.groupBy({
      by: ['serviceId', 'nameSnapshot'],
      where: {
        itemType: ItemType.SERVICE,
        sale: {
          saleStatus: SaleStatus.COMPLETED,
          ...(dateRange && { createdAt: dateRange }),
        },
      },
      _sum: { total: true, quantity: true },
      _count: { id: true },
      orderBy: { _sum: { total: 'desc' } },
      skip,
      take: limit,
    });

    return {
      items: rows.map((r) => ({
        serviceId: r.serviceId,
        nameSnapshot: r.nameSnapshot,
        totalQuantity: toNum(r._sum.quantity),
        totalRevenue: toNum(r._sum.total),
        orderCount: r._count.id,
      })),
    };
  }

  async getProductSales(dto: QueryReportDto) {
    const { page = 1, limit = 50 } = dto;
    const skip = (page - 1) * limit;
    const dateRange = this.buildDateRange(dto.dateFrom, dto.dateTo);

    const rows = await this.prisma.saleItem.groupBy({
      by: ['productId', 'nameSnapshot'],
      where: {
        itemType: ItemType.PRODUCT,
        sale: {
          saleStatus: SaleStatus.COMPLETED,
          ...(dateRange && { createdAt: dateRange }),
        },
      },
      _sum: { total: true, quantity: true },
      _count: { id: true },
      orderBy: { _sum: { total: 'desc' } },
      skip,
      take: limit,
    });

    return {
      items: rows.map((r) => ({
        productId: r.productId,
        nameSnapshot: r.nameSnapshot,
        totalQuantity: toNum(r._sum.quantity),
        totalRevenue: toNum(r._sum.total),
        orderCount: r._count.id,
      })),
    };
  }
}
