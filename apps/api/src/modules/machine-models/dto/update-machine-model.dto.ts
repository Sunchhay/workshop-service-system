import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { RecordStatus } from '../../../generated/prisma/enums';

export class UpdateMachineModelDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  code?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  modelName?: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  machineType?: string;

  @IsString()
  @IsOptional()
  year?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(RecordStatus)
  @IsOptional()
  status?: RecordStatus;
}

export class UpdateMachineModelStatusDto {
  @IsEnum(RecordStatus)
  @IsNotEmpty()
  status: RecordStatus;
}
