import { Injectable } from '@nestjs/common';

import { CustomerType, RecordStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateCustomerDto } from './dto/create-customer.dto';
import type { QueryCustomerDto } from './dto/query-customer.dto';
import type { UpdateCustomerDto } from './dto/update-customer.dto';

const CUSTOMER_SELECT = {
  id: true,
  name: true,
  phone: true,
  imageUrl: true,
  note: true,
  customerType: true,
  lastPurchasedAt: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class CustomersRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: {
        name: data.name,
        phone: data.phone,
        imageUrl: data.imageUrl,
        note: data.note,
        customerType: data.customerType ?? CustomerType.OWNER,
        status: data.status ?? RecordStatus.ACTIVE,
      },
      select: CUSTOMER_SELECT,
    });
  }

  async findAll(dto: QueryCustomerDto) {
    const { search, customerType, status, page = 1, limit = 20 } = dto;

    const skip = (page - 1) * limit;

    const where = {
      ...(customerType !== undefined && { customerType }),
      ...(status !== undefined && { status }),
      ...(search !== undefined &&
        search.trim() !== '' && {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { phone: { contains: search, mode: 'insensitive' as const } },
            { note: { contains: search, mode: 'insensitive' as const } },
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
    return this.prisma.customer.findUnique({
      where: { id },
      select: CUSTOMER_SELECT,
    });
  }

  findByPhone(phone: string, excludeId?: string) {
    return this.prisma.customer.findFirst({
      where: {
        phone,
        ...(excludeId && { NOT: { id: excludeId } }),
      },
      select: CUSTOMER_SELECT,
    });
  }

  update(id: string, data: UpdateCustomerDto) {
    return this.prisma.customer.update({
      where: { id },
      data: {
        name: data.name,
        phone: data.phone,
        imageUrl: data.imageUrl,
        note: data.note,
        customerType: data.customerType,
        status: data.status,
      },
      select: CUSTOMER_SELECT,
    });
  }

  updateStatus(id: string, status: RecordStatus) {
    return this.prisma.customer.update({
      where: { id },
      data: { status },
      select: CUSTOMER_SELECT,
    });
  }

  deactivate(id: string) {
    return this.prisma.customer.update({
      where: { id },
      data: { status: RecordStatus.INACTIVE },
      select: CUSTOMER_SELECT,
    });
  }
}
