import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  createPaginatedResponse,
  createResponse,
} from '../../common/types/api-response.type';
import { PriceType } from '../../generated/prisma/enums';
import type { CreateServiceDto } from './dto/create-service.dto';
import type { QueryServiceDto } from './dto/query-service.dto';
import type {
  UpdateServiceDto,
  UpdateServiceStatusDto,
} from './dto/update-service.dto';
import { ServicesRepository } from './services.repository';

@Injectable()
export class ServicesService {
  constructor(private readonly servicesRepository: ServicesRepository) {}

  async create(dto: CreateServiceDto) {
    if (dto.priceType === PriceType.FIXED && dto.defaultPrice === undefined) {
      throw new BadRequestException(
        'Default price is required for fixed price services',
      );
    }

    const code = await this.servicesRepository.generateCode();
    const service = await this.servicesRepository.create({ ...dto, code });
    return createResponse(service, 'Service created');
  }

  async findAll(dto: QueryServiceDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const { data, total } = await this.servicesRepository.findAll(dto);
    return createPaginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const service = await this.servicesRepository.findById(id);
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }

  async update(id: string, dto: UpdateServiceDto) {
    const current = await this.findOne(id);

    // When switching to FIXED price type, a price must exist (either provided in dto or already stored)
    if (dto.priceType === PriceType.FIXED) {
      const hasPrice =
        dto.defaultPrice !== undefined || current.defaultPrice !== null;
      if (!hasPrice) {
        throw new BadRequestException(
          'Default price is required for fixed price services',
        );
      }
    }

    const service = await this.servicesRepository.update(id, dto);
    return createResponse(service, 'Service updated');
  }

  async updateStatus(id: string, dto: UpdateServiceStatusDto) {
    await this.findOne(id);
    const service = await this.servicesRepository.updateStatus(id, dto.isActive);
    return createResponse(service, 'Service status updated');
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.servicesRepository.softDelete(id);
    return createResponse(null, 'Service deleted');
  }
}
