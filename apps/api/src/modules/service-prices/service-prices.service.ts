import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  createPaginatedResponse,
  createResponse,
} from '../../common/types/api-response.type';
import { CustomerType } from '../../generated/prisma/enums';
import { ServicePricesRepository } from './service-prices.repository';
import type { CreateServicePriceDto } from './dto/create-service-price.dto';
import type {
  QueryServicePriceDto,
  SuggestServicePriceDto,
} from './dto/query-service-price.dto';
import type {
  UpdateServicePriceDto,
  UpdateServicePriceStatusDto,
} from './dto/update-service-price.dto';

@Injectable()
export class ServicePricesService {
  constructor(
    private readonly servicePricesRepository: ServicePricesRepository,
  ) {}

  async create(dto: CreateServicePriceDto) {
    if (dto.ownerPrice === undefined && dto.mechanicPrice === undefined) {
      throw new BadRequestException(
        'At least one of ownerPrice or mechanicPrice must be provided',
      );
    }

    const serviceExists = await this.servicePricesRepository.serviceExists(
      dto.serviceId,
    );
    if (!serviceExists) {
      throw new BadRequestException('Service not found');
    }

    const modelExists = await this.servicePricesRepository.machineModelExists(
      dto.machineModelId,
    );
    if (!modelExists) {
      throw new BadRequestException('Machine model not found');
    }

    const duplicate = await this.servicePricesRepository.findByPair(
      dto.serviceId,
      dto.machineModelId,
    );
    if (duplicate) {
      throw new BadRequestException(
        'A service price for this service and machine model combination already exists',
      );
    }

    const servicePrice = await this.servicePricesRepository.create(dto);
    return createResponse(servicePrice, 'Service price created');
  }

  async findAll(dto: QueryServicePriceDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const { data, total } = await this.servicePricesRepository.findAll(dto);
    return createPaginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const servicePrice = await this.servicePricesRepository.findById(id);
    if (!servicePrice) {
      throw new NotFoundException('Service price not found');
    }
    return servicePrice;
  }

  async update(id: string, dto: UpdateServicePriceDto) {
    const current = await this.findOne(id);

    if (dto.serviceId !== undefined) {
      const serviceExists = await this.servicePricesRepository.serviceExists(
        dto.serviceId,
      );
      if (!serviceExists) {
        throw new BadRequestException('Service not found');
      }
    }

    if (dto.machineModelId !== undefined) {
      const modelExists = await this.servicePricesRepository.machineModelExists(
        dto.machineModelId,
      );
      if (!modelExists) {
        throw new BadRequestException('Machine model not found');
      }
    }

    if (dto.serviceId !== undefined || dto.machineModelId !== undefined) {
      const newServiceId = dto.serviceId ?? current.serviceId;
      const newMachineModelId = dto.machineModelId ?? current.machineModelId;
      const duplicate = await this.servicePricesRepository.findByPair(
        newServiceId,
        newMachineModelId,
        id,
      );
      if (duplicate) {
        throw new BadRequestException(
          'A service price for this service and machine model combination already exists',
        );
      }
    }

    const servicePrice = await this.servicePricesRepository.update(id, dto);
    return createResponse(servicePrice, 'Service price updated');
  }

  async updateStatus(id: string, dto: UpdateServicePriceStatusDto) {
    await this.findOne(id);
    const servicePrice = await this.servicePricesRepository.updateStatus(
      id,
      dto.status,
    );
    return createResponse(servicePrice, 'Service price status updated');
  }

  async remove(id: string) {
    await this.findOne(id);
    const servicePrice = await this.servicePricesRepository.deactivate(id);
    return createResponse(servicePrice, 'Service price deactivated');
  }

  async suggest(dto: SuggestServicePriceDto) {
    const sp = await this.servicePricesRepository.findActiveByPair(
      dto.serviceId,
      dto.machineModelId,
    );
    if (!sp) {
      throw new NotFoundException(
        'No active service price found for this service and machine model',
      );
    }

    let suggestedPrice: number | null = null;
    let priceSource: string | null = null;

    if (dto.customerType === CustomerType.OWNER) {
      if (sp.ownerPrice !== null) {
        suggestedPrice = parseFloat(sp.ownerPrice.toString());
        priceSource = 'OWNER_PRICE';
      } else if (sp.mechanicPrice !== null) {
        suggestedPrice = parseFloat(sp.mechanicPrice.toString());
        priceSource = 'FALLBACK_MECHANIC_PRICE';
      }
    } else {
      if (sp.mechanicPrice !== null) {
        suggestedPrice = parseFloat(sp.mechanicPrice.toString());
        priceSource = 'MECHANIC_PRICE';
      } else if (sp.ownerPrice !== null) {
        suggestedPrice = parseFloat(sp.ownerPrice.toString());
        priceSource = 'FALLBACK_OWNER_PRICE';
      }
    }

    return createResponse({
      servicePriceId: sp.id,
      serviceId: sp.serviceId,
      machineModelId: sp.machineModelId,
      customerType: dto.customerType,
      suggestedPrice,
      priceSource,
      serviceName: sp.service.nameEn,
      machineModelName: sp.machineModel.modelName,
    });
  }
}
