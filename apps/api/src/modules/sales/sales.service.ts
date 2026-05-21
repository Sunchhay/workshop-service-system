import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  createPaginatedResponse,
  createResponse,
} from '../../common/types/api-response.type';
import { SaleStatus } from '../../generated/prisma/enums';
import type { CancelSaleDto } from './dto/cancel-sale.dto';
import type { CreateSaleDto } from './dto/create-sale.dto';
import type { QuerySaleDto } from './dto/query-sale.dto';
import type { UpdateSaleDto } from './dto/update-sale.dto';
import { calcSaleTotals, SalesRepository } from './sales.repository';

@Injectable()
export class SalesService {
  constructor(private readonly salesRepository: SalesRepository) {}

  async create(dto: CreateSaleDto, createdById: string) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('At least one sale item is required');
    }

    const totals = calcSaleTotals(dto.items, dto.discountAmount);
    const saleNumber = await this.salesRepository.generateSaleNumber();
    const status = dto.status ?? SaleStatus.COMPLETED;

    try {
      const sale = await this.salesRepository.createWithTransaction(
        dto,
        saleNumber,
        createdById,
        totals,
        status,
      );
      return createResponse(sale, 'Sale created');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create sale';
      throw new BadRequestException(message);
    }
  }

  async findAll(dto: QuerySaleDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const { data, total } = await this.salesRepository.findAll(dto);
    return createPaginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const sale = await this.salesRepository.findById(id);
    if (!sale) throw new NotFoundException('Sale not found');
    return sale;
  }

  async update(id: string, dto: UpdateSaleDto) {
    const sale = await this.findOne(id);

    if (sale.status === SaleStatus.CANCELLED) {
      throw new BadRequestException('Cannot edit a cancelled sale');
    }
    if (sale.status === SaleStatus.COMPLETED && dto.items !== undefined) {
      throw new BadRequestException('Cannot change items of a completed sale');
    }

    let totals;
    if (dto.items !== undefined) {
      totals = calcSaleTotals(dto.items, dto.discountAmount);
    } else if (dto.discountAmount !== undefined) {
      const subtotal = parseFloat(sale.subtotal.toString());
      const cappedDiscount = Math.min(dto.discountAmount, subtotal);
      const totalAmount = Math.max(0, subtotal - cappedDiscount);
      totals = { subtotal, totalAmount };
    }

    const updated = await this.salesRepository.update(id, dto, totals);
    return createResponse(updated, 'Sale updated');
  }

  async cancel(id: string, _dto: CancelSaleDto) {
    const sale = await this.findOne(id);

    if (sale.status === SaleStatus.CANCELLED) {
      throw new BadRequestException('Sale is already cancelled');
    }

    let updated;
    if (sale.status === SaleStatus.COMPLETED) {
      updated = await this.salesRepository.cancelAndRestoreStock(id, sale.items);
    } else {
      updated = await this.salesRepository.cancel(id);
    }

    return createResponse(updated, 'Sale cancelled');
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.salesRepository.softDelete(id);
    return createResponse(null, 'Sale deleted');
  }
}
