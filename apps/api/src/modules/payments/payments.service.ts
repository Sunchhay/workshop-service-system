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
import { InvoicesRepository } from '../invoices/invoices.repository';
import type { CreatePaymentDto } from './dto/create-payment.dto';
import type { QueryPaymentDto } from './dto/query-payment.dto';
import { PaymentsRepository } from './payments.repository';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly invoicesRepository: InvoicesRepository,
  ) {}

  async create(dto: CreatePaymentDto, createdById: string) {
    const invoice = await this.invoicesRepository.findById(dto.invoiceId);
    if (!invoice) throw new NotFoundException('Invoice not found');

    if (invoice.status === InvoiceStatus.CANCELLED) {
      throw new BadRequestException('Cannot record payment for a cancelled invoice');
    }
    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('Invoice is already fully paid');
    }

    const dueAmount = parseFloat(invoice.dueAmount.toString());

    if (dto.amount <= 0) {
      throw new BadRequestException('Payment amount must be greater than 0');
    }
    if (dto.amount > dueAmount) {
      throw new BadRequestException('Payment amount cannot exceed the invoice due amount');
    }

    const previousPaid = parseFloat(invoice.paidAmount.toString());
    const total = parseFloat(invoice.totalAmount.toString());
    const newPaidAmount = previousPaid + dto.amount;
    const newDueAmount = Math.max(0, total - newPaidAmount);

    let newStatus: InvoiceStatus;
    if (newDueAmount === 0) {
      newStatus = InvoiceStatus.PAID;
    } else if (newPaidAmount > 0) {
      newStatus = InvoiceStatus.PARTIAL;
    } else {
      newStatus = InvoiceStatus.ISSUED;
    }

    const paymentNumber = await this.paymentsRepository.generatePaymentNumber();

    const payment = await this.paymentsRepository.createWithTransaction(
      dto,
      paymentNumber,
      createdById,
      newPaidAmount,
      newDueAmount,
      newStatus,
    );

    return createResponse(payment, 'Payment recorded');
  }

  async findAll(dto: QueryPaymentDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const { data, total } = await this.paymentsRepository.findAll(dto);
    return createPaginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const payment = await this.paymentsRepository.findById(id);
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async findByInvoice(invoiceId: string) {
    const payments = await this.paymentsRepository.findByInvoiceId(invoiceId);
    return createResponse(payments);
  }

  async findByCustomer(customerId: string) {
    const payments = await this.paymentsRepository.findByCustomerId(customerId);
    return createResponse(payments);
  }
}
