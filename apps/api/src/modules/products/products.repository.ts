import { Injectable } from '@nestjs/common';

import { RecordStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateProductDto } from './dto/create-product.dto';
import type { QueryProductDto } from './dto/query-product.dto';
import type { UpdateProductDto } from './dto/update-product.dto';

const PRODUCT_SELECT = {
  id: true,
  code: true,
  name: true,
  nameEn: true,
  category: true,
  unit: true,
  description: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByCode(code: string, excludeId?: string) {
    return this.prisma.product.findFirst({
      where: { code, ...(excludeId && { id: { not: excludeId } }) },
      select: { id: true },
    });
  }

  create(data: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        code: data.code,
        name: data.name,
        nameEn: data.nameEn,
        category: data.category,
        unit: data.unit,
        description: data.description,
        status: data.status ?? RecordStatus.ACTIVE,
      },
      select: PRODUCT_SELECT,
    });
  }

  async findAll(dto: QueryProductDto) {
    const { search, status, category, unit, page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    const where = {
      ...(status !== undefined && { status }),
      ...(category !== undefined && {
        category: { contains: category, mode: 'insensitive' as const },
      }),
      ...(unit !== undefined && {
        unit: { contains: unit, mode: 'insensitive' as const },
      }),
      ...(search !== undefined && {
        OR: [
          { code: { contains: search, mode: 'insensitive' as const } },
          { name: { contains: search, mode: 'insensitive' as const } },
          { nameEn: { contains: search, mode: 'insensitive' as const } },
          { category: { contains: search, mode: 'insensitive' as const } },
          { unit: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        select: PRODUCT_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { data, total };
  }

  findById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
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

  updateStatus(id: string, status: RecordStatus) {
    return this.prisma.product.update({
      where: { id },
      data: { status },
      select: PRODUCT_SELECT,
    });
  }

  deactivate(id: string) {
    return this.prisma.product.update({
      where: { id },
      data: { status: RecordStatus.INACTIVE },
      select: PRODUCT_SELECT,
    });
  }
}
