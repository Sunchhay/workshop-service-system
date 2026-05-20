import { IsOptional, IsString } from 'class-validator';

export class CancelInvoiceDto {
  @IsString()
  @IsOptional()
  reason?: string;
}
