import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { RequestUser } from '../../common/types/jwt-payload.type';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { QueryPaymentDto } from './dto/query-payment.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // POST /api/payments
  @Post()
  create(@Body() dto: CreatePaymentDto, @CurrentUser() user: RequestUser) {
    return this.paymentsService.create(dto, user.id);
  }

  // GET /api/payments
  @Get()
  findAll(@Query() query: QueryPaymentDto) {
    return this.paymentsService.findAll(query);
  }

  // GET /api/payments/by-invoice/:invoiceId  — MUST be before /:id
  @Get('by-invoice/:invoiceId')
  findByInvoice(@Param('invoiceId') invoiceId: string) {
    return this.paymentsService.findByInvoice(invoiceId);
  }

  // GET /api/payments/by-customer/:customerId — MUST be before /:id
  @Get('by-customer/:customerId')
  findByCustomer(@Param('customerId') customerId: string) {
    return this.paymentsService.findByCustomer(customerId);
  }

  // GET /api/payments/:id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const payment = await this.paymentsService.findOne(id);
    return { success: true, data: payment };
  }
}
