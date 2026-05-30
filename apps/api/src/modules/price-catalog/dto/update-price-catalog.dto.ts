import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdatePriceCatalogDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  serviceId?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  machineModelId?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  label?: string;

  @IsNumber()
  @Min(0.01)
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

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdatePriceCatalogStatusDto {
  @IsBoolean()
  isActive: boolean;
}
