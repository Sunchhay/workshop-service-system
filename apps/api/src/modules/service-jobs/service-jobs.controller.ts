import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { RequestUser } from '../../common/types/jwt-payload.type';
import { CreateServiceJobDto } from './dto/create-service-job.dto';
import { QueryServiceJobDto } from './dto/query-service-job.dto';
import { UpdateServiceJobDto } from './dto/update-service-job.dto';
import { UpdateServiceJobStatusDto } from './dto/update-service-job-status.dto';
import { ServiceJobsService } from './service-jobs.service';

@Controller('service-jobs')
export class ServiceJobsController {
  constructor(private readonly serviceJobsService: ServiceJobsService) {}

  @Post()
  create(@Body() dto: CreateServiceJobDto, @CurrentUser() user: RequestUser) {
    return this.serviceJobsService.create(dto, user.id);
  }

  @Get()
  findAll(@Query() query: QueryServiceJobDto) {
    return this.serviceJobsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const job = await this.serviceJobsService.findOne(id);
    return { success: true, data: job };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateServiceJobDto) {
    return this.serviceJobsService.update(id, dto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateServiceJobStatusDto) {
    return this.serviceJobsService.updateStatus(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceJobsService.remove(id);
  }
}
