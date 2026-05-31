import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateCartDto {
  @IsString()
  @IsOptional()
  customerId?: string;

  @IsString()
  @IsOptional()
  mechanicId?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  commissionAmount?: number;

  @IsString()
  @IsOptional()
  commissionNote?: string;

  @IsString()
  @IsOptional()
  note?: string;
}
