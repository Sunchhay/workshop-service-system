import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import {
  ReferenceSourceType,
  VerificationStatus,
} from '../../../generated/prisma/enums';

export class QueryReferenceBookDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  machineModelId?: string;

  @IsString()
  @IsOptional()
  componentType?: string;

  @IsEnum(ReferenceSourceType)
  @IsOptional()
  sourceType?: ReferenceSourceType;

  @IsEnum(VerificationStatus)
  @IsOptional()
  verificationStatus?: VerificationStatus;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  isActive?: boolean;

  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;
}
