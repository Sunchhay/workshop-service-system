import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import type { CreateServiceDto } from './dto/create-service.dto';
import type { QueryServiceDto } from './dto/query-service.dto';
import type { UpdateServiceDto } from './dto/update-service.dto';

const SERVICE_SELECT = {
  id: true,
  code: true,
  nameEn: true,
  nameKh: true,
  category: true,
  relatedComponent: true,
  defaultPrice: true,
  priceType: true,
  description: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class ServicesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async generateCode(): Promise<string> {
    const last = await this.prisma.service.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { code: true },
    });
    if (!last) return 'SRV-001';
    const num = parseInt(last.code.slice(4), 10);
    return `SRV-${String(num + 1).padStart(3, '0')}`;
  }

  create(data: CreateServiceDto & { code: string }) {
    return this.prisma.service.create({
      data: {
        code: data.code,
        nameEn: data.nameEn,
        nameKh: data.nameKh,
        category: data.category,
        relatedComponent: data.relatedComponent,
        priceType: data.priceType,
        defaultPrice: data.defaultPrice,
        description: data.description,
      },
      select: SERVICE_SELECT,
    });
  }

  async findAll(dto: QueryServiceDto) {
    const { search, priceType, isActive, page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      ...(priceType !== undefined && { priceType }),
      ...(isActive !== undefined && { isActive }),
      ...(search !== undefined && {
        OR: [
          { code: { contains: search, mode: 'insensitive' as const } },
          { nameEn: { contains: search, mode: 'insensitive' as const } },
          { nameKh: { contains: search, mode: 'insensitive' as const } },
          { category: { contains: search, mode: 'insensitive' as const } },
          { relatedComponent: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        select: SERVICE_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.service.count({ where }),
    ]);

    return { data, total };
  }

  findById(id: string) {
    return this.prisma.service.findFirst({
      where: { id, deletedAt: null },
      select: SERVICE_SELECT,
    });
  }

  update(id: string, data: UpdateServiceDto) {
    return this.prisma.service.update({
      where: { id },
      data,
      select: SERVICE_SELECT,
    });
  }

  updateStatus(id: string, isActive: boolean) {
    return this.prisma.service.update({
      where: { id },
      data: { isActive },
      select: SERVICE_SELECT,
    });
  }

  softDelete(id: string) {
    return this.prisma.service.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: SERVICE_SELECT,
    });
  }
}
