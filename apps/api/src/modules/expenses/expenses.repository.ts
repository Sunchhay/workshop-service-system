import { Injectable } from '@nestjs/common';

import { CustomerType, ExpenseStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateExpenseDto } from './dto/create-expense.dto';
import type { QueryExpenseDto } from './dto/query-expense.dto';
import type { UpdateExpenseDto } from './dto/update-expense.dto';

const EXPENSE_SELECT = {
  id: true,
  expenseNo: true,
  title: true,
  category: true,
  amount: true,
  paymentMethod: true,
  expenseStatus: true,
  supplierId: true,
  mechanicId: true,
  referenceNo: true,
  imageUrl: true,
  note: true,
  expenseDate: true,
  createdById: true,
  voidReason: true,
  voidedAt: true,
  voidedById: true,
  createdAt: true,
  updatedAt: true,
  supplier: { select: { id: true, name: true, phone: true } },
  mechanic: { select: { id: true, name: true, phone: true, customerType: true } },
  createdBy: { select: { id: true, name: true } },
  voidedBy: { select: { id: true, name: true } },
} as const;

@Injectable()
export class ExpensesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async generateExpenseNo(): Promise<string> {
    const last = await this.prisma.expense.findFirst({
      where: { expenseNo: { startsWith: 'EXP-' } },
      orderBy: { createdAt: 'desc' },
      select: { expenseNo: true },
    });
    if (!last) return 'EXP-000001';
    const parts = last.expenseNo.split('-');
    const num = parseInt(parts[parts.length - 1], 10);
    return `EXP-${String(isNaN(num) ? 1 : num + 1).padStart(6, '0')}`;
  }

  supplierExists(id: string) {
    return this.prisma.supplier.findUnique({ where: { id }, select: { id: true } });
  }

  mechanicExists(id: string) {
    return this.prisma.customer.findFirst({
      where: { id, customerType: CustomerType.MECHANIC },
      select: { id: true },
    });
  }

  create(dto: CreateExpenseDto, expenseNo: string, createdById: string) {
    return this.prisma.expense.create({
      data: {
        expenseNo,
        title: dto.title,
        category: dto.category,
        amount: dto.amount,
        paymentMethod: dto.paymentMethod,
        expenseStatus: dto.expenseStatus ?? ExpenseStatus.PAID,
        supplierId: dto.supplierId,
        mechanicId: dto.mechanicId,
        referenceNo: dto.referenceNo,
        imageUrl: dto.imageUrl,
        note: dto.note,
        expenseDate: new Date(dto.expenseDate),
        createdById,
      },
      select: EXPENSE_SELECT,
    });
  }

  async findAll(dto: QueryExpenseDto) {
    const {
      search,
      expenseStatus,
      paymentMethod,
      supplierId,
      mechanicId,
      category,
      dateFrom,
      dateTo,
      page = 1,
      limit = 20,
    } = dto;
    const skip = (page - 1) * limit;

    const where = {
      ...(expenseStatus !== undefined && { expenseStatus }),
      ...(paymentMethod !== undefined && { paymentMethod }),
      ...(supplierId !== undefined && { supplierId }),
      ...(mechanicId !== undefined && { mechanicId }),
      ...(category !== undefined && {
        category: { contains: category, mode: 'insensitive' as const },
      }),
      ...(dateFrom !== undefined || dateTo !== undefined
        ? {
            expenseDate: {
              ...(dateFrom && { gte: new Date(dateFrom) }),
              ...(dateTo && { lte: new Date(dateTo) }),
            },
          }
        : {}),
      ...(search !== undefined && {
        OR: [
          { expenseNo: { contains: search, mode: 'insensitive' as const } },
          { title: { contains: search, mode: 'insensitive' as const } },
          { category: { contains: search, mode: 'insensitive' as const } },
          { referenceNo: { contains: search, mode: 'insensitive' as const } },
          { note: { contains: search, mode: 'insensitive' as const } },
          { supplier: { name: { contains: search, mode: 'insensitive' as const } } },
          { mechanic: { name: { contains: search, mode: 'insensitive' as const } } },
        ],
      }),
    };

    const [data, total, aggregate] = await Promise.all([
      this.prisma.expense.findMany({
        where,
        select: EXPENSE_SELECT,
        skip,
        take: limit,
        orderBy: { expenseDate: 'desc' },
      }),
      this.prisma.expense.count({ where }),
      this.prisma.expense.aggregate({ where, _sum: { amount: true } }),
    ]);

    return { data, total, totalAmount: aggregate._sum.amount?.toString() ?? '0' };
  }

  findById(id: string) {
    return this.prisma.expense.findUnique({ where: { id }, select: EXPENSE_SELECT });
  }

  update(id: string, dto: UpdateExpenseDto) {
    return this.prisma.expense.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.amount !== undefined && { amount: dto.amount }),
        ...(dto.paymentMethod !== undefined && { paymentMethod: dto.paymentMethod }),
        ...(dto.expenseStatus !== undefined && { expenseStatus: dto.expenseStatus }),
        ...(dto.supplierId !== undefined && { supplierId: dto.supplierId }),
        ...(dto.mechanicId !== undefined && { mechanicId: dto.mechanicId }),
        ...(dto.referenceNo !== undefined && { referenceNo: dto.referenceNo }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.note !== undefined && { note: dto.note }),
        ...(dto.expenseDate !== undefined && { expenseDate: new Date(dto.expenseDate) }),
      },
      select: EXPENSE_SELECT,
    });
  }

  void(id: string, voidReason: string, voidedById: string) {
    return this.prisma.expense.update({
      where: { id },
      data: {
        expenseStatus: ExpenseStatus.VOIDED,
        voidReason,
        voidedAt: new Date(),
        voidedById,
      },
      select: EXPENSE_SELECT,
    });
  }
}
