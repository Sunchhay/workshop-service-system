import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { CustomerType, RecordStatus } from '../../../generated/prisma/enums';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

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
