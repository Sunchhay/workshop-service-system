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
    const brand = dto.brand.trim();
    const model = dto.model.trim();
    const existing = await this.machineModelsRepository.findByBrandAndModel(
      brand,
      model,
    );
    if (existing) {
      throw new BadRequestException('ម៉ូដែលនេះមានរួចហើយ។');
    }

    const machineModel = await this.machineModelsRepository.create({ ...dto, brand, model });
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

    const newBrand = dto.brand?.trim() ?? current.brand;
    const newModel = dto.model?.trim() ?? current.model;

    if (dto.brand !== undefined || dto.model !== undefined) {
      const duplicate = await this.machineModelsRepository.findByBrandAndModel(
        newBrand,
        newModel,
        id,
      );
      if (duplicate) {
        throw new BadRequestException('ម៉ូដែលនេះមានរួចហើយ។');
      }
    }

    const machineModel = await this.machineModelsRepository.update(id, {
      ...dto,
      ...(dto.brand !== undefined && { brand: newBrand }),
      ...(dto.model !== undefined && { model: newModel }),
    });
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
