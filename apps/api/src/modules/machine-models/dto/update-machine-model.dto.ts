import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateMachineModelDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  model?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateMachineModelStatusDto {
  @IsBoolean()
  isActive: boolean;
}
