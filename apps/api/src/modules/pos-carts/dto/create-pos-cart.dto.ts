import { IsOptional, IsString } from 'class-validator';

export class CreatePosCartDto {
  @IsString()
  @IsOptional()
  cartName?: string;
}
