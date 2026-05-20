import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
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

export class UpdateReferenceBookDto {
  @IsOptional()
  machineModelId?: string | null;

  @IsString()
  @IsOptional()
  componentType?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  partName?: string;

  @IsString()
  @IsOptional()
  partCode?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => (value !== undefined && value !== null && value !== '' ? Number(value) : value))
  standardSize?: number | null;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => (value !== undefined && value !== null && value !== '' ? Number(value) : value))
  wearLimit?: number | null;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => (value !== undefined && value !== null && value !== '' ? Number(value) : value))
  serviceLimit?: number | null;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsArray()
  @IsOptional()
  measurementDetails?: Record<string, string>[];

  @IsEnum(ReferenceSourceType)
  @IsOptional()
  sourceType?: ReferenceSourceType;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateReferenceBookStatusDto {
  @IsBoolean()
  isActive: boolean;
}

export class UpdateVerificationStatusDto {
  @IsEnum(VerificationStatus)
  verificationStatus: VerificationStatus;
}
