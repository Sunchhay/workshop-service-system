import { Injectable } from '@nestjs/common';

import { CustomerType } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateCustomerDto } from './dto/create-customer.dto';
import type { QueryCustomerDto } from './dto/query-customer.dto';
import type { UpdateCustomerDto } from './dto/update-customer.dto';

const CUSTOMER_SELECT = {
  id: true,
  code: true,
  name: true,
  phone: true,
  imageUrl: true,
  customerType: true,
  notes: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class CustomersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async generateCode(): Promise<string> {
    const last = await this.prisma.customer.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { code: true },
    });
    if (!last) return 'C-0001';
    const num = parseInt(last.code.slice(2), 10);
    return `C-${String(num + 1).padStart(4, '0')}`;
  }

  create(data: CreateCustomerDto & { code: string }) {
    return this.prisma.customer.create({
      data: {
        code: data.code,
        name: data.name,
        phone: data.phone,
        imageUrl: data.imageUrl ?? null,
        customerType: data.customerType ?? CustomerType.NORMAL,
        notes: data.notes,
      },
      select: CUSTOMER_SELECT,
    });
  }

  async findAll(dto: QueryCustomerDto) {
    const { search, customerType, isActive, page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      ...(customerType !== undefined && { customerType }),
      ...(isActive !== undefined && { isActive }),
      ...(search !== undefined && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { phone: { contains: search, mode: 'insensitive' as const } },
          { code: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        select: CUSTOMER_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.customer.count({ where }),
    ]);

    return { data, total };
  }

  findById(id: string) {
    return this.prisma.customer.findFirst({
      where: { id, deletedAt: null },
      select: CUSTOMER_SELECT,
    });
  }

  findByPhone(phone: string, excludeId?: string) {
    return this.prisma.customer.findFirst({
      where: {
        phone,
        deletedAt: null,
        ...(excludeId && { NOT: { id: excludeId } }),
      },
      select: CUSTOMER_SELECT,
    });
  }

  update(id: string, data: UpdateCustomerDto) {
    return this.prisma.customer.update({
      where: { id },
      data,
      select: CUSTOMER_SELECT,
    });
  }

  updateStatus(id: string, isActive: boolean) {
    return this.prisma.customer.update({
      where: { id },
      data: { isActive },
      select: CUSTOMER_SELECT,
    });
  }

  softDelete(id: string) {
    return this.prisma.customer.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: CUSTOMER_SELECT,
    });
  }
}
