import { Injectable } from '@nestjs/common';

import { RecordStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateServiceDto } from './dto/create-service.dto';
import type { QueryServiceDto } from './dto/query-service.dto';
import type { UpdateServiceDto } from './dto/update-service.dto';

const SERVICE_SELECT = {
  id: true,
  code: true,
  name: true,
  nameEn: true,
  category: true,
  description: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class ServicesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByCode(code: string, excludeId?: string) {
    return this.prisma.service.findFirst({
      where: { code, ...(excludeId && { id: { not: excludeId } }) },
      select: { id: true },
    });
  }

  create(data: CreateServiceDto) {
    return this.prisma.service.create({
      data: {
        code: data.code,
        name: data.name,
        nameEn: data.nameEn,
        category: data.category,
        description: data.description,
        status: data.status ?? RecordStatus.ACTIVE,
      },
      select: SERVICE_SELECT,
    });
  }

  async findAll(dto: QueryServiceDto) {
    const { search, status, category, page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    const where = {
      ...(status !== undefined && { status }),
      ...(category !== undefined && {
        category: { contains: category, mode: 'insensitive' as const },
      }),
      ...(search !== undefined && {
        OR: [
          { code: { contains: search, mode: 'insensitive' as const } },
          { name: { contains: search, mode: 'insensitive' as const } },
          { nameEn: { contains: search, mode: 'insensitive' as const } },
          { category: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
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
    return this.prisma.service.findUnique({
      where: { id },
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

  updateStatus(id: string, status: RecordStatus) {
    return this.prisma.service.update({
      where: { id },
      data: { status },
      select: SERVICE_SELECT,
    });
  }

  deactivate(id: string) {
    return this.prisma.service.update({
      where: { id },
      data: { status: RecordStatus.INACTIVE },
      select: SERVICE_SELECT,
    });
  }
}
