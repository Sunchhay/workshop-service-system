import { IsDateString, IsOptional } from 'class-validator';

export class QueryDashboardDto {
  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @IsDateString()
  @IsOptional()
  dateTo?: string;
}
