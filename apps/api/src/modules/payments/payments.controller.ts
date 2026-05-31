import { Controller, Get, Param, Query } from '@nestjs/common';

import { QueryPaymentDto } from './dto/query-payment.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // GET /api/payments?search=&paymentMethod=CASH&saleId=&dateFrom=&dateTo=&page=1&limit=20
  @Get()
  findAll(@Query() query: QueryPaymentDto) {
    return this.paymentsService.findAll(query);
  }

  // GET /api/payments/by-sale/:saleId — MUST be before /:id
  @Get('by-sale/:saleId')
  findBySale(@Param('saleId') saleId: string) {
    return this.paymentsService.findBySale(saleId);
  }

  // GET /api/payments/:id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const payment = await this.paymentsService.findOne(id);
    return { success: true, data: payment };
  }
}
