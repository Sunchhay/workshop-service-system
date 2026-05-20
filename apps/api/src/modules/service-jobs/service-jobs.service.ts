import { Injectable, NotFoundException } from '@nestjs/common';
import { createPaginatedResponse, createResponse } from '../../common/types/api-response.type';
import { ServiceJobsRepository } from './service-jobs.repository';
import type { CreateServiceJobDto } from './dto/create-service-job.dto';
import type { QueryServiceJobDto } from './dto/query-service-job.dto';
import type { UpdateServiceJobDto } from './dto/update-service-job.dto';
import type { UpdateServiceJobStatusDto } from './dto/update-service-job-status.dto';

@Injectable()
export class ServiceJobsService {
  constructor(private readonly repo: ServiceJobsRepository) {}

  async create(dto: CreateServiceJobDto, createdById: string) {
    const jobCode = await this.repo.generateJobCode();
    const job = await this.repo.create({ ...dto, jobCode, createdById });
    return createResponse(job, 'Service job created');
  }

  async findAll(dto: QueryServiceJobDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const { data, total } = await this.repo.findAll(dto);
    return createPaginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const job = await this.repo.findById(id);
    if (!job) throw new NotFoundException('Service job not found');
    return job;
  }

  async update(id: string, dto: UpdateServiceJobDto) {
    await this.findOne(id);
    const job = await this.repo.update(id, dto);
    return createResponse(job, 'Service job updated');
  }

  async updateStatus(id: string, dto: UpdateServiceJobStatusDto) {
    await this.findOne(id);
    const job = await this.repo.updateStatus(id, dto.status);
    return createResponse(job, 'Status updated');
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.repo.softDelete(id);
    return createResponse(null, 'Service job deleted');
  }
}
