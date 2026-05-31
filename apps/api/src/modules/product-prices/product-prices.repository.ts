import { Injectable } from '@nestjs/common';

import { RecordStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateProductPriceDto } from './dto/create-product-price.dto';
import type { QueryProductPriceDto } from './dto/query-product-price.dto';
import type { UpdateProductPriceDto } from './dto/update-product-price.dto';

const PRODUCT_PRICE_SELECT = {
  id: true,
  productId: true,
  machineModelId: true,
  imageUrl: true,
  ownerPrice: true,
  mechanicPrice: true,
  note: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  product: {
    select: {
      id: true,
      code: true,
      name: true,
      nameEn: true,
      category: true,
      unit: true,
    },
  },
  machineModel: {
    select: {
      id: true,
      code: true,
      brand: true,
      modelName: true,
      machineType: true,
      imageUrl: true,
    },
  },
} as const;

@Injectable()
export class ProductPricesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateProductPriceDto) {
    return this.prisma.productPrice.create({
      data: {
        productId: data.productId,
        machineModelId: data.machineModelId,
        imageUrl: data.imageUrl,
        ownerPrice: data.ownerPrice,
        mechanicPrice: data.mechanicPrice,
        note: data.note,
        status: data.status ?? RecordStatus.ACTIVE,
      },
      select: PRODUCT_PRICE_SELECT,
    });
  }

  async findAll(dto: QueryProductPriceDto) {
    const {
      search,
      productId,
      machineModelId,
      status,
      category,
      machineType,
      page = 1,
      limit = 20,
    } = dto;
    const skip = (page - 1) * limit;

    const where = {
      ...(productId !== undefined && { productId }),
      ...(machineModelId !== undefined && { machineModelId }),
      ...(status !== undefined && { status }),
      ...(category !== undefined && { product: { category } }),
      ...(machineType !== undefined && { machineModel: { machineType } }),
      ...(search !== undefined && {
        OR: [
          {
            product: {
              code: { contains: search, mode: 'insensitive' as const },
            },
          },
          {
            product: {
              name: { contains: search, mode: 'insensitive' as const },
            },
          },
          {
            product: {
              nameEn: { contains: search, mode: 'insensitive' as const },
            },
          },
          {
            product: {
              category: { contains: search, mode: 'insensitive' as const },
            },
          },
          {
            product: {
              unit: { contains: search, mode: 'insensitive' as const },
            },
          },
          {
            machineModel: {
              code: { contains: search, mode: 'insensitive' as const },
            },
          },
          {
            machineModel: {
              brand: { contains: search, mode: 'insensitive' as const },
            },
          },
          {
            machineModel: {
              modelName: { contains: search, mode: 'insensitive' as const },
            },
          },
          {
            machineModel: {
              machineType: { contains: search, mode: 'insensitive' as const },
            },
          },
          { note: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.productPrice.findMany({
        where,
        select: PRODUCT_PRICE_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.productPrice.count({ where }),
    ]);

    return { data, total };
  }

  findById(id: string) {
    return this.prisma.productPrice.findUnique({
      where: { id },
      select: PRODUCT_PRICE_SELECT,
    });
  }

  findByPair(productId: string, machineModelId: string, excludeId?: string) {
    return this.prisma.productPrice.findFirst({
      where: {
        productId,
        machineModelId,
        ...(excludeId && { NOT: { id: excludeId } }),
      },
      select: { id: true },
    });
  }

  findActiveByPair(productId: string, machineModelId: string) {
    return this.prisma.productPrice.findFirst({
      where: { productId, machineModelId, status: RecordStatus.ACTIVE },
      select: PRODUCT_PRICE_SELECT,
    });
  }

  productExists(productId: string) {
    return this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
  }

  machineModelExists(machineModelId: string) {
    return this.prisma.machineModel.findUnique({
      where: { id: machineModelId },
      select: { id: true },
    });
  }

  update(id: string, data: UpdateProductPriceDto) {
    return this.prisma.productPrice.update({
      where: { id },
      data,
      select: PRODUCT_PRICE_SELECT,
    });
  }

  updateStatus(id: string, status: RecordStatus) {
    return this.prisma.productPrice.update({
      where: { id },
      data: { status },
      select: PRODUCT_PRICE_SELECT,
    });
  }

  deactivate(id: string) {
    return this.prisma.productPrice.update({
      where: { id },
      data: { status: RecordStatus.INACTIVE },
      select: PRODUCT_PRICE_SELECT,
    });
  }
}
