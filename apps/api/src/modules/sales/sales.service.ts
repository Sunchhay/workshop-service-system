import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  createPaginatedResponse,
  createResponse,
} from '../../common/types/api-response.type';
import { CommissionStatus, PaymentStatus, SaleStatus } from '../../generated/prisma/enums';
import { PaymentsRepository } from '../payments/payments.repository';
import type { CreatePaymentDto } from '../payments/dto/create-payment.dto';
import type { QuerySaleDto } from './dto/query-sale.dto';
import type { VoidSaleDto } from './dto/void-sale.dto';
import { SalesRepository } from './sales.repository';

@Injectable()
export class SalesService {
  constructor(
    private readonly salesRepository: SalesRepository,
    private readonly paymentsRepository: PaymentsRepository,
  ) {}

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

  async voidSale(id: string, dto: VoidSaleDto, voidedById: string) {
    const sale = await this.findOne(id);
    if (sale.saleStatus === SaleStatus.VOIDED) {
      throw new BadRequestException('Sale is already voided');
    }
    const updated = await this.salesRepository.void(id, dto.voidReason, voidedById);
    return createResponse(updated, 'Sale voided');
  }

  async markCommissionPaid(id: string) {
    const sale = await this.findOne(id);
    const commissionAmount = parseFloat(sale.commissionAmount.toString());
    if (commissionAmount <= 0) {
      throw new BadRequestException('Sale has no commission amount');
    }
    if (sale.commissionStatus === CommissionStatus.PAID) {
      throw new BadRequestException('Commission is already marked as paid');
    }
    const updated = await this.salesRepository.markCommissionPaid(id);
    return createResponse(updated, 'Commission marked as paid');
  }

  async addPayment(saleId: string, dto: CreatePaymentDto) {
    const sale = await this.findOne(saleId);
    if (sale.saleStatus === SaleStatus.VOIDED) {
      throw new BadRequestException('Cannot add payment to a voided sale');
    }
    if (sale.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('Sale is already fully paid');
    }
    if (dto.amount <= 0) {
      throw new BadRequestException('Payment amount must be greater than 0');
    }

    const payment = await this.paymentsRepository.create({ ...dto, saleId });

    const grandTotal = parseFloat(sale.grandTotal.toString());
    const prevPaid = parseFloat(sale.paidAmount.toString());
    const newPaid = prevPaid + dto.amount;
    const newBalance = Math.max(0, grandTotal - newPaid);

    let paymentStatus: PaymentStatus;
    if (newPaid <= 0) paymentStatus = PaymentStatus.UNPAID;
    else if (newPaid >= grandTotal) paymentStatus = PaymentStatus.PAID;
    else paymentStatus = PaymentStatus.PARTIAL;

    const updated = await this.salesRepository.updatePaymentTotals(
      saleId,
      newPaid,
      newBalance,
      paymentStatus,
    );

    return createResponse({ sale: updated, payment }, 'Payment added');
  }
}
