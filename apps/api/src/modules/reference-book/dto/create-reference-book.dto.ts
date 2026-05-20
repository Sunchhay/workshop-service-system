import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import {
  ReferenceSourceType,
  VerificationStatus,
} from '../../../generated/prisma/enums';

export class CreateReferenceBookDto {
  @IsString()
  @IsOptional()
  machineModelId?: string | null;

  @IsString()
  @IsOptional()
  componentType?: string;

  @IsString()
  @IsNotEmpty()
  partName: string;

  @IsString()
  @IsOptional()
  partCode?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => (value !== undefined && value !== '' ? Number(value) : undefined))
  standardSize?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => (value !== undefined && value !== '' ? Number(value) : undefined))
  wearLimit?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => (value !== undefined && value !== '' ? Number(value) : undefined))
  serviceLimit?: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsArray()
  @IsOptional()
  measurementDetails?: Record<string, string>[];

  @IsEnum(ReferenceSourceType)
  @IsOptional()
  sourceType?: ReferenceSourceType;

  @IsEnum(VerificationStatus)
  @IsOptional()
  verificationStatus?: VerificationStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}
