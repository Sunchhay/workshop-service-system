import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { join, normalize } from 'path';
import sharp from 'sharp';

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
    const existingCustomer = await this.findOne(id);

    if (dto.phone) {
      const existing = await this.customersRepository.findByPhone(dto.phone, id);
      if (existing) {
        throw new BadRequestException('Phone number is already in use');
      }
    }

    const customer = await this.customersRepository.update(id, dto);
    if (
      dto.imageUrl !== undefined &&
      existingCustomer.imageUrl &&
      existingCustomer.imageUrl !== dto.imageUrl
    ) {
      await this.deleteLocalCustomerImage(existingCustomer.imageUrl);
    }
    return createResponse(customer, 'Customer updated');
  }

  async updateStatus(id: string, dto: UpdateCustomerStatusDto) {
    await this.findOne(id);
    const customer = await this.customersRepository.updateStatus(id, dto.isActive);
    return createResponse(customer, 'Customer status updated');
  }

  async remove(id: string) {
    const customer = await this.findOne(id);
    await this.customersRepository.softDelete(id);
    if (customer.imageUrl) {
      await this.deleteLocalCustomerImage(customer.imageUrl);
    }
    return createResponse(null, 'Customer deleted');
  }

  async uploadImage(file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('Image file is required');

    const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);
    if (!allowed.has(file.mimetype)) {
      throw new BadRequestException('Only JPG, PNG, and WebP images are allowed');
    }
    if (file.size > 2 * 1024 * 1024) {
      throw new BadRequestException('Image is too large');
    }

    const uploadDir = join(process.cwd(), 'uploads', 'customers');
    await mkdir(uploadDir, { recursive: true });

    const fileName = `customer-${randomUUID()}.webp`;
    const filePath = join(uploadDir, fileName);

    const output = await sharp(file.buffer)
      .rotate()
      .resize(800, 800, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toBuffer();

    if (output.length > 2 * 1024 * 1024) {
      throw new BadRequestException('Compressed image is too large');
    }

    await writeFile(filePath, output);
    return createResponse(
      { imageUrl: `/uploads/customers/${fileName}` },
      'Image uploaded',
    );
  }

  private async deleteLocalCustomerImage(imageUrl: string) {
    if (!imageUrl.startsWith('/uploads/customers/')) return;

    const uploadRoot = join(process.cwd(), 'uploads', 'customers');
    const fileName = imageUrl.split('/').pop();
    if (!fileName) return;

    const filePath = normalize(join(uploadRoot, fileName));
    if (!filePath.startsWith(uploadRoot)) return;

    try {
      await unlink(filePath);
    } catch {
      // Ignore missing files; the database state is the source of truth.
    }
  }
}
