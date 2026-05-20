import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  createPaginatedResponse,
  createResponse,
} from '../../common/types/api-response.type';
import type { CreatePriceCatalogDto } from './dto/create-price-catalog.dto';
import type { QueryPriceCatalogDto, SuggestPriceCatalogDto } from './dto/query-price-catalog.dto';
import type {
  UpdatePriceCatalogDto,
  UpdatePriceCatalogStatusDto,
} from './dto/update-price-catalog.dto';
import { PriceCatalogRepository } from './price-catalog.repository';

@Injectable()
export class PriceCatalogService {
  constructor(private readonly priceCatalogRepository: PriceCatalogRepository) {}

  private validateDateRange(effectiveDate?: string, expiredDate?: string) {
    if (effectiveDate && expiredDate && expiredDate <= effectiveDate) {
      throw new BadRequestException('Expiry date must be after effective date');
    }
  }

  private validateSizeRange(sizeFrom?: number, sizeTo?: number) {
    if (sizeFrom !== undefined && sizeTo !== undefined && sizeTo < sizeFrom) {
      throw new BadRequestException('Size from must be less than or equal to size to');
    }
  }

  async create(dto: CreatePriceCatalogDto) {
    this.validateSizeRange(dto.sizeFrom, dto.sizeTo);
    this.validateDateRange(dto.effectiveDate, dto.expiredDate);
    const entry = await this.priceCatalogRepository.create(dto);
    return createResponse(entry, 'Price catalog entry created');
  }

  async findAll(dto: QueryPriceCatalogDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const { data, total } = await this.priceCatalogRepository.findAll(dto);
    return createPaginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const entry = await this.priceCatalogRepository.findById(id);
    if (!entry) {
      throw new NotFoundException('Price catalog entry not found');
    }
    return entry;
  }

  async update(id: string, dto: UpdatePriceCatalogDto) {
    const current = await this.findOne(id);

    const sizeFrom = dto.sizeFrom ?? (current.sizeFrom ? parseFloat(current.sizeFrom.toString()) : undefined);
    const sizeTo = dto.sizeTo ?? (current.sizeTo ? parseFloat(current.sizeTo.toString()) : undefined);
    this.validateSizeRange(sizeFrom, sizeTo);

    const effectiveDate = dto.effectiveDate ?? current.effectiveDate.toISOString();
    const expiredDate = dto.expiredDate !== undefined ? dto.expiredDate : (current.expiredDate?.toISOString());
    this.validateDateRange(effectiveDate, expiredDate ?? undefined);

    const entry = await this.priceCatalogRepository.update(id, dto);
    return createResponse(entry, 'Price catalog entry updated');
  }

  async updateStatus(id: string, dto: UpdatePriceCatalogStatusDto) {
    await this.findOne(id);
    const entry = await this.priceCatalogRepository.updateStatus(id, dto.isActive);
    return createResponse(entry, 'Price catalog status updated');
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.priceCatalogRepository.hardDelete(id);
    return createResponse(null, 'Price catalog entry deleted');
  }

  async suggest(dto: SuggestPriceCatalogDto) {
    const results = await this.priceCatalogRepository.suggest(
      dto.serviceId,
      dto.size,
      dto.difficultyLevel,
      dto.customerType,
    );
    return createResponse(results);
  }
}
