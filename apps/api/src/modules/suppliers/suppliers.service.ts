import { Injectable, NotFoundException } from '@nestjs/common';

import {
  createPaginatedResponse,
  createResponse,
} from '../../common/types/api-response.type';
import type { CreateSupplierDto } from './dto/create-supplier.dto';
import type { QuerySupplierDto } from './dto/query-supplier.dto';
import type {
  UpdateSupplierDto,
  UpdateSupplierStatusDto,
} from './dto/update-supplier.dto';
import { SuppliersRepository } from './suppliers.repository';

@Injectable()
export class SuppliersService {
  constructor(private readonly suppliersRepository: SuppliersRepository) {}

  async create(dto: CreateSupplierDto) {
    const supplier = await this.suppliersRepository.create(dto);
    return createResponse(supplier, 'Supplier created');
  }

  async findAll(dto: QuerySupplierDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const { data, total } = await this.suppliersRepository.findAll(dto);
    return createPaginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const supplier = await this.suppliersRepository.findById(id);
    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }
    return supplier;
  }

  async update(id: string, dto: UpdateSupplierDto) {
    await this.findOne(id);
    const supplier = await this.suppliersRepository.update(id, dto);
    return createResponse(supplier, 'Supplier updated');
  }

  async updateStatus(id: string, dto: UpdateSupplierStatusDto) {
    await this.findOne(id);
    const supplier = await this.suppliersRepository.updateStatus(id, dto.status);
    return createResponse(supplier, 'Supplier status updated');
  }

  async remove(id: string) {
    await this.findOne(id);
    const supplier = await this.suppliersRepository.deactivate(id);
    return createResponse(supplier, 'Supplier deactivated');
  }
}
