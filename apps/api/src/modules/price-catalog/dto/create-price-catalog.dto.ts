import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreatePriceCatalogDto {
  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @IsString()
  @IsNotEmpty()
  machineModelId: string;

  @IsString()
  @IsNotEmpty()
  label: string;

  @IsNumber()
  @Min(0.01)
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

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
