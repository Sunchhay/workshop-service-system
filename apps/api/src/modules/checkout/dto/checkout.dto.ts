import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { PaymentMethod } from '../../../generated/prisma/enums';

export class CheckoutDto {
  @IsString()
  @IsNotEmpty()
  cartId: string;

  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @IsNumber()
  @Min(0)
  @IsOptional()
  paidAmount?: number;

  @IsString()
  @IsOptional()
  referenceNo?: string;

  @IsString()
  @IsOptional()
  paymentNote?: string;

  @IsString()
  @IsOptional()
  saleNote?: string;
}
