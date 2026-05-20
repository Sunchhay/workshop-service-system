import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AdjustStockDto {
  @IsNumber()
  quantityChange: number;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsString()
  @IsOptional()
  note?: string;
}
