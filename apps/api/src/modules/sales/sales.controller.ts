import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { RequestUser } from '../../common/types/jwt-payload.type';
import { CreatePaymentDto } from '../payments/dto/create-payment.dto';
import { QuerySaleDto } from './dto/query-sale.dto';
import { VoidSaleDto } from './dto/void-sale.dto';
import { SalesService } from './sales.service';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  // GET /api/sales?search=&saleStatus=COMPLETED&paymentStatus=UNPAID&customerId=&mechanicId=&dateFrom=&dateTo=&page=1&limit=20
  @Get()
  findAll(@Query() query: QuerySaleDto) {
    return this.salesService.findAll(query);
  }

  // GET /api/sales/:id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const sale = await this.salesService.findOne(id);
    return { success: true, data: sale };
  }

  // POST /api/sales/:id/void
  @Post(':id/void')
  voidSale(
    @Param('id') id: string,
    @Body() dto: VoidSaleDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.salesService.voidSale(id, dto, user.id);
  }

  // POST /api/sales/:id/commission-paid
  @Post(':id/commission-paid')
  markCommissionPaid(@Param('id') id: string) {
    return this.salesService.markCommissionPaid(id);
  }

  // POST /api/sales/:id/payments
  @Post(':id/payments')
  addPayment(@Param('id') id: string, @Body() dto: CreatePaymentDto) {
    return this.salesService.addPayment(id, dto);
  }
}
