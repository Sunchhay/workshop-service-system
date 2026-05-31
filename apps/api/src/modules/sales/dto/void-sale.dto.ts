import { IsNotEmpty, IsString } from 'class-validator';

export class VoidSaleDto {
  @IsString()
  @IsNotEmpty()
  voidReason: string;
}
