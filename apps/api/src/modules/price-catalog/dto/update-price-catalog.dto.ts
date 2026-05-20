import {
  IsBoolean,
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

export class UpdatePriceCatalogDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  serviceId?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  label?: string;

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
  customerType?: CustomerType | null;

  @IsNumber()
  @Min(0)
  @IsOptional()
  unitPrice?: number;

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
  expiredDate?: string | null;
}

export class UpdatePriceCatalogStatusDto {
  @IsBoolean()
  isActive: boolean;
}
