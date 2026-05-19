import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { createPaginatedResponse, createResponse } from '../../common/types/api-response.type';
import { CustomersRepository } from './customers.repository';
import type { CreateCustomerDto } from './dto/create-customer.dto';
import type { QueryCustomerDto } from './dto/query-customer.dto';
import type {
  UpdateCustomerDto,
  UpdateCustomerStatusDto,
} from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly customersRepository: CustomersRepository) {}

  async create(dto: CreateCustomerDto) {
    if (dto.phone) {
      const existing = await this.customersRepository.findByPhone(dto.phone);
      if (existing) {
        throw new BadRequestException('Phone number is already in use');
      }
    }

    const code = await this.customersRepository.generateCode();
    const customer = await this.customersRepository.create({ ...dto, code });
    return createResponse(customer, 'Customer created');
  }

  async findAll(dto: QueryCustomerDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const { data, total } = await this.customersRepository.findAll(dto);
    return createPaginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const customer = await this.customersRepository.findById(id);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto) {
    await this.findOne(id);

    if (dto.phone) {
      const existing = await this.customersRepository.findByPhone(dto.phone, id);
      if (existing) {
        throw new BadRequestException('Phone number is already in use');
      }
    }

    const customer = await this.customersRepository.update(id, dto);
    return createResponse(customer, 'Customer updated');
  }

  async updateStatus(id: string, dto: UpdateCustomerStatusDto) {
    await this.findOne(id);
    const customer = await this.customersRepository.updateStatus(id, dto.isActive);
    return createResponse(customer, 'Customer status updated');
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.customersRepository.softDelete(id);
    return createResponse(null, 'Customer deleted');
  }
}
