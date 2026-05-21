import { Injectable } from '@nestjs/common';

import { ExpenseCategory, PaymentMethod } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateExpenseDto } from './dto/create-expense.dto';
import type { QueryExpenseDto } from './dto/query-expense.dto';
import type { UpdateExpenseDto } from './dto/update-expense.dto';

const EXPENSE_SELECT = {
  id: true,
  expenseNumber: true,
  category: true,
  description: true,
  amount: true,
  method: true,
  referenceNo: true,
  notes: true,
  expenseDate: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
  createdBy: { select: { id: true, name: true } },
} as const;

@Injectable()
export class ExpensesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async generateExpenseNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const last = await this.prisma.expense.findFirst({
      where: { expenseNumber: { startsWith: `EXP-${year}-` } },
      orderBy: { createdAt: 'desc' },
      select: { expenseNumber: true },
    });
    if (!last) return `EXP-${year}-0001`;
    const num = parseInt(last.expenseNumber.split('-')[2], 10);
    return `EXP-${year}-${String(num + 1).padStart(4, '0')}`;
  }

  async create(dto: CreateExpenseDto, expenseNumber: string, createdById: string) {
    return this.prisma.expense.create({
      data: {
        expenseNumber,
        category: dto.category as ExpenseCategory,
        description: dto.description,
        amount: dto.amount,
        method: dto.method as PaymentMethod,
        referenceNo: dto.referenceNo ?? null,
        notes: dto.notes ?? null,
        expenseDate: dto.expenseDate ? new Date(dto.expenseDate) : new Date(),
        createdById,
      },
      select: EXPENSE_SELECT,
    });
  }

  async findAll(dto: QueryExpenseDto) {
    const { search, category, method, createdById, dateFrom, dateTo, page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { deletedAt: null };

    if (category) where.category = category;
    if (method) where.method = method;
    if (createdById) where.createdById = createdById;

    if (dateFrom || dateTo) {
      where.expenseDate = {
        ...(dateFrom && { gte: new Date(dateFrom) }),
        ...(dateTo && { lte: new Date(dateTo) }),
      };
    }

    if (search) {
      where.OR = [
        { expenseNumber: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { referenceNo: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
      ];
    }

    const prismaWhere = where as any;

    const [data, total, aggregate] = await Promise.all([
      this.prisma.expense.findMany({
        where: prismaWhere,
        select: EXPENSE_SELECT,
        skip,
        take: limit,
        orderBy: { expenseDate: 'desc' },
      }),
      this.prisma.expense.count({ where: prismaWhere }),
      this.prisma.expense.aggregate({ where: prismaWhere, _sum: { amount: true } }),
    ]);

    return { data, total, totalAmount: aggregate._sum.amount?.toString() ?? '0' };
  }

  findById(id: string) {
    return this.prisma.expense.findFirst({
      where: { id, deletedAt: null },
      select: EXPENSE_SELECT,
    });
  }

  async update(id: string, dto: UpdateExpenseDto) {
    return this.prisma.expense.update({
      where: { id },
      data: {
        ...(dto.category && { category: dto.category as ExpenseCategory }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.amount !== undefined && { amount: dto.amount }),
        ...(dto.method && { method: dto.method as PaymentMethod }),
        ...(dto.referenceNo !== undefined && { referenceNo: dto.referenceNo || null }),
        ...(dto.notes !== undefined && { notes: dto.notes || null }),
        ...(dto.expenseDate && { expenseDate: new Date(dto.expenseDate) }),
      },
      select: EXPENSE_SELECT,
    });
  }

  async softDelete(id: string) {
    await this.prisma.expense.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
