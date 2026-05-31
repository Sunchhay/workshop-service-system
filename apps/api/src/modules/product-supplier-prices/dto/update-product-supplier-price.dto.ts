import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateProductSupplierPriceDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  productId?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  supplierId?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  buyingPrice?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsDateString()
  @IsOptional()
  lastUpdatedAt?: string;

  @IsString()
  @IsOptional()
  note?: string;
}
