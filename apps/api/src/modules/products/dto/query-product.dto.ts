import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { RecordStatus } from '../../../generated/prisma/enums';

export class QueryProductDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(RecordStatus)
  @IsOptional()
  status?: RecordStatus;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  unit?: string;

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
