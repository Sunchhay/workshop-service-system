import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { RequestUser } from '../../common/types/jwt-payload.type';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { QueryExpenseDto } from './dto/query-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpensesService } from './expenses.service';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  // POST /api/expenses
  @Post()
  create(@Body() dto: CreateExpenseDto, @CurrentUser() user: RequestUser) {
    return this.expensesService.create(dto, user.id);
  }

  // GET /api/expenses
  @Get()
  findAll(@Query() query: QueryExpenseDto) {
    return this.expensesService.findAll(query);
  }

  // GET /api/expenses/:id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const expense = await this.expensesService.findOne(id);
    return { success: true, data: expense };
  }

  // PATCH /api/expenses/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateExpenseDto) {
    return this.expensesService.update(id, dto);
  }

  // DELETE /api/expenses/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expensesService.remove(id);
  }
}
