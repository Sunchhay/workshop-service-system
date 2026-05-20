import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { ItemType, Priority } from '../../../generated/prisma/enums';

export class UpdateServiceJobItemDto {
  @IsEnum(ItemType)
  @IsOptional()
  type?: ItemType;

  @IsString()
  @IsOptional()
  serviceId?: string;

  @IsString()
  @IsOptional()
  priceCatalogId?: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0.001)
  @IsOptional()
  quantity?: number;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsString()
  @IsOptional()
  measurement?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateServiceJobDto {
  @IsString()
  @IsOptional()
  machineModelId?: string | null;

  @IsString()
  @IsOptional()
  partDescription?: string;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsDateString()
  @IsOptional()
  estimatedCompletionDate?: string | null;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  technicianNotes?: string;

  @IsString()
  @IsOptional()
  assignedToId?: string | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateServiceJobItemDto)
  @IsOptional()
  items?: UpdateServiceJobItemDto[];
}
