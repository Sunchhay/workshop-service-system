import { Injectable, NotFoundException } from '@nestjs/common';

import { createResponse } from '../../common/types/api-response.type';
import type { CreateExpenseDto } from './dto/create-expense.dto';
import type { QueryExpenseDto } from './dto/query-expense.dto';
import type { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpensesRepository } from './expenses.repository';

@Injectable()
export class ExpensesService {
  constructor(private readonly expensesRepository: ExpensesRepository) {}

  async create(dto: CreateExpenseDto, createdById: string) {
    const expenseNumber = await this.expensesRepository.generateExpenseNumber();
    const expense = await this.expensesRepository.create(dto, expenseNumber, createdById);
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
    await this.findOne(id);
    const expense = await this.expensesRepository.update(id, dto);
    return createResponse(expense, 'Expense updated');
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.expensesRepository.softDelete(id);
    return createResponse(null, 'Expense deleted');
  }
}
