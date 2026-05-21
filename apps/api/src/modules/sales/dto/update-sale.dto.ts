import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

import { CreateSaleItemDto } from './create-sale.dto';

export class UpdateSaleDto {
  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  discountAmount?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  soldAt?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemDto)
  @ArrayMinSize(1)
  items?: CreateSaleItemDto[];
}
