import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import type { CreatePriceCatalogDto } from './dto/create-price-catalog.dto';
import type { QueryPriceCatalogDto } from './dto/query-price-catalog.dto';
import type { UpdatePriceCatalogDto } from './dto/update-price-catalog.dto';

const PRICE_CATALOG_SELECT = {
  id: true,
  serviceId: true,
  machineModelId: true,
  label: true,
  unitPrice: true,
  currency: true,
  notes: true,
  effectiveDate: true,
  expiredDate: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  service: {
    select: { id: true, nameEn: true, nameKh: true, code: true },
  },
  machineModel: {
    select: { id: true, brand: true, model: true, category: true },
  },
} as const;

@Injectable()
export class PriceCatalogRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreatePriceCatalogDto) {
    return this.prisma.priceCatalog.create({
      data: {
        serviceId: data.serviceId,
        machineModelId: data.machineModelId,
        label: data.label.trim(),
        unitPrice: data.unitPrice,
        currency: data.currency?.trim() || 'USD',
        notes: data.notes?.trim() || null,
        effectiveDate: data.effectiveDate
          ? new Date(data.effectiveDate)
          : new Date(),
        expiredDate: data.expiredDate ? new Date(data.expiredDate) : null,
        isActive: data.isActive ?? true,
      },
      select: PRICE_CATALOG_SELECT,
    });
  }

  async findAll(dto: QueryPriceCatalogDto) {
    const {
      search,
      serviceId,
      machineModelId,
      isActive,
      page = 1,
      limit = 20,
    } = dto;
    const skip = (page - 1) * limit;

    const where = {
      ...(serviceId !== undefined && { serviceId }),
      ...(machineModelId !== undefined && { machineModelId }),
      ...(isActive !== undefined && { isActive }),
      ...(search !== undefined && {
        OR: [
          { label: { contains: search, mode: 'insensitive' as const } },
          { notes: { contains: search, mode: 'insensitive' as const } },
          {
            service: {
              nameEn: { contains: search, mode: 'insensitive' as const },
            },
          },
          {
            service: {
              nameKh: { contains: search, mode: 'insensitive' as const },
            },
          },
          {
            machineModel: {
              brand: { contains: search, mode: 'insensitive' as const },
            },
          },
          {
            machineModel: {
              model: { contains: search, mode: 'insensitive' as const },
            },
          },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.priceCatalog.findMany({
        where,
        select: PRICE_CATALOG_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.priceCatalog.count({ where }),
    ]);

    return { data, total };
  }

  findById(id: string) {
    return this.prisma.priceCatalog.findUnique({
      where: { id },
      select: PRICE_CATALOG_SELECT,
    });
  }

  update(id: string, data: UpdatePriceCatalogDto) {
    const updateData: Record<string, unknown> = {};
    if (data.serviceId !== undefined) updateData.serviceId = data.serviceId;
    if (data.machineModelId !== undefined)
      updateData.machineModelId = data.machineModelId;
    if (data.label !== undefined) updateData.label = data.label.trim();
    if (data.unitPrice !== undefined) updateData.unitPrice = data.unitPrice;
    if (data.currency !== undefined)
      updateData.currency = data.currency.trim() || 'USD';
    if (data.notes !== undefined) updateData.notes = data.notes?.trim() || null;
    if (data.effectiveDate !== undefined)
      updateData.effectiveDate = new Date(data.effectiveDate);
    if ('expiredDate' in data) {
      updateData.expiredDate = data.expiredDate
        ? new Date(data.expiredDate)
        : null;
    }
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    return this.prisma.priceCatalog.update({
      where: { id },
      data: updateData,
      select: PRICE_CATALOG_SELECT,
    });
  }

  updateStatus(id: string, isActive: boolean) {
    return this.prisma.priceCatalog.update({
      where: { id },
      data: { isActive },
      select: PRICE_CATALOG_SELECT,
    });
  }

  delete(id: string) {
    return this.prisma.priceCatalog.delete({ where: { id } });
  }
}
