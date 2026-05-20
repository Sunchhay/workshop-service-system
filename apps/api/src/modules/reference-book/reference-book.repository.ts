import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import type { CreateReferenceBookDto } from './dto/create-reference-book.dto';
import type { QueryReferenceBookDto } from './dto/query-reference-book.dto';
import type { UpdateReferenceBookDto } from './dto/update-reference-book.dto';

const REFERENCE_BOOK_SELECT = {
  id: true,
  machineModelId: true,
  componentType: true,
  partName: true,
  partCode: true,
  standardSize: true,
  wearLimit: true,
  serviceLimit: true,
  unit: true,
  measurementDetails: true,
  sourceType: true,
  verificationStatus: true,
  notes: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  machineModel: {
    select: {
      id: true,
      brand: true,
      model: true,
      category: true,
    },
  },
} as const;

@Injectable()
export class ReferenceBookRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateReferenceBookDto) {
    return this.prisma.referenceBook.create({
      data: {
        machineModelId: data.machineModelId ?? null,
        componentType: data.componentType,
        partName: data.partName,
        partCode: data.partCode,
        standardSize: data.standardSize,
        wearLimit: data.wearLimit,
        serviceLimit: data.serviceLimit,
        unit: data.unit ?? 'mm',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        measurementDetails: data.measurementDetails as any,
        sourceType: data.sourceType,
        verificationStatus: data.verificationStatus,
        notes: data.notes,
      },
      select: REFERENCE_BOOK_SELECT,
    });
  }

  async findAll(dto: QueryReferenceBookDto) {
    const {
      search,
      machineModelId,
      componentType,
      sourceType,
      verificationStatus,
      isActive,
      page = 1,
      limit = 20,
    } = dto;
    const skip = (page - 1) * limit;

    const where = {
      ...(machineModelId !== undefined && { machineModelId }),
      ...(componentType !== undefined && {
        componentType: { contains: componentType, mode: 'insensitive' as const },
      }),
      ...(sourceType !== undefined && { sourceType }),
      ...(verificationStatus !== undefined && { verificationStatus }),
      ...(isActive !== undefined && { isActive }),
      ...(search !== undefined && {
        OR: [
          { partName: { contains: search, mode: 'insensitive' as const } },
          { partCode: { contains: search, mode: 'insensitive' as const } },
          { componentType: { contains: search, mode: 'insensitive' as const } },
          { notes: { contains: search, mode: 'insensitive' as const } },
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
      this.prisma.referenceBook.findMany({
        where,
        select: REFERENCE_BOOK_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.referenceBook.count({ where }),
    ]);

    return { data, total };
  }

  findById(id: string) {
    return this.prisma.referenceBook.findUnique({
      where: { id },
      select: REFERENCE_BOOK_SELECT,
    });
  }

  update(id: string, data: UpdateReferenceBookDto) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      ...(data.partName !== undefined && { partName: data.partName }),
      ...(data.partCode !== undefined && { partCode: data.partCode }),
      ...(data.componentType !== undefined && { componentType: data.componentType }),
      ...('machineModelId' in data && { machineModelId: data.machineModelId }),
      ...(data.standardSize !== undefined && { standardSize: data.standardSize }),
      ...(data.wearLimit !== undefined && { wearLimit: data.wearLimit }),
      ...(data.serviceLimit !== undefined && { serviceLimit: data.serviceLimit }),
      ...(data.unit !== undefined && { unit: data.unit }),
      ...(data.sourceType !== undefined && { sourceType: data.sourceType }),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.measurementDetails !== undefined && {
        measurementDetails: data.measurementDetails,
      }),
    };
    return this.prisma.referenceBook.update({
      where: { id },
      data: updateData,
      select: REFERENCE_BOOK_SELECT,
    });
  }

  updateStatus(id: string, isActive: boolean) {
    return this.prisma.referenceBook.update({
      where: { id },
      data: { isActive },
      select: REFERENCE_BOOK_SELECT,
    });
  }

  updateVerificationStatus(id: string, verificationStatus: string) {
    return this.prisma.referenceBook.update({
      where: { id },
      data: { verificationStatus: verificationStatus as import('../../generated/prisma/enums').VerificationStatus },
      select: REFERENCE_BOOK_SELECT,
    });
  }

  hardDelete(id: string) {
    return this.prisma.referenceBook.delete({ where: { id } });
  }
}
