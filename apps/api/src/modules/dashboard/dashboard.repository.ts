import { Injectable } from '@nestjs/common';

import {
  CommissionStatus,
  ExpenseStatus,
  ItemType,
  PaymentStatus,
  SaleStatus,
} from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';

function toNum(val: unknown): number {
  if (val === null || val === undefined) return 0;
  return parseFloat(val.toString());
}

@Injectable()
export class DashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const todayEnd = new Date(todayStart.getTime() + 86400000);

    const [
      totalCustomers,
      todaySalesAgg,
      todayOrdersCount,
      thisMonthSalesAgg,
      unpaidSalesAgg,
      unpaidCommissionAgg,
      todayExpensesAgg,
      thisMonthExpensesAgg,
    ] = await Promise.all([
      this.prisma.customer.count(),

      this.prisma.sale.aggregate({
        where: {
          saleStatus: SaleStatus.COMPLETED,
          createdAt: { gte: todayStart, lt: todayEnd },
        },
        _sum: { grandTotal: true },
      }),

      this.prisma.sale.count({
        where: {
          saleStatus: SaleStatus.COMPLETED,
          createdAt: { gte: todayStart, lt: todayEnd },
        },
      }),

      this.prisma.sale.aggregate({
        where: {
          saleStatus: SaleStatus.COMPLETED,
          createdAt: { gte: monthStart },
        },
        _sum: { grandTotal: true },
      }),

      this.prisma.sale.aggregate({
        where: {
          saleStatus: SaleStatus.COMPLETED,
          paymentStatus: { not: PaymentStatus.PAID },
        },
        _sum: { balanceAmount: true },
      }),

      this.prisma.sale.aggregate({
        where: { commissionStatus: CommissionStatus.UNPAID },
        _sum: { commissionAmount: true },
      }),

      this.prisma.expense.aggregate({
        where: {
          expenseStatus: { not: ExpenseStatus.VOIDED },
          expenseDate: { gte: todayStart, lt: todayEnd },
        },
        _sum: { amount: true },
      }),

      this.prisma.expense.aggregate({
        where: {
          expenseStatus: { not: ExpenseStatus.VOIDED },
          expenseDate: { gte: monthStart },
        },
        _sum: { amount: true },
      }),
    ]);

    return {
      todaySales: toNum(todaySalesAgg._sum.grandTotal),
      todayOrders: todayOrdersCount,
      thisMonthSales: toNum(thisMonthSalesAgg._sum.grandTotal),
      totalCustomers,
      unpaidSalesAmount: toNum(unpaidSalesAgg._sum.balanceAmount),
      unpaidCommissionAmount: toNum(unpaidCommissionAgg._sum.commissionAmount),
      todayExpenses: toNum(todayExpensesAgg._sum.amount),
      thisMonthExpenses: toNum(thisMonthExpensesAgg._sum.amount),
    };
  }

  async getRecentSales(dateFrom?: string, dateTo?: string) {
    const dateFilter =
      dateFrom || dateTo
        ? {
            ...(dateFrom && { gte: new Date(dateFrom) }),
            ...(dateTo && { lte: new Date(dateTo) }),
          }
        : undefined;

    return this.prisma.sale.findMany({
      where: {
        saleStatus: SaleStatus.COMPLETED,
        ...(dateFilter && { createdAt: dateFilter }),
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        invoiceNo: true,
        grandTotal: true,
        paymentStatus: true,
        saleStatus: true,
        createdAt: true,
        customer: { select: { id: true, name: true, phone: true } },
      },
    });
  }

  async getTopServices(dateFrom?: string, dateTo?: string) {
    const dateFilter =
      dateFrom || dateTo
        ? {
            ...(dateFrom && { gte: new Date(dateFrom) }),
            ...(dateTo && { lte: new Date(dateTo) }),
          }
        : undefined;

    const rows = await this.prisma.saleItem.groupBy({
      by: ['serviceId', 'nameSnapshot'],
      where: {
        itemType: ItemType.SERVICE,
        sale: {
          saleStatus: SaleStatus.COMPLETED,
          ...(dateFilter && { createdAt: dateFilter }),
        },
      },
      _sum: { total: true, quantity: true },
      _count: { id: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 10,
    });

    return rows.map((r) => ({
      serviceId: r.serviceId,
      nameSnapshot: r.nameSnapshot,
      totalRevenue: toNum(r._sum.total),
      totalQuantity: toNum(r._sum.quantity),
      orderCount: r._count.id,
    }));
  }

  async getTopProducts(dateFrom?: string, dateTo?: string) {
    const dateFilter =
      dateFrom || dateTo
        ? {
            ...(dateFrom && { gte: new Date(dateFrom) }),
            ...(dateTo && { lte: new Date(dateTo) }),
          }
        : undefined;

    const rows = await this.prisma.saleItem.groupBy({
      by: ['productId', 'nameSnapshot'],
      where: {
        itemType: ItemType.PRODUCT,
        sale: {
          saleStatus: SaleStatus.COMPLETED,
          ...(dateFilter && { createdAt: dateFilter }),
        },
      },
      _sum: { total: true, quantity: true },
      _count: { id: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 10,
    });

    return rows.map((r) => ({
      productId: r.productId,
      nameSnapshot: r.nameSnapshot,
      totalRevenue: toNum(r._sum.total),
      totalQuantity: toNum(r._sum.quantity),
      orderCount: r._count.id,
    }));
  }

  async getPaymentSummary(dateFrom?: string, dateTo?: string) {
    const dateFilter =
      dateFrom || dateTo
        ? {
            ...(dateFrom && { gte: new Date(dateFrom) }),
            ...(dateTo && { lte: new Date(dateTo) }),
          }
        : undefined;

    const rows = await this.prisma.payment.groupBy({
      by: ['paymentMethod'],
      where: {
        ...(dateFilter && { paidAt: dateFilter }),
      },
      _sum: { amount: true },
      _count: { id: true },
      orderBy: { _sum: { amount: 'desc' } },
    });

    return rows.map((r) => ({
      paymentMethod: r.paymentMethod,
      totalAmount: toNum(r._sum.amount),
      transactionCount: r._count.id,
    }));
  }
}
