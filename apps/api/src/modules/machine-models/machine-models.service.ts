import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  createPaginatedResponse,
  createResponse,
} from '../../common/types/api-response.type';
import { MachineModelsRepository } from './machine-models.repository';
import type { CreateMachineModelDto } from './dto/create-machine-model.dto';
import type { QueryMachineModelDto } from './dto/query-machine-model.dto';
import type {
  UpdateMachineModelDto,
  UpdateMachineModelStatusDto,
} from './dto/update-machine-model.dto';

@Injectable()
export class MachineModelsService {
  constructor(private readonly machineModelsRepository: MachineModelsRepository) {}

  async create(dto: CreateMachineModelDto) {
    const existing = await this.machineModelsRepository.findByBrandAndModel(
      dto.brand,
      dto.model,
    );
    if (existing) {
      throw new BadRequestException(
        `Machine model "${dto.brand} ${dto.model}" already exists`,
      );
    }

    const machineModel = await this.machineModelsRepository.create(dto);
    return createResponse(machineModel, 'Machine model created');
  }

  async findAll(dto: QueryMachineModelDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const { data, total } = await this.machineModelsRepository.findAll(dto);
    return createPaginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const machineModel = await this.machineModelsRepository.findById(id);
    if (!machineModel) {
      throw new NotFoundException('Machine model not found');
    }
    return machineModel;
  }

  async update(id: string, dto: UpdateMachineModelDto) {
    const current = await this.findOne(id);

    const newBrand = dto.brand ?? current.brand;
    const newModel = dto.model ?? current.model;

    if (dto.brand !== undefined || dto.model !== undefined) {
      const duplicate = await this.machineModelsRepository.findByBrandAndModel(
        newBrand,
        newModel,
        id,
      );
      if (duplicate) {
        throw new BadRequestException(
          `Machine model "${newBrand} ${newModel}" already exists`,
        );
      }
    }

    const machineModel = await this.machineModelsRepository.update(id, dto);
    return createResponse(machineModel, 'Machine model updated');
  }

  async updateStatus(id: string, dto: UpdateMachineModelStatusDto) {
    await this.findOne(id);
    const machineModel = await this.machineModelsRepository.updateStatus(
      id,
      dto.isActive,
    );
    return createResponse(machineModel, 'Machine model status updated');
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.machineModelsRepository.softDelete(id);
    return createResponse(null, 'Machine model deleted');
  }
}
