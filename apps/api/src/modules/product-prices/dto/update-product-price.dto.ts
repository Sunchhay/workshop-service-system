import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { RecordStatus } from '../../../generated/prisma/enums';

export class UpdateProductPriceDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  productId?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  machineModelId?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  ownerPrice?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  mechanicPrice?: number;

  @IsString()
  @IsOptional()
  note?: string;

  @IsEnum(RecordStatus)
  @IsOptional()
  status?: RecordStatus;
}

export class UpdateProductPriceStatusDto {
  @IsEnum(RecordStatus)
  @IsNotEmpty()
  status: RecordStatus;
}
