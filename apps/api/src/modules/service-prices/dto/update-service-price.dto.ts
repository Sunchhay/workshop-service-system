import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { RecordStatus } from '../../../generated/prisma/enums';

export class UpdateServicePriceDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  serviceId?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  machineModelId?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  ownerPrice?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  mechanicPrice?: number;

  @IsString()
  @IsOptional()
  note?: string;

  @IsEnum(RecordStatus)
  @IsOptional()
  status?: RecordStatus;
}

export class UpdateServicePriceStatusDto {
  @IsEnum(RecordStatus)
  @IsNotEmpty()
  status: RecordStatus;
}
