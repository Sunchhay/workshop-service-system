import { Injectable } from '@nestjs/common';

import { RecordStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateReferenceBookDto } from './dto/create-reference-book.dto';
import type { CreateReferenceBookItemDto } from './dto/create-reference-book-item.dto';
import type { CreateReferenceBookSectionDto } from './dto/create-reference-book-section.dto';
import type { QueryReferenceBookDto } from './dto/query-reference-book.dto';
import type { UpdateReferenceBookDto } from './dto/update-reference-book.dto';
import type { UpdateReferenceBookItemDto } from './dto/update-reference-book-item.dto';
import type { UpdateReferenceBookSectionDto } from './dto/update-reference-book-section.dto';

const ITEM_SELECT = {
  id: true,
  referenceBookSectionId: true,
  label: true,
  value: true,
  unit: true,
  note: true,
  sortOrder: true,
  createdAt: true,
  updatedAt: true,
} as const;

const SECTION_SELECT = {
  id: true,
  referenceBookId: true,
  name: true,
  description: true,
  sortOrder: true,
  createdAt: true,
  updatedAt: true,
  items: {
    select: ITEM_SELECT,
    orderBy: { sortOrder: 'asc' as const },
  },
} as const;

const REFERENCE_BOOK_SELECT = {
  id: true,
  title: true,
  category: true,
  machineModelId: true,
  summary: true,
  imageUrl: true,
  fileUrl: true,
  status: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
  machineModel: {
    select: {
      id: true,
      code: true,
      brand: true,
      modelName: true,
      machineType: true,
    },
  },
  createdBy: { select: { id: true, name: true } },
  sections: {
    select: SECTION_SELECT,
    orderBy: { sortOrder: 'asc' as const },
  },
} as const;

@Injectable()
export class ReferenceBookRepository {
  constructor(private readonly prisma: PrismaService) {}

  machineModelExists(id: string) {
    return this.prisma.machineModel.findUnique({ where: { id }, select: { id: true } });
  }

  create(dto: CreateReferenceBookDto, createdById: string) {
    return this.prisma.referenceBook.create({
      data: {
        title: dto.title,
        category: dto.category,
        machineModelId: dto.machineModelId,
        summary: dto.summary,
        imageUrl: dto.imageUrl,
        fileUrl: dto.fileUrl,
        status: dto.status ?? RecordStatus.ACTIVE,
        createdById,
      },
      select: REFERENCE_BOOK_SELECT,
    });
  }

  async findAll(dto: QueryReferenceBookDto) {
    const { search, category, machineModelId, status, page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    const where = {
      ...(status !== undefined && { status }),
      ...(machineModelId !== undefined && { machineModelId }),
      ...(category !== undefined && {
        category: { contains: category, mode: 'insensitive' as const },
      }),
      ...(search !== undefined && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { category: { contains: search, mode: 'insensitive' as const } },
          { summary: { contains: search, mode: 'insensitive' as const } },
          { machineModel: { code: { contains: search, mode: 'insensitive' as const } } },
          { machineModel: { modelName: { contains: search, mode: 'insensitive' as const } } },
          { sections: { some: { name: { contains: search, mode: 'insensitive' as const } } } },
          {
            sections: {
              some: {
                items: { some: { label: { contains: search, mode: 'insensitive' as const } } },
              },
            },
          },
          {
            sections: {
              some: {
                items: { some: { value: { contains: search, mode: 'insensitive' as const } } },
              },
            },
          },
          {
            sections: {
              some: {
                items: { some: { note: { contains: search, mode: 'insensitive' as const } } },
              },
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
        orderBy: { updatedAt: 'desc' },
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

  update(id: string, dto: UpdateReferenceBookDto) {
    return this.prisma.referenceBook.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.machineModelId !== undefined && { machineModelId: dto.machineModelId }),
        ...(dto.summary !== undefined && { summary: dto.summary }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.fileUrl !== undefined && { fileUrl: dto.fileUrl }),
        ...(dto.status !== undefined && { status: dto.status }),
      },
      select: REFERENCE_BOOK_SELECT,
    });
  }

  updateStatus(id: string, status: RecordStatus) {
    return this.prisma.referenceBook.update({
      where: { id },
      data: { status },
      select: REFERENCE_BOOK_SELECT,
    });
  }

  deactivate(id: string) {
    return this.prisma.referenceBook.update({
      where: { id },
      data: { status: RecordStatus.INACTIVE },
      select: REFERENCE_BOOK_SELECT,
    });
  }

  // Sections
  createSection(referenceBookId: string, dto: CreateReferenceBookSectionDto) {
    return this.prisma.referenceBookSection.create({
      data: {
        referenceBookId,
        name: dto.name,
        description: dto.description,
        sortOrder: dto.sortOrder ?? 0,
      },
      select: SECTION_SELECT,
    });
  }

  findSectionById(id: string) {
    return this.prisma.referenceBookSection.findUnique({
      where: { id },
      select: { id: true, referenceBookId: true },
    });
  }

  updateSection(id: string, dto: UpdateReferenceBookSectionDto) {
    return this.prisma.referenceBookSection.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
      },
      select: SECTION_SELECT,
    });
  }

  deleteSection(id: string) {
    return this.prisma.referenceBookSection.delete({ where: { id } });
  }

  // Items
  createItem(referenceBookSectionId: string, dto: CreateReferenceBookItemDto) {
    return this.prisma.referenceBookItem.create({
      data: {
        referenceBookSectionId,
        label: dto.label,
        value: dto.value,
        unit: dto.unit,
        note: dto.note,
        sortOrder: dto.sortOrder ?? 0,
      },
      select: ITEM_SELECT,
    });
  }

  findItemById(id: string) {
    return this.prisma.referenceBookItem.findUnique({
      where: { id },
      select: { id: true, referenceBookSectionId: true },
    });
  }

  updateItem(id: string, dto: UpdateReferenceBookItemDto) {
    return this.prisma.referenceBookItem.update({
      where: { id },
      data: {
        ...(dto.label !== undefined && { label: dto.label }),
        ...(dto.value !== undefined && { value: dto.value }),
        ...(dto.unit !== undefined && { unit: dto.unit }),
        ...(dto.note !== undefined && { note: dto.note }),
        ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
      },
      select: ITEM_SELECT,
    });
  }

  deleteItem(id: string) {
    return this.prisma.referenceBookItem.delete({ where: { id } });
  }
}
