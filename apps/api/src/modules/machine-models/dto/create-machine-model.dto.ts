import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { RecordStatus } from '../../../generated/prisma/enums';

export class CreateMachineModelDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  modelName: string;

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
