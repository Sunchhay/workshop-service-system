import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { CustomerType, RecordStatus } from '../../../generated/prisma/enums';

export class UpdateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsEnum(CustomerType)
  @IsOptional()
  customerType?: CustomerType;

  @IsEnum(RecordStatus)
  @IsOptional()
  status?: RecordStatus;
}

export class UpdateCustomerStatusDto {
  @IsEnum(RecordStatus)
  status!: RecordStatus;
}
