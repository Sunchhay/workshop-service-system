import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { RecordStatus } from '../../../generated/prisma/enums';

export class CreateSupplierDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsEnum(RecordStatus)
  @IsOptional()
  status?: RecordStatus;
}
