import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import type { CreateProductSupplierPriceDto } from './dto/create-product-supplier-price.dto';
import type { QueryProductSupplierPriceDto } from './dto/query-product-supplier-price.dto';
import type { UpdateProductSupplierPriceDto } from './dto/update-product-supplier-price.dto';

const PRODUCT_SUPPLIER_PRICE_SELECT = {
  id: true,
  productId: true,
  supplierId: true,
  buyingPrice: true,
  currency: true,
  lastUpdatedAt: true,
  note: true,
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
  supplier: {
    select: {
      id: true,
      name: true,
      phone: true,
      imageUrl: true,
    },
  },
} as const;

@Injectable()
export class ProductSupplierPricesRepository {
  constructor(private readonly prisma: PrismaService) {}

  productExists(productId: string) {
    return this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
  }

  supplierExists(supplierId: string) {
    return this.prisma.supplier.findUnique({
      where: { id: supplierId },
      select: { id: true },
    });
  }

  create(data: CreateProductSupplierPriceDto) {
    return this.prisma.productSupplierPrice.create({
      data: {
        productId: data.productId,
        supplierId: data.supplierId,
        buyingPrice: data.buyingPrice,
        currency: data.currency ?? 'USD',
        lastUpdatedAt: data.lastUpdatedAt ? new Date(data.lastUpdatedAt) : undefined,
        note: data.note,
      },
      select: PRODUCT_SUPPLIER_PRICE_SELECT,
    });
  }

  async findAll(dto: QueryProductSupplierPriceDto) {
    const { search, productId, supplierId, currency, page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    const where = {
      ...(productId !== undefined && { productId }),
      ...(supplierId !== undefined && { supplierId }),
      ...(currency !== undefined && { currency }),
      ...(search !== undefined && {
        OR: [
          { product: { code: { contains: search, mode: 'insensitive' as const } } },
          { product: { name: { contains: search, mode: 'insensitive' as const } } },
          { product: { nameEn: { contains: search, mode: 'insensitive' as const } } },
          { supplier: { name: { contains: search, mode: 'insensitive' as const } } },
          { supplier: { phone: { contains: search, mode: 'insensitive' as const } } },
          { note: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.productSupplierPrice.findMany({
        where,
        select: PRODUCT_SUPPLIER_PRICE_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.productSupplierPrice.count({ where }),
    ]);

    return { data, total };
  }

  findById(id: string) {
    return this.prisma.productSupplierPrice.findUnique({
      where: { id },
      select: PRODUCT_SUPPLIER_PRICE_SELECT,
    });
  }

  update(id: string, data: UpdateProductSupplierPriceDto) {
    return this.prisma.productSupplierPrice.update({
      where: { id },
      data: {
        ...(data.productId !== undefined && { productId: data.productId }),
        ...(data.supplierId !== undefined && { supplierId: data.supplierId }),
        ...(data.buyingPrice !== undefined && { buyingPrice: data.buyingPrice }),
        ...(data.currency !== undefined && { currency: data.currency }),
        ...(data.lastUpdatedAt !== undefined && {
          lastUpdatedAt: new Date(data.lastUpdatedAt),
        }),
        ...(data.note !== undefined && { note: data.note }),
      },
      select: PRODUCT_SUPPLIER_PRICE_SELECT,
    });
  }

  delete(id: string) {
    return this.prisma.productSupplierPrice.delete({ where: { id } });
  }
}
