import { Injectable } from '@nestjs/common';

import type { ProductWhereInput } from '../../generated/prisma/models/Product';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateProductDto } from './dto/create-product.dto';
import type { QueryProductDto } from './dto/query-product.dto';
import type { UpdateProductDto } from './dto/update-product.dto';

const PRODUCT_SELECT = {
  id: true,
  code: true,
  name: true,
  brand: true,
  componentPartType: true,
  size: true,
  supplier: true,
  description: true,
  category: true,
  unit: true,
  costPrice: true,
  sellingPrice: true,
  stockQuantity: true,
  reorderLevel: true,
  linkedReferenceBookId: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  linkedReferenceBook: {
    select: {
      id: true,
      partName: true,
      partCode: true,
      machineModelId: true,
      machineModel: {
        select: { id: true, brand: true, model: true, category: true },
      },
    },
  },
} as const;

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async generateCode(): Promise<string> {
    const last = await this.prisma.product.findFirst({
      where: { code: { startsWith: 'PRD-' } },
      orderBy: { createdAt: 'desc' },
      select: { code: true },
    });
    if (!last) return 'PRD-001';
    const num = parseInt(last.code.slice(4), 10);
    return `PRD-${String(num + 1).padStart(3, '0')}`;
  }

  create(data: CreateProductDto & { code: string }) {
    return this.prisma.product.create({
      data: {
        code: data.code,
        name: data.name,
        brand: data.brand,
        componentPartType: data.componentPartType,
        size: data.size,
        supplier: data.supplier,
        description: data.description,
        category: data.category,
        unit: data.unit ?? 'piece',
        costPrice: data.costPrice,
        sellingPrice: data.sellingPrice,
        stockQuantity: data.stockQuantity ?? 0,
        reorderLevel: data.reorderLevel ?? 0,
        linkedReferenceBookId: data.linkedReferenceBookId,
      },
      select: PRODUCT_SELECT,
    });
  }

  async findAll(dto: QueryProductDto) {
    const {
      search,
      category,
      componentPartType,
      machineModelId,
      isActive,
      lowStock,
      page = 1,
      limit = 20,
    } = dto;
    const skip = (page - 1) * limit;

    const where: ProductWhereInput = { deletedAt: null };

    if (isActive !== undefined) where.isActive = isActive;
    if (category !== undefined)
      where.category = { contains: category, mode: 'insensitive' as const };
    if (componentPartType !== undefined)
      where.componentPartType = {
        contains: componentPartType,
        mode: 'insensitive' as const,
      };
    if (machineModelId !== undefined) {
      where.OR = [
        { linkedReferenceBookId: null },
        { linkedReferenceBook: { machineModelId: null } },
        { linkedReferenceBook: { machineModelId } },
      ];
    }
    if (search !== undefined) {
      const searchWhere = [
        { code: { contains: search, mode: 'insensitive' as const } },
        { name: { contains: search, mode: 'insensitive' as const } },
        { brand: { contains: search, mode: 'insensitive' as const } },
        {
          componentPartType: { contains: search, mode: 'insensitive' as const },
        },
        { size: { contains: search, mode: 'insensitive' as const } },
        { supplier: { contains: search, mode: 'insensitive' as const } },
        { category: { contains: search, mode: 'insensitive' as const } },
      ];
      if (where.OR) {
        where.AND = [{ OR: where.OR }, { OR: searchWhere }];
        delete where.OR;
      } else {
        where.OR = searchWhere;
      }
    }

    let products = await this.prisma.product.findMany({
      where,
      select: PRODUCT_SELECT,
      orderBy: { createdAt: 'desc' },
    });

    // Apply lowStock filter in-memory (stockQuantity <= reorderLevel)
    if (lowStock) {
      products = products.filter((p) => p.stockQuantity <= p.reorderLevel);
    }

    const total = lowStock
      ? products.length
      : await this.prisma.product.count({ where });

    const paginated = products.slice(skip, skip + limit);

    return { data: paginated, total };
  }

  findById(id: string) {
    return this.prisma.product.findFirst({
      where: { id, deletedAt: null },
      select: PRODUCT_SELECT,
    });
  }

  update(id: string, data: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data,
      select: PRODUCT_SELECT,
    });
  }

  updateStatus(id: string, isActive: boolean) {
    return this.prisma.product.update({
      where: { id },
      data: { isActive },
      select: PRODUCT_SELECT,
    });
  }

  adjustStock(id: string, newQuantity: number) {
    return this.prisma.product.update({
      where: { id },
      data: { stockQuantity: newQuantity },
      select: PRODUCT_SELECT,
    });
  }

  softDelete(id: string) {
    return this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: PRODUCT_SELECT,
    });
  }
}
