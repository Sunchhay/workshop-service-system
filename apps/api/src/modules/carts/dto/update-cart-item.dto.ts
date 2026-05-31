import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateCartItemDto {
  @IsString()
  @IsOptional()
  machineModelId?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  unitPrice?: number;

  @IsNumber()
  @Min(0.001)
  @IsOptional()
  quantity?: number;

  @IsString()
  @IsOptional()
  note?: string;
}
