import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { CartStatus } from '../../../generated/prisma/enums';

export class QueryCartDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(CartStatus)
  @IsOptional()
  status?: CartStatus;

  @IsString()
  @IsOptional()
  customerId?: string;

  @IsString()
  @IsOptional()
  mechanicId?: string;

  @IsString()
  @IsOptional()
  createdById?: string;

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
