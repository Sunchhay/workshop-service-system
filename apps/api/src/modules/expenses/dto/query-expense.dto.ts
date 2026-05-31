import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { ExpenseStatus, PaymentMethod } from '../../../generated/prisma/enums';

export class QueryExpenseDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(ExpenseStatus)
  @IsOptional()
  expenseStatus?: ExpenseStatus;

  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @IsString()
  @IsOptional()
  supplierId?: string;

  @IsString()
  @IsOptional()
  mechanicId?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  dateFrom?: string;

  @IsString()
  @IsOptional()
  dateTo?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => Number(value))
  page?: number;

  @IsInt()
  @Min(1)
  @Max(500)
  @IsOptional()
  @Transform(({ value }) => Number(value))
  limit?: number;
}
