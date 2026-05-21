import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalCustomers,
      todayNewJobs,
      pendingJobs,
      inProgressJobs,
      completedJobs,
      invoiceTodayAgg,
      invoiceMonthAgg,
      paymentsTodayAgg,
      paymentsMonthAgg,
      totalUnpaidAgg,
      expensesTodayAgg,
      expensesMonthAgg,
      allActiveProducts,
    ] = await Promise.all([
      this.prisma.customer.count({ where: { deletedAt: null } }),

      this.prisma.serviceJob.count({
        where: { deletedAt: null, createdAt: { gte: todayStart } },
      }),

      this.prisma.serviceJob.count({
        where: { deletedAt: null, status: 'PENDING' },
      }),

      this.prisma.serviceJob.count({
        where: { deletedAt: null, status: 'IN_PROGRESS' },
      }),

      this.prisma.serviceJob.count({
        where: { deletedAt: null, status: { in: ['COMPLETED', 'DELIVERED'] } },
      }),

      this.prisma.invoice.aggregate({
        where: {
          deletedAt: null,
          status: { not: 'CANCELLED' },
          issuedAt: { gte: todayStart },
        },
        _sum: { totalAmount: true },
      }),

      this.prisma.invoice.aggregate({
        where: {
          deletedAt: null,
          status: { not: 'CANCELLED' },
          issuedAt: { gte: monthStart },
        },
        _sum: { totalAmount: true },
      }),

      this.prisma.payment.aggregate({
        where: { paidAt: { gte: todayStart } },
        _sum: { amount: true },
      }),

      this.prisma.payment.aggregate({
        where: { paidAt: { gte: monthStart } },
        _sum: { amount: true },
      }),

      this.prisma.invoice.aggregate({
        where: {
          deletedAt: null,
          status: { notIn: ['CANCELLED', 'PAID'] },
        },
        _sum: { dueAmount: true },
      }),

      this.prisma.expense.aggregate({
        where: { deletedAt: null, expenseDate: { gte: todayStart } },
        _sum: { amount: true },
      }),

      this.prisma.expense.aggregate({
        where: { deletedAt: null, expenseDate: { gte: monthStart } },
        _sum: { amount: true },
      }),

      this.prisma.product.findMany({
        where: { deletedAt: null, isActive: true },
        select: { stockQuantity: true, reorderLevel: true },
      }),
    ]);

    const lowStockCount = allActiveProducts.filter(
      (p) => p.stockQuantity <= p.reorderLevel,
    ).length;

    return {
      totalCustomers,
      todayNewJobs,
      pendingJobs,
      inProgressJobs,
      completedJobs,
      invoiceTotalToday: invoiceTodayAgg._sum.totalAmount?.toString() ?? '0',
      invoiceTotalMonth: invoiceMonthAgg._sum.totalAmount?.toString() ?? '0',
      paymentsTotalToday: paymentsTodayAgg._sum.amount?.toString() ?? '0',
      paymentsTotalMonth: paymentsMonthAgg._sum.amount?.toString() ?? '0',
      totalUnpaidAmount: totalUnpaidAgg._sum.dueAmount?.toString() ?? '0',
      expensesToday: expensesTodayAgg._sum.amount?.toString() ?? '0',
      expensesMonth: expensesMonthAgg._sum.amount?.toString() ?? '0',
      lowStockCount,
    };
  }

  async getRecentServiceJobs() {
    return this.prisma.serviceJob.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: {
        id: true,
        jobCode: true,
        status: true,
        priority: true,
        createdAt: true,
        partDescription: true,
        customer: { select: { id: true, name: true, phone: true } },
      },
    });
  }

  async getRecentTransactions() {
    return this.prisma.payment.findMany({
      orderBy: { paidAt: 'desc' },
      take: 8,
      select: {
        id: true,
        paymentNumber: true,
        amount: true,
        method: true,
        paidAt: true,
        customer: { select: { id: true, name: true } },
        invoice: { select: { id: true, invoiceNumber: true } },
      },
    });
  }

  async getLowStockProducts() {
    const products = await this.prisma.product.findMany({
      where: { deletedAt: null, isActive: true },
      select: {
        id: true,
        code: true,
        name: true,
        unit: true,
        stockQuantity: true,
        reorderLevel: true,
      },
      orderBy: { stockQuantity: 'asc' },
    });
    return products.filter((p) => p.stockQuantity <= p.reorderLevel).slice(0, 10);
  }
}
