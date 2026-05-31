import { Injectable } from '@nestjs/common';

import { RecordStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateMachineModelDto } from './dto/create-machine-model.dto';
import type { QueryMachineModelDto } from './dto/query-machine-model.dto';
import type { UpdateMachineModelDto } from './dto/update-machine-model.dto';

const MACHINE_MODEL_SELECT = {
  id: true,
  code: true,
  brand: true,
  modelName: true,
  machineType: true,
  year: true,
  imageUrl: true,
  description: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class MachineModelsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateMachineModelDto) {
    return this.prisma.machineModel.create({
      data: {
        code: data.code,
        modelName: data.modelName,
        brand: data.brand,
        machineType: data.machineType,
        year: data.year,
        imageUrl: data.imageUrl,
        description: data.description,
        status: data.status,
      },
      select: MACHINE_MODEL_SELECT,
    });
  }

  async findAll(dto: QueryMachineModelDto) {
    const { search, machineType, status, page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    const where = {
      ...(machineType !== undefined && { machineType }),
      ...(status !== undefined && { status }),
      ...(search !== undefined && {
        OR: [
          { code: { contains: search, mode: 'insensitive' as const } },
          { brand: { contains: search, mode: 'insensitive' as const } },
          { modelName: { contains: search, mode: 'insensitive' as const } },
          { machineType: { contains: search, mode: 'insensitive' as const } },
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
        orderBy: [{ code: 'asc' }],
      }),
      this.prisma.machineModel.count({ where }),
    ]);

    return { data, total };
  }

  findById(id: string) {
    return this.prisma.machineModel.findUnique({
      where: { id },
      select: MACHINE_MODEL_SELECT,
    });
  }

  findByCode(code: string, excludeId?: string) {
    return this.prisma.machineModel.findFirst({
      where: {
        code,
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

  updateStatus(id: string, status: RecordStatus) {
    return this.prisma.machineModel.update({
      where: { id },
      data: { status },
      select: MACHINE_MODEL_SELECT,
    });
  }

  deactivate(id: string) {
    return this.prisma.machineModel.update({
      where: { id },
      data: { status: RecordStatus.INACTIVE },
      select: MACHINE_MODEL_SELECT,
    });
  }
}
