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
import { ItemType, JobStatus, Priority } from '../../../generated/prisma/enums';

export class CreateServiceJobItemDto {
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

export class CreateServiceJobDto {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsOptional()
  machineModelId?: string;

  @IsString()
  @IsNotEmpty()
  partDescription: string;

  @IsEnum(JobStatus)
  @IsOptional()
  status?: JobStatus;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsDateString()
  @IsOptional()
  estimatedCompletionDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  technicianNotes?: string;

  @IsString()
  @IsOptional()
  assignedToId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateServiceJobItemDto)
  @IsOptional()
  items?: CreateServiceJobItemDto[];
}
