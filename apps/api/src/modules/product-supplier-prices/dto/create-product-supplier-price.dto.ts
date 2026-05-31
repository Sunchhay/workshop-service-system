import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductSupplierPriceDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  supplierId: string;

  @IsNumber()
  @Min(0)
  buyingPrice: number;

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
