import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  createPaginatedResponse,
  createResponse,
} from '../../common/types/api-response.type';
import type { CreateProductDto } from './dto/create-product.dto';
import type { QueryProductDto } from './dto/query-product.dto';
import type {
  UpdateProductDto,
  UpdateProductStatusDto,
} from './dto/update-product.dto';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async create(dto: CreateProductDto) {
    const duplicate = await this.productsRepository.findByCode(dto.code);
    if (duplicate) {
      throw new BadRequestException(`Product "${dto.code}" already exists`);
    }

    const product = await this.productsRepository.create(dto);
    return createResponse(product, 'Product created');
  }

  async findAll(dto: QueryProductDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const { data, total } = await this.productsRepository.findAll(dto);
    return createPaginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const product = await this.productsRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);

    if (dto.code !== undefined) {
      const duplicate = await this.productsRepository.findByCode(dto.code, id);
      if (duplicate) {
        throw new BadRequestException(`Product "${dto.code}" already exists`);
      }
    }

    const product = await this.productsRepository.update(id, dto);
    return createResponse(product, 'Product updated');
  }

  async updateStatus(id: string, dto: UpdateProductStatusDto) {
    await this.findOne(id);
    const product = await this.productsRepository.updateStatus(id, dto.status);
    return createResponse(product, 'Product status updated');
  }

  async remove(id: string) {
    await this.findOne(id);
    const product = await this.productsRepository.deactivate(id);
    return createResponse(product, 'Product deactivated');
  }
}
