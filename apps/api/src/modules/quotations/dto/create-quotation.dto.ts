import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateQuotationFromCartDto {
  @IsString()
  cartId: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsDateString()
  @IsOptional()
  validUntil?: string;
}
