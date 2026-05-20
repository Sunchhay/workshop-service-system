import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  createPaginatedResponse,
  createResponse,
} from '../../common/types/api-response.type';
import type { AdjustStockDto } from './dto/adjust-stock.dto';
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
    const code = await this.productsRepository.generateCode();
    const product = await this.productsRepository.create({ ...dto, code });
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
    const product = await this.productsRepository.update(id, dto);
    return createResponse(product, 'Product updated');
  }

  async updateStatus(id: string, dto: UpdateProductStatusDto) {
    await this.findOne(id);
    const product = await this.productsRepository.updateStatus(id, dto.isActive);
    return createResponse(product, 'Product status updated');
  }

  async adjustStock(id: string, dto: AdjustStockDto) {
    const product = await this.findOne(id);
    const newQty = product.stockQuantity + dto.quantityChange;
    if (newQty < 0) {
      throw new BadRequestException(
        'Stock adjustment would result in negative quantity',
      );
    }
    const updated = await this.productsRepository.adjustStock(id, newQty);
    return createResponse(updated, 'Stock adjusted');
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.productsRepository.softDelete(id);
    return createResponse(null, 'Product deleted');
  }
}
