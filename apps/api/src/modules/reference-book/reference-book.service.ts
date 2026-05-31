import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  createPaginatedResponse,
  createResponse,
} from '../../common/types/api-response.type';
import type { CreateReferenceBookDto } from './dto/create-reference-book.dto';
import type { CreateReferenceBookItemDto } from './dto/create-reference-book-item.dto';
import type { CreateReferenceBookSectionDto } from './dto/create-reference-book-section.dto';
import type { QueryReferenceBookDto } from './dto/query-reference-book.dto';
import type { UpdateReferenceBookDto } from './dto/update-reference-book.dto';
import type { UpdateReferenceBookItemDto } from './dto/update-reference-book-item.dto';
import type { UpdateReferenceBookSectionDto } from './dto/update-reference-book-section.dto';
import { ReferenceBookRepository } from './reference-book.repository';

@Injectable()
export class ReferenceBookService {
  constructor(private readonly referenceBookRepository: ReferenceBookRepository) {}

  async create(dto: CreateReferenceBookDto, createdById: string) {
    if (dto.machineModelId !== undefined) {
      const exists = await this.referenceBookRepository.machineModelExists(dto.machineModelId);
      if (!exists) throw new BadRequestException('Machine model not found');
    }
    const record = await this.referenceBookRepository.create(dto, createdById);
    return createResponse(record, 'Reference book created');
  }

  async findAll(dto: QueryReferenceBookDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const { data, total } = await this.referenceBookRepository.findAll(dto);
    return createPaginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const record = await this.referenceBookRepository.findById(id);
    if (!record) throw new NotFoundException('Reference book not found');
    return record;
  }

  async update(id: string, dto: UpdateReferenceBookDto) {
    await this.findOne(id);
    if (dto.machineModelId !== undefined) {
      const exists = await this.referenceBookRepository.machineModelExists(dto.machineModelId);
      if (!exists) throw new BadRequestException('Machine model not found');
    }
    const record = await this.referenceBookRepository.update(id, dto);
    return createResponse(record, 'Reference book updated');
  }

  async remove(id: string) {
    await this.findOne(id);
    const record = await this.referenceBookRepository.deactivate(id);
    return createResponse(record, 'Reference book deactivated');
  }

  // Sections
  async createSection(referenceBookId: string, dto: CreateReferenceBookSectionDto) {
    await this.findOne(referenceBookId);
    const section = await this.referenceBookRepository.createSection(referenceBookId, dto);
    return createResponse(section, 'Section created');
  }

  async updateSection(id: string, dto: UpdateReferenceBookSectionDto) {
    const section = await this.referenceBookRepository.findSectionById(id);
    if (!section) throw new NotFoundException('Section not found');
    const updated = await this.referenceBookRepository.updateSection(id, dto);
    return createResponse(updated, 'Section updated');
  }

  async deleteSection(id: string) {
    const section = await this.referenceBookRepository.findSectionById(id);
    if (!section) throw new NotFoundException('Section not found');
    await this.referenceBookRepository.deleteSection(id);
    return createResponse(null, 'Section deleted');
  }

  // Items
  async createItem(sectionId: string, dto: CreateReferenceBookItemDto) {
    const section = await this.referenceBookRepository.findSectionById(sectionId);
    if (!section) throw new NotFoundException('Section not found');
    const item = await this.referenceBookRepository.createItem(sectionId, dto);
    return createResponse(item, 'Item created');
  }

  async updateItem(id: string, dto: UpdateReferenceBookItemDto) {
    const item = await this.referenceBookRepository.findItemById(id);
    if (!item) throw new NotFoundException('Item not found');
    const updated = await this.referenceBookRepository.updateItem(id, dto);
    return createResponse(updated, 'Item updated');
  }

  async deleteItem(id: string) {
    const item = await this.referenceBookRepository.findItemById(id);
    if (!item) throw new NotFoundException('Item not found');
    await this.referenceBookRepository.deleteItem(id);
    return createResponse(null, 'Item deleted');
  }
}
