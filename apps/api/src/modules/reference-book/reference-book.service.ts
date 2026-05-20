import { Injectable, NotFoundException } from '@nestjs/common';

import {
  createPaginatedResponse,
  createResponse,
} from '../../common/types/api-response.type';
import { ReferenceBookRepository } from './reference-book.repository';
import type { CreateReferenceBookDto } from './dto/create-reference-book.dto';
import type { QueryReferenceBookDto } from './dto/query-reference-book.dto';
import type {
  UpdateReferenceBookDto,
  UpdateReferenceBookStatusDto,
  UpdateVerificationStatusDto,
} from './dto/update-reference-book.dto';

@Injectable()
export class ReferenceBookService {
  constructor(private readonly referenceBookRepository: ReferenceBookRepository) {}

  async create(dto: CreateReferenceBookDto) {
    const record = await this.referenceBookRepository.create(dto);
    return createResponse(record, 'Reference book record created');
  }

  async findAll(dto: QueryReferenceBookDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const { data, total } = await this.referenceBookRepository.findAll(dto);
    return createPaginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const record = await this.referenceBookRepository.findById(id);
    if (!record) {
      throw new NotFoundException('Reference book record not found');
    }
    return record;
  }

  async update(id: string, dto: UpdateReferenceBookDto) {
    await this.findOne(id);
    const record = await this.referenceBookRepository.update(id, dto);
    return createResponse(record, 'Reference book record updated');
  }

  async updateStatus(id: string, dto: UpdateReferenceBookStatusDto) {
    await this.findOne(id);
    const record = await this.referenceBookRepository.updateStatus(id, dto.isActive);
    return createResponse(record, 'Status updated');
  }

  async updateVerificationStatus(id: string, dto: UpdateVerificationStatusDto) {
    await this.findOne(id);
    const record = await this.referenceBookRepository.updateVerificationStatus(
      id,
      dto.verificationStatus,
    );
    return createResponse(record, 'Verification status updated');
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.referenceBookRepository.hardDelete(id);
    return createResponse(null, 'Reference book record deleted');
  }
}
