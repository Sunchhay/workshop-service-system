import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { ItemType } from '../../../generated/prisma/enums';

export class AddCartItemDto {
  @IsEnum(ItemType)
  @IsNotEmpty()
  itemType: ItemType;

  @IsString()
  @IsOptional()
  serviceId?: string;

  @IsString()
  @IsOptional()
  productId?: string;

  @IsString()
  @IsOptional()
  machineModelId?: string;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsNumber()
  @Min(0.001)
  @IsOptional()
  quantity?: number;

  @IsString()
  @IsOptional()
  note?: string;
}
