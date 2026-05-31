import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  createPaginatedResponse,
  createResponse,
} from '../../common/types/api-response.type';
import { ExpenseStatus } from '../../generated/prisma/enums';
import type { CreateExpenseDto } from './dto/create-expense.dto';
import type { QueryExpenseDto } from './dto/query-expense.dto';
import type { UpdateExpenseDto, VoidExpenseDto } from './dto/update-expense.dto';
import { ExpensesRepository } from './expenses.repository';

@Injectable()
export class ExpensesService {
  constructor(private readonly expensesRepository: ExpensesRepository) {}

  async create(dto: CreateExpenseDto, createdById: string) {
    if (dto.supplierId !== undefined) {
      const exists = await this.expensesRepository.supplierExists(dto.supplierId);
      if (!exists) throw new BadRequestException('Supplier not found');
    }

    if (dto.mechanicId !== undefined) {
      const exists = await this.expensesRepository.mechanicExists(dto.mechanicId);
      if (!exists) throw new BadRequestException('Mechanic not found or not a mechanic customer');
    }

    const expenseNo = await this.expensesRepository.generateExpenseNo();
    const expense = await this.expensesRepository.create(dto, expenseNo, createdById);
    return createResponse(expense, 'Expense created');
  }

  async findAll(dto: QueryExpenseDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const { data, total, totalAmount } = await this.expensesRepository.findAll(dto);
    return {
      success: true,
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalAmount,
      },
    };
  }

  async findOne(id: string) {
    const expense = await this.expensesRepository.findById(id);
    if (!expense) throw new NotFoundException('Expense not found');
    return expense;
  }

  async update(id: string, dto: UpdateExpenseDto) {
    const expense = await this.findOne(id);
    if (expense.expenseStatus === ExpenseStatus.VOIDED) {
      throw new BadRequestException('Cannot edit a voided expense');
    }

    if (dto.supplierId !== undefined) {
      const exists = await this.expensesRepository.supplierExists(dto.supplierId);
      if (!exists) throw new BadRequestException('Supplier not found');
    }

    if (dto.mechanicId !== undefined) {
      const exists = await this.expensesRepository.mechanicExists(dto.mechanicId);
      if (!exists) throw new BadRequestException('Mechanic not found or not a mechanic customer');
    }

    const updated = await this.expensesRepository.update(id, dto);
    return createResponse(updated, 'Expense updated');
  }

  async voidExpense(id: string, dto: VoidExpenseDto, voidedById: string) {
    const expense = await this.findOne(id);
    if (expense.expenseStatus === ExpenseStatus.VOIDED) {
      throw new BadRequestException('Expense is already voided');
    }
    const voided = await this.expensesRepository.void(id, dto.voidReason, voidedById);
    return createResponse(voided, 'Expense voided');
  }

  async remove(id: string, voidedById: string) {
    const expense = await this.findOne(id);
    if (expense.expenseStatus === ExpenseStatus.VOIDED) {
      throw new BadRequestException('Expense is already voided');
    }
    const voided = await this.expensesRepository.void(id, 'Deleted', voidedById);
    return createResponse(voided, 'Expense voided');
  }
}
