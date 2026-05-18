import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { UserRole } from '../../../generated/prisma/enums';

export class QueryUserDto {
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsString()
  @IsOptional()
  search?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;
}
