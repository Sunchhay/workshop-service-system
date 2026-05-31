import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { RecordStatus } from '../../../generated/prisma/enums';

export class UpdateServiceDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  code?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  nameEn?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(RecordStatus)
  @IsOptional()
  status?: RecordStatus;
}

export class UpdateServiceStatusDto {
  @IsEnum(RecordStatus)
  @IsNotEmpty()
  status!: RecordStatus;
}
