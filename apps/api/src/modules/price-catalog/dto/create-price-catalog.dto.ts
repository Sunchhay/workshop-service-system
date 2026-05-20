import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import {
  CustomerType,
  DifficultyLevel,
} from '../../../generated/prisma/enums';

export class CreatePriceCatalogDto {
  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @IsString()
  @IsNotEmpty()
  label: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  sizeFrom?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  sizeTo?: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsEnum(DifficultyLevel)
  @IsOptional()
  difficultyLevel?: DifficultyLevel;

  @IsEnum(CustomerType)
  @IsOptional()
  customerType?: CustomerType;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsDateString()
  @IsOptional()
  effectiveDate?: string;

  @IsDateString()
  @IsOptional()
  expiredDate?: string;
}
