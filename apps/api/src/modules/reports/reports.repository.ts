import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryReportDto } from './dto/query-report.dto';

const TAKE = 500;

@Injectable()
export class ReportsRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildDateRange(fromDate?: string, toDate?: string) {
    if (!fromDate && !toDate) return undefined;
    const range: { gte?: Date; lte?: Date } = {};
    if (fromDate) range.gte = new Date(fromDate + 'T00:00:00');
    if (toDate) range.lte = new Date(toDate + 'T23:59:59');
    return range;
  }

  async getSummary(fromDate?: string, toDate?: string) {
    const dateRange = this.buildDateRange(fromDate, toDate);
    const [
      totalCustomers,
      totalServiceJobs,
      totalInvoices,
      invoiceAgg,
      paymentAgg,
      unpaidAgg,
      salesAgg,
      expenseAgg,
      allProducts,
    ] = await Promise.all([
      this.prisma.customer.count({ where: { deletedAt: null } }),
      this.prisma.serviceJob.count({
        where: { deletedAt: null, ...(dateRange ? { createdAt: dateRange } : {}) },
      }),
      this.prisma.invoice.count({
        where: { deletedAt: null, status: { not: 'CANCELLED' as any }, ...(dateRange ? { issuedAt: dateRange } : {}) },
      }),
      this.prisma.invoice.aggregate({
        where: { deletedAt: null, status: { not: 'CANCELLED' as any }, ...(dateRange ? { issuedAt: dateRange } : {}) },
        _sum: { totalAmount: true },
      }),
      this.prisma.payment.aggregate({
        where: { ...(dateRange ? { paidAt: dateRange } : {}) },
        _sum: { amount: true },
      }),
      this.prisma.invoice.aggregate({
        where: { deletedAt: null, status: { notIn: ['CANCELLED', 'PAID'] as any[] } },
        _sum: { dueAmount: true },
      }),
      this.prisma.sale.aggregate({
        where: { deletedAt: null, status: 'COMPLETED' as any, ...(dateRange ? { soldAt: dateRange } : {}) },
        _sum: { totalAmount: true },
      }),
      this.prisma.expense.aggregate({
        where: { deletedAt: null, ...(dateRange ? { expenseDate: dateRange } : {}) },
        _sum: { amount: true },
      }),
      this.prisma.product.findMany({
        where: { deletedAt: null, isActive: true },
        select: { stockQuantity: true, reorderLevel: true },
      }),
    ]);

    const lowStockCount = allProducts.filter(p => p.stockQuantity <= p.reorderLevel).length;
    const paymentTotal = parseFloat(paymentAgg._sum.amount?.toString() ?? '0');
    const expenseTotal = parseFloat(expenseAgg._sum.amount?.toString() ?? '0');

    return {
      totalCustomers,
      totalServiceJobs,
      totalInvoices,
      invoiceTotal: invoiceAgg._sum.totalAmount?.toString() ?? '0',
      paymentTotal: paymentAgg._sum.amount?.toString() ?? '0',
      unpaidTotal: unpaidAgg._sum.dueAmount?.toString() ?? '0',
      salesTotal: salesAgg._sum.totalAmount?.toString() ?? '0',
      expenseTotal: expenseAgg._sum.amount?.toString() ?? '0',
      profitEstimate: (paymentTotal - expenseTotal).toFixed(2),
      lowStockCount,
    };
  }

  async getServiceJobs(dto: QueryReportDto) {
    const dateRange = this.buildDateRange(dto.fromDate, dto.toDate);
    const where: any = {
      deletedAt: null,
      ...(dateRange ? { createdAt: dateRange } : {}),
      ...(dto.status ? { status: dto.status as any } : {}),
      ...(dto.priority ? { priority: dto.priority as any } : {}),
      ...(dto.customerId ? { customerId: dto.customerId } : {}),
    };

    return this.prisma.serviceJob.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: TAKE,
      select: {
        id: true,
        jobCode: true,
        status: true,
        priority: true,
        partDescription: true,
        createdAt: true,
        completedAt: true,
        customer: { select: { id: true, name: true, phone: true } },
        assignedTo: { select: { id: true, name: true } },
        _count: { select: { items: true } },
      },
    });
  }

  async getInvoices(dto: QueryReportDto) {
    const dateRange = this.buildDateRange(dto.fromDate, dto.toDate);
    const where: any = {
      deletedAt: null,
      ...(dateRange ? { issuedAt: dateRange } : {}),
      ...(dto.status ? { status: dto.status as any } : {}),
      ...(dto.customerId ? { customerId: dto.customerId } : {}),
    };

    return this.prisma.invoice.findMany({
      where,
      orderBy: { issuedAt: 'desc' },
      take: TAKE,
      select: {
        id: true,
        invoiceNumber: true,
        status: true,
        subtotal: true,
        discountAmount: true,
        taxAmount: true,
        totalAmount: true,
        paidAmount: true,
        dueAmount: true,
        issuedAt: true,
        dueDate: true,
        customer: { select: { id: true, name: true, phone: true } },
      },
    });
  }

  async getPayments(dto: QueryReportDto) {
    const dateRange = this.buildDateRange(dto.fromDate, dto.toDate);
    const where: any = {
      ...(dateRange ? { paidAt: dateRange } : {}),
      ...(dto.paymentMethod ? { method: dto.paymentMethod as any } : {}),
      ...(dto.customerId ? { customerId: dto.customerId } : {}),
    };

    return this.prisma.payment.findMany({
      where,
      orderBy: { paidAt: 'desc' },
      take: TAKE,
      select: {
        id: true,
        paymentNumber: true,
        amount: true,
        method: true,
        referenceNo: true,
        paidAt: true,
        invoice: { select: { id: true, invoiceNumber: true } },
        customer: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true } },
      },
    });
  }

  async getSales(dto: QueryReportDto) {
    const dateRange = this.buildDateRange(dto.fromDate, dto.toDate);
    const where: any = {
      deletedAt: null,
      ...(dateRange ? { soldAt: dateRange } : {}),
      ...(dto.status ? { status: dto.status as any } : {}),
      ...(dto.customerId ? { customerId: dto.customerId } : {}),
    };

    return this.prisma.sale.findMany({
      where,
      orderBy: { soldAt: 'desc' },
      take: TAKE,
      select: {
        id: true,
        saleNumber: true,
        status: true,
        subtotal: true,
        discountAmount: true,
        totalAmount: true,
        soldAt: true,
        customer: { select: { id: true, name: true } },
        _count: { select: { items: true } },
      },
    });
  }

  async getExpenses(dto: QueryReportDto) {
    const dateRange = this.buildDateRange(dto.fromDate, dto.toDate);
    const where: any = {
      deletedAt: null,
      ...(dateRange ? { expenseDate: dateRange } : {}),
      ...(dto.category ? { category: dto.category as any } : {}),
      ...(dto.paymentMethod ? { method: dto.paymentMethod as any } : {}),
      ...(dto.customerId ? { createdById: dto.customerId } : {}),
    };

    return this.prisma.expense.findMany({
      where,
      orderBy: { expenseDate: 'desc' },
      take: TAKE,
      select: {
        id: true,
        expenseNumber: true,
        category: true,
        description: true,
        amount: true,
        method: true,
        referenceNo: true,
        expenseDate: true,
        createdBy: { select: { id: true, name: true } },
      },
    });
  }

  async getProfit(fromDate?: string, toDate?: string) {
    const dateRange = this.buildDateRange(fromDate, toDate);
    const [invoiceAgg, salesAgg, paymentAgg, expenseAgg, unpaidAgg] = await Promise.all([
      this.prisma.invoice.aggregate({
        where: { deletedAt: null, status: { not: 'CANCELLED' as any }, ...(dateRange ? { issuedAt: dateRange } : {}) },
        _sum: { totalAmount: true },
      }),
      this.prisma.sale.aggregate({
        where: { deletedAt: null, status: 'COMPLETED' as any, ...(dateRange ? { soldAt: dateRange } : {}) },
        _sum: { totalAmount: true },
      }),
      this.prisma.payment.aggregate({
        where: { ...(dateRange ? { paidAt: dateRange } : {}) },
        _sum: { amount: true },
      }),
      this.prisma.expense.aggregate({
        where: { deletedAt: null, ...(dateRange ? { expenseDate: dateRange } : {}) },
        _sum: { amount: true },
      }),
      this.prisma.invoice.aggregate({
        where: { deletedAt: null, status: { notIn: ['CANCELLED', 'PAID'] as any[] } },
        _sum: { dueAmount: true },
      }),
    ]);

    const paymentReceived = parseFloat(paymentAgg._sum.amount?.toString() ?? '0');
    const expenseTotal = parseFloat(expenseAgg._sum.amount?.toString() ?? '0');

    return {
      invoiceTotal: invoiceAgg._sum.totalAmount?.toString() ?? '0',
      salesTotal: salesAgg._sum.totalAmount?.toString() ?? '0',
      paymentReceived: paymentAgg._sum.amount?.toString() ?? '0',
      expenseTotal: expenseAgg._sum.amount?.toString() ?? '0',
      estimatedProfit: (paymentReceived - expenseTotal).toFixed(2),
      unpaidAmount: unpaidAgg._sum.dueAmount?.toString() ?? '0',
    };
  }

  async getUnpaidBalances(dto: QueryReportDto) {
    const dateRange = this.buildDateRange(dto.fromDate, dto.toDate);
    const where: any = {
      deletedAt: null,
      status: { notIn: ['CANCELLED', 'PAID'] as any[] },
      ...(dateRange ? { issuedAt: dateRange } : {}),
      ...(dto.customerId ? { customerId: dto.customerId } : {}),
    };

    return this.prisma.invoice.findMany({
      where,
      orderBy: { issuedAt: 'desc' },
      take: TAKE,
      select: {
        id: true,
        invoiceNumber: true,
        status: true,
        totalAmount: true,
        paidAmount: true,
        dueAmount: true,
        issuedAt: true,
        dueDate: true,
        customer: { select: { id: true, name: true, phone: true } },
      },
    });
  }

  async getProducts(dto: QueryReportDto) {
    const where: any = {
      deletedAt: null,
      ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
      ...(dto.componentPartType ? { componentPartType: dto.componentPartType } : {}),
      ...(dto.category ? { category: dto.category } : {}),
    };

    const products = await this.prisma.product.findMany({
      where,
      orderBy: { name: 'asc' },
      take: TAKE,
      select: {
        id: true,
        code: true,
        name: true,
        category: true,
        componentPartType: true,
        supplier: true,
        stockQuantity: true,
        reorderLevel: true,
        costPrice: true,
        sellingPrice: true,
        isActive: true,
      },
    });

    return products
      .filter(p => dto.isLowStock ? p.stockQuantity <= p.reorderLevel : true)
      .map(p => ({ ...p, isLowStock: p.stockQuantity <= p.reorderLevel }));
  }

  async getLowStock() {
    const products = await this.prisma.product.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: { stockQuantity: 'asc' },
      select: {
        id: true,
        code: true,
        name: true,
        category: true,
        componentPartType: true,
        supplier: true,
        stockQuantity: true,
        reorderLevel: true,
      },
    });

    return products.filter(p => p.stockQuantity <= p.reorderLevel);
  }
}
