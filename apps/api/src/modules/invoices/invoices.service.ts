import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  createPaginatedResponse,
  createResponse,
} from '../../common/types/api-response.type';
import { InvoiceStatus } from '../../generated/prisma/enums';
import type { CancelInvoiceDto } from './dto/cancel-invoice.dto';
import type { CreateInvoiceDto, CreateInvoiceItemDto } from './dto/create-invoice.dto';
import type { QueryInvoiceDto } from './dto/query-invoice.dto';
import type { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { calcTotals, InvoicesRepository } from './invoices.repository';

@Injectable()
export class InvoicesService {
  constructor(private readonly invoicesRepository: InvoicesRepository) {}

  async create(dto: CreateInvoiceDto, createdById: string) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('At least one invoice item is required');
    }
    const totals = calcTotals(dto.items, dto.discountAmount, dto.taxAmount);
    const invoiceNumber = await this.invoicesRepository.generateInvoiceNumber();
    const invoice = await this.invoicesRepository.create(
      dto,
      invoiceNumber,
      createdById,
      totals,
    );
    return createResponse(invoice, 'Invoice created');
  }

  async createFromServiceJob(serviceJobId: string, createdById: string) {
    const job = await this.invoicesRepository.findServiceJobWithItems(serviceJobId);
    if (!job) throw new NotFoundException('Service job not found');

    const items: CreateInvoiceItemDto[] = job.items.map((item) => ({
      type: item.type as any,
      serviceId: item.serviceId ?? undefined,
      productId: item.productId ?? undefined,
      description: item.description,
      quantity: parseFloat(item.quantity.toString()),
      unitPrice: parseFloat(item.unitPrice.toString()),
    }));

    if (items.length === 0) {
      throw new BadRequestException(
        'Service job has no items to include in the invoice',
      );
    }

    const dto: CreateInvoiceDto = {
      customerId: job.customerId,
      serviceJobId: job.id,
      items,
    };

    return this.create(dto, createdById);
  }

  async findAll(dto: QueryInvoiceDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const { data, total } = await this.invoicesRepository.findAll(dto);
    return createPaginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const invoice = await this.invoicesRepository.findById(id);
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  async update(id: string, dto: UpdateInvoiceDto) {
    await this.findOne(id);

    let totals;
    if (dto.items !== undefined) {
      totals = calcTotals(
        dto.items as CreateInvoiceItemDto[],
        dto.discountAmount,
        dto.taxAmount,
      );
    }

    const invoice = await this.invoicesRepository.update(id, dto, totals);
    return createResponse(invoice, 'Invoice updated');
  }

  async cancel(id: string, _dto: CancelInvoiceDto) {
    const invoice = await this.findOne(id);
    if (invoice.status === InvoiceStatus.CANCELLED) {
      throw new BadRequestException('Invoice is already cancelled');
    }
    const updated = await this.invoicesRepository.cancel(id);
    return createResponse(updated, 'Invoice cancelled');
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.invoicesRepository.softDelete(id);
    return createResponse(null, 'Invoice deleted');
  }
}
