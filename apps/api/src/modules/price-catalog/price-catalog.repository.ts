import { Injectable } from '@nestjs/common';

import { CustomerType, DifficultyLevel } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreatePriceCatalogDto } from './dto/create-price-catalog.dto';
import type { QueryPriceCatalogDto } from './dto/query-price-catalog.dto';
import type { UpdatePriceCatalogDto } from './dto/update-price-catalog.dto';

const PRICE_CATALOG_SELECT = {
  id: true,
  serviceId: true,
  label: true,
  sizeFrom: true,
  sizeTo: true,
  unit: true,
  difficultyLevel: true,
  customerType: true,
  unitPrice: true,
  currency: true,
  notes: true,
  effectiveDate: true,
  expiredDate: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  service: {
    select: { id: true, nameEn: true, code: true },
  },
} as const;

@Injectable()
export class PriceCatalogRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreatePriceCatalogDto) {
    return this.prisma.priceCatalog.create({
      data: {
        serviceId: data.serviceId,
        label: data.label,
        sizeFrom: data.sizeFrom,
        sizeTo: data.sizeTo,
        unit: data.unit,
        difficultyLevel: data.difficultyLevel ?? DifficultyLevel.NORMAL,
        customerType: data.customerType ?? null,
        unitPrice: data.unitPrice,
        currency: data.currency ?? 'USD',
        notes: data.notes,
        effectiveDate: data.effectiveDate ? new Date(data.effectiveDate) : new Date(),
        expiredDate: data.expiredDate ? new Date(data.expiredDate) : null,
      },
      select: PRICE_CATALOG_SELECT,
    });
  }

  async findAll(dto: QueryPriceCatalogDto) {
    const { search, serviceId, difficultyLevel, customerType, isActive, page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    const where = {
      ...(serviceId !== undefined && { serviceId }),
      ...(difficultyLevel !== undefined && { difficultyLevel }),
      ...(customerType !== undefined && { customerType }),
      ...(isActive !== undefined && { isActive }),
      ...(search !== undefined && {
        OR: [
          { label: { contains: search, mode: 'insensitive' as const } },
          { unit: { contains: search, mode: 'insensitive' as const } },
          { notes: { contains: search, mode: 'insensitive' as const } },
          { service: { nameEn: { contains: search, mode: 'insensitive' as const } } },
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
    if (data.label !== undefined) updateData.label = data.label;
    if (data.sizeFrom !== undefined) updateData.sizeFrom = data.sizeFrom;
    if (data.sizeTo !== undefined) updateData.sizeTo = data.sizeTo;
    if (data.unit !== undefined) updateData.unit = data.unit;
    if (data.difficultyLevel !== undefined) updateData.difficultyLevel = data.difficultyLevel;
    if ('customerType' in data) updateData.customerType = data.customerType ?? null;
    if (data.unitPrice !== undefined) updateData.unitPrice = data.unitPrice;
    if (data.currency !== undefined) updateData.currency = data.currency;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.effectiveDate !== undefined) updateData.effectiveDate = new Date(data.effectiveDate);
    if ('expiredDate' in data) {
      updateData.expiredDate = data.expiredDate ? new Date(data.expiredDate) : null;
    }

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

  hardDelete(id: string) {
    return this.prisma.priceCatalog.delete({ where: { id } });
  }

  async suggest(
    serviceId: string,
    size?: number,
    difficultyLevel?: DifficultyLevel,
    customerType?: CustomerType,
  ) {
    const records = await this.prisma.priceCatalog.findMany({
      where: {
        serviceId,
        isActive: true,
        ...(difficultyLevel !== undefined && { difficultyLevel }),
      },
      select: PRICE_CATALOG_SELECT,
      orderBy: { createdAt: 'desc' },
    });

    let filtered = records;

    // Filter by size range if provided
    if (size !== undefined) {
      filtered = records.filter((r) => {
        if (r.sizeFrom === null && r.sizeTo === null) return true;
        const from = r.sizeFrom !== null ? parseFloat(r.sizeFrom.toString()) : -Infinity;
        const to = r.sizeTo !== null ? parseFloat(r.sizeTo.toString()) : Infinity;
        return size >= from && size <= to;
      });
    }

    // Prefer specific customerType, fall back to null (applies to all)
    if (customerType) {
      const specific = filtered.filter((r) => r.customerType === customerType);
      if (specific.length > 0) return specific;
      return filtered.filter((r) => r.customerType === null);
    }

    return filtered;
  }
}
