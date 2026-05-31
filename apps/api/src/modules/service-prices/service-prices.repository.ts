import { Injectable } from '@nestjs/common';

import { RecordStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateServicePriceDto } from './dto/create-service-price.dto';
import type { QueryServicePriceDto } from './dto/query-service-price.dto';
import type { UpdateServicePriceDto } from './dto/update-service-price.dto';

const SERVICE_PRICE_SELECT = {
  id: true,
  serviceId: true,
  machineModelId: true,
  ownerPrice: true,
  mechanicPrice: true,
  note: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  service: {
    select: {
      id: true,
      code: true,
      name: true,
      nameEn: true,
      category: true,
    },
  },
  machineModel: {
    select: {
      id: true,
      code: true,
      brand: true,
      modelName: true,
      machineType: true,
      imageUrl: true,
    },
  },
} as const;

@Injectable()
export class ServicePricesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateServicePriceDto) {
    return this.prisma.servicePrice.create({
      data: {
        serviceId: data.serviceId,
        machineModelId: data.machineModelId,
        ownerPrice: data.ownerPrice,
        mechanicPrice: data.mechanicPrice,
        note: data.note,
        status: data.status,
      },
      select: SERVICE_PRICE_SELECT,
    });
  }

  async findAll(dto: QueryServicePriceDto) {
    const {
      search,
      serviceId,
      machineModelId,
      status,
      category,
      machineType,
      page = 1,
      limit = 20,
    } = dto;
    const skip = (page - 1) * limit;

    const where = {
      ...(serviceId !== undefined && { serviceId }),
      ...(machineModelId !== undefined && { machineModelId }),
      ...(status !== undefined && { status }),
      ...(category !== undefined && { service: { category } }),
      ...(machineType !== undefined && { machineModel: { machineType } }),
      ...(search !== undefined && {
        OR: [
          {
            service: {
              code: { contains: search, mode: 'insensitive' as const },
            },
          },
          {
            service: {
              name: { contains: search, mode: 'insensitive' as const },
            },
          },
          {
            service: {
              nameEn: { contains: search, mode: 'insensitive' as const },
            },
          },
          {
            service: {
              category: { contains: search, mode: 'insensitive' as const },
            },
          },
          {
            machineModel: {
              code: { contains: search, mode: 'insensitive' as const },
            },
          },
          {
            machineModel: {
              brand: { contains: search, mode: 'insensitive' as const },
            },
          },
          {
            machineModel: {
              modelName: { contains: search, mode: 'insensitive' as const },
            },
          },
          {
            machineModel: {
              machineType: { contains: search, mode: 'insensitive' as const },
            },
          },
          { note: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.servicePrice.findMany({
        where,
        select: SERVICE_PRICE_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.servicePrice.count({ where }),
    ]);

    return { data, total };
  }

  findById(id: string) {
    return this.prisma.servicePrice.findUnique({
      where: { id },
      select: SERVICE_PRICE_SELECT,
    });
  }

  findByPair(serviceId: string, machineModelId: string, excludeId?: string) {
    return this.prisma.servicePrice.findFirst({
      where: {
        serviceId,
        machineModelId,
        ...(excludeId && { NOT: { id: excludeId } }),
      },
      select: { id: true },
    });
  }

  findActiveByPair(serviceId: string, machineModelId: string) {
    return this.prisma.servicePrice.findFirst({
      where: { serviceId, machineModelId, status: RecordStatus.ACTIVE },
      select: SERVICE_PRICE_SELECT,
    });
  }

  serviceExists(serviceId: string) {
    return this.prisma.service.findUnique({
      where: { id: serviceId },
      select: { id: true },
    });
  }

  machineModelExists(machineModelId: string) {
    return this.prisma.machineModel.findUnique({
      where: { id: machineModelId },
      select: { id: true },
    });
  }

  update(id: string, data: UpdateServicePriceDto) {
    return this.prisma.servicePrice.update({
      where: { id },
      data,
      select: SERVICE_PRICE_SELECT,
    });
  }

  updateStatus(id: string, status: RecordStatus) {
    return this.prisma.servicePrice.update({
      where: { id },
      data: { status },
      select: SERVICE_PRICE_SELECT,
    });
  }

  deactivate(id: string) {
    return this.prisma.servicePrice.update({
      where: { id },
      data: { status: RecordStatus.INACTIVE },
      select: SERVICE_PRICE_SELECT,
    });
  }
}
