import { Module } from '@nestjs/common';
import { ServiceJobsController } from './service-jobs.controller';
import { ServiceJobsService } from './service-jobs.service';
import { ServiceJobsRepository } from './service-jobs.repository';

@Module({
  controllers: [ServiceJobsController],
  providers: [ServiceJobsService, ServiceJobsRepository],
  exports: [ServiceJobsService],
})
export class ServiceJobsModule {}
