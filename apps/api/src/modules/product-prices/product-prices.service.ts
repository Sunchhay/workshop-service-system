import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  createPaginatedResponse,
  createResponse,
} from '../../common/types/api-response.type';
import { CustomerType } from '../../generated/prisma/enums';
import { ProductPricesRepository } from './product-prices.repository';
import type { CreateProductPriceDto } from './dto/create-product-price.dto';
import type {
  QueryProductPriceDto,
  SuggestProductPriceDto,
} from './dto/query-product-price.dto';
import type {
  UpdateProductPriceDto,
  UpdateProductPriceStatusDto,
} from './dto/update-product-price.dto';

@Injectable()
export class ProductPricesService {
  constructor(
    private readonly productPricesRepository: ProductPricesRepository,
  ) {}

  async create(dto: CreateProductPriceDto) {
    if (dto.ownerPrice === undefined && dto.mechanicPrice === undefined) {
      throw new BadRequestException(
        'At least one of ownerPrice or mechanicPrice must be provided',
      );
    }

    const productExists = await this.productPricesRepository.productExists(
      dto.productId,
    );
    if (!productExists) {
      throw new BadRequestException('Product not found');
    }

    const modelExists = await this.productPricesRepository.machineModelExists(
      dto.machineModelId,
    );
    if (!modelExists) {
      throw new BadRequestException('Machine model not found');
    }

    const duplicate = await this.productPricesRepository.findByPair(
      dto.productId,
      dto.machineModelId,
    );
    if (duplicate) {
      throw new BadRequestException(
        'A product price for this product and machine model combination already exists',
      );
    }

    const productPrice = await this.productPricesRepository.create(dto);
    return createResponse(productPrice, 'Product price created');
  }

  async findAll(dto: QueryProductPriceDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const { data, total } = await this.productPricesRepository.findAll(dto);
    return createPaginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const productPrice = await this.productPricesRepository.findById(id);
    if (!productPrice) {
      throw new NotFoundException('Product price not found');
    }
    return productPrice;
  }

  async update(id: string, dto: UpdateProductPriceDto) {
    const current = await this.findOne(id);

    if (dto.productId !== undefined) {
      const productExists = await this.productPricesRepository.productExists(
        dto.productId,
      );
      if (!productExists) {
        throw new BadRequestException('Product not found');
      }
    }

    if (dto.machineModelId !== undefined) {
      const modelExists = await this.productPricesRepository.machineModelExists(
        dto.machineModelId,
      );
      if (!modelExists) {
        throw new BadRequestException('Machine model not found');
      }
    }

    if (dto.productId !== undefined || dto.machineModelId !== undefined) {
      const newProductId = dto.productId ?? current.productId;
      const newMachineModelId = dto.machineModelId ?? current.machineModelId;
      const duplicate = await this.productPricesRepository.findByPair(
        newProductId,
        newMachineModelId,
        id,
      );
      if (duplicate) {
        throw new BadRequestException(
          'A product price for this product and machine model combination already exists',
        );
      }
    }

    const productPrice = await this.productPricesRepository.update(id, dto);
    return createResponse(productPrice, 'Product price updated');
  }

  async updateStatus(id: string, dto: UpdateProductPriceStatusDto) {
    await this.findOne(id);
    const productPrice = await this.productPricesRepository.updateStatus(
      id,
      dto.status,
    );
    return createResponse(productPrice, 'Product price status updated');
  }

  async remove(id: string) {
    await this.findOne(id);
    const productPrice = await this.productPricesRepository.deactivate(id);
    return createResponse(productPrice, 'Product price deactivated');
  }

  async suggest(dto: SuggestProductPriceDto) {
    const pp = await this.productPricesRepository.findActiveByPair(
      dto.productId,
      dto.machineModelId,
    );
    if (!pp) {
      throw new NotFoundException(
        'No active product price found for this product and machine model',
      );
    }

    let suggestedPrice: number | null = null;
    let priceSource: string | null = null;

    if (dto.customerType === CustomerType.OWNER) {
      if (pp.ownerPrice !== null) {
        suggestedPrice = parseFloat(pp.ownerPrice.toString());
        priceSource = 'OWNER_PRICE';
      } else if (pp.mechanicPrice !== null) {
        suggestedPrice = parseFloat(pp.mechanicPrice.toString());
        priceSource = 'FALLBACK_MECHANIC_PRICE';
      }
    } else {
      if (pp.mechanicPrice !== null) {
        suggestedPrice = parseFloat(pp.mechanicPrice.toString());
        priceSource = 'MECHANIC_PRICE';
      } else if (pp.ownerPrice !== null) {
        suggestedPrice = parseFloat(pp.ownerPrice.toString());
        priceSource = 'FALLBACK_OWNER_PRICE';
      }
    }

    return createResponse({
      productPriceId: pp.id,
      productId: pp.productId,
      machineModelId: pp.machineModelId,
      customerType: dto.customerType,
      suggestedPrice,
      priceSource,
      productName: pp.product.nameEn ?? pp.product.name,
      machineModelName: pp.machineModel.modelName,
      imageUrl: pp.imageUrl,
    });
  }
}
