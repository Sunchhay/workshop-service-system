import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { PriceType } from '../../../generated/prisma/enums';

export class UpdateServiceDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  nameEn?: string;

  @IsString()
  @IsOptional()
  nameKh?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  relatedComponent?: string;

  @IsEnum(PriceType)
  @IsOptional()
  priceType?: PriceType;

  @IsNumber()
  @Min(0)
  @IsOptional()
  defaultPrice?: number;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateServiceStatusDto {
  @IsBoolean()
  isActive: boolean;
}
