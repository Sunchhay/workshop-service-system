import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  createPaginatedResponse,
  createResponse,
} from '../../common/types/api-response.type';
import type { CreateProductSupplierPriceDto } from './dto/create-product-supplier-price.dto';
import type { QueryProductSupplierPriceDto } from './dto/query-product-supplier-price.dto';
import type { UpdateProductSupplierPriceDto } from './dto/update-product-supplier-price.dto';
import { ProductSupplierPricesRepository } from './product-supplier-prices.repository';

@Injectable()
export class ProductSupplierPricesService {
  constructor(
    private readonly productSupplierPricesRepository: ProductSupplierPricesRepository,
  ) {}

  async create(dto: CreateProductSupplierPriceDto) {
    const productExists = await this.productSupplierPricesRepository.productExists(dto.productId);
    if (!productExists) {
      throw new BadRequestException('Product not found');
    }

    const supplierExists = await this.productSupplierPricesRepository.supplierExists(dto.supplierId);
    if (!supplierExists) {
      throw new BadRequestException('Supplier not found');
    }

    const entry = await this.productSupplierPricesRepository.create(dto);
    return createResponse(entry, 'Product supplier price created');
  }

  async findAll(dto: QueryProductSupplierPriceDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const { data, total } = await this.productSupplierPricesRepository.findAll(dto);
    return createPaginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const entry = await this.productSupplierPricesRepository.findById(id);
    if (!entry) {
      throw new NotFoundException('Product supplier price not found');
    }
    return entry;
  }

  async update(id: string, dto: UpdateProductSupplierPriceDto) {
    await this.findOne(id);

    if (dto.productId !== undefined) {
      const productExists = await this.productSupplierPricesRepository.productExists(dto.productId);
      if (!productExists) {
        throw new BadRequestException('Product not found');
      }
    }

    if (dto.supplierId !== undefined) {
      const supplierExists = await this.productSupplierPricesRepository.supplierExists(dto.supplierId);
      if (!supplierExists) {
        throw new BadRequestException('Supplier not found');
      }
    }

    const entry = await this.productSupplierPricesRepository.update(id, dto);
    return createResponse(entry, 'Product supplier price updated');
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.productSupplierPricesRepository.delete(id);
    return createResponse(null, 'Product supplier price deleted');
  }
}
