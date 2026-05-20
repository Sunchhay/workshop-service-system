import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import type { CreateMachineModelDto } from './dto/create-machine-model.dto';
import type { QueryMachineModelDto } from './dto/query-machine-model.dto';
import type { UpdateMachineModelDto } from './dto/update-machine-model.dto';

const MACHINE_MODEL_SELECT = {
  id: true,
  brand: true,
  model: true,
  category: true,
  description: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class MachineModelsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateMachineModelDto) {
    return this.prisma.machineModel.create({
      data: {
        brand: data.brand,
        model: data.model,
        category: data.category,
        description: data.description,
      },
      select: MACHINE_MODEL_SELECT,
    });
  }

  async findAll(dto: QueryMachineModelDto) {
    const { search, category, isActive, page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      ...(category !== undefined && { category }),
      ...(isActive !== undefined && { isActive }),
      ...(search !== undefined && {
        OR: [
          { brand: { contains: search, mode: 'insensitive' as const } },
          { model: { contains: search, mode: 'insensitive' as const } },
          { category: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.machineModel.findMany({
        where,
        select: MACHINE_MODEL_SELECT,
        skip,
        take: limit,
        orderBy: [{ brand: 'asc' }, { model: 'asc' }],
      }),
      this.prisma.machineModel.count({ where }),
    ]);

    return { data, total };
  }

  findById(id: string) {
    return this.prisma.machineModel.findFirst({
      where: { id, deletedAt: null },
      select: MACHINE_MODEL_SELECT,
    });
  }

  findByBrandAndModel(brand: string, model: string, excludeId?: string) {
    return this.prisma.machineModel.findFirst({
      where: {
        brand,
        model,
        deletedAt: null,
        ...(excludeId && { NOT: { id: excludeId } }),
      },
      select: { id: true },
    });
  }

  update(id: string, data: UpdateMachineModelDto) {
    return this.prisma.machineModel.update({
      where: { id },
      data,
      select: MACHINE_MODEL_SELECT,
    });
  }

  updateStatus(id: string, isActive: boolean) {
    return this.prisma.machineModel.update({
      where: { id },
      data: { isActive },
      select: MACHINE_MODEL_SELECT,
    });
  }

  softDelete(id: string) {
    return this.prisma.machineModel.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: MACHINE_MODEL_SELECT,
    });
  }
}
