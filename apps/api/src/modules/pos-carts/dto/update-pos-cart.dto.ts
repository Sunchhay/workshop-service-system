import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { PaymentMethod } from '../../../generated/prisma/enums';

export class UpdatePosCartDto {
  @IsString()
  @IsOptional()
  cartName?: string;

  @IsString()
  @IsOptional()
  customerId?: string | null;

  @IsString()
  @IsOptional()
  machineModelId?: string | null;

  @IsString()
  @IsOptional()
  modelNameSnapshot?: string | null;

  @IsString()
  @IsOptional()
  customerName?: string;

  @IsString()
  @IsOptional()
  customerPhone?: string;

  @IsString()
  @IsOptional()
  jobTitle?: string;

  @IsString()
  @IsOptional()
  engineType?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  discountAmount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  paidAmount?: number;

  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @IsString()
  @IsOptional()
  note?: string;

  @IsString()
  @IsOptional()
  internalNote?: string;
}
