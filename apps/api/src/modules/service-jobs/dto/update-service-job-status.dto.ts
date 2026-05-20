import { IsEnum, IsNotEmpty } from 'class-validator';
import { JobStatus } from '../../../generated/prisma/enums';

export class UpdateServiceJobStatusDto {
  @IsEnum(JobStatus)
  @IsNotEmpty()
  status: JobStatus;
}
