import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';

import { PaymentMethod } from '../../../generated/prisma/enums';

export class CheckoutPosCartDto {
  @IsNumber()
  @Min(0)
  @IsOptional()
  paidAmount?: number;

  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;
}
