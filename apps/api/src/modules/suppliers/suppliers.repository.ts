import { Injectable } from '@nestjs/common';

import { RecordStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateSupplierDto } from './dto/create-supplier.dto';
import type { QuerySupplierDto } from './dto/query-supplier.dto';
import type { UpdateSupplierDto } from './dto/update-supplier.dto';

const SUPPLIER_SELECT = {
  id: true,
  name: true,
  phone: true,
  imageUrl: true,
  note: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class SuppliersRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateSupplierDto) {
    return this.prisma.supplier.create({
      data: {
        name: data.name,
        phone: data.phone,
        imageUrl: data.imageUrl,
        note: data.note,
        status: data.status ?? RecordStatus.ACTIVE,
      },
      select: SUPPLIER_SELECT,
    });
  }

  async findAll(dto: QuerySupplierDto) {
    const { search, status, page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    const where = {
      ...(status !== undefined && { status }),
      ...(search !== undefined && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { phone: { contains: search, mode: 'insensitive' as const } },
          { note: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.supplier.findMany({
        where,
        select: SUPPLIER_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.supplier.count({ where }),
    ]);

    return { data, total };
  }

  findById(id: string) {
    return this.prisma.supplier.findUnique({
      where: { id },
      select: SUPPLIER_SELECT,
    });
  }

  update(id: string, data: UpdateSupplierDto) {
    return this.prisma.supplier.update({
      where: { id },
      data,
      select: SUPPLIER_SELECT,
    });
  }

  updateStatus(id: string, status: RecordStatus) {
    return this.prisma.supplier.update({
      where: { id },
      data: { status },
      select: SUPPLIER_SELECT,
    });
  }

  deactivate(id: string) {
    return this.prisma.supplier.update({
      where: { id },
      data: { status: RecordStatus.INACTIVE },
      select: SUPPLIER_SELECT,
    });
  }
}
