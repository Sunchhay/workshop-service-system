import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { RequestUser } from '../../common/types/jwt-payload.type';
import { CreateQuotationFromCartDto } from './dto/create-quotation.dto';
import { QuotationsService } from './quotations.service';

@Controller('quotations')
export class QuotationsController {
  constructor(private readonly service: QuotationsService) {}

  // POST /api/quotations/from-cart
  @Post('from-cart')
  createFromCart(@Body() dto: CreateQuotationFromCartDto, @CurrentUser() user: RequestUser) {
    return this.service.createFromCart(dto.cartId, user.id, dto.notes, dto.validUntil);
  }

  // GET /api/quotations
  @Get()
  findAll(@CurrentUser() user: RequestUser) {
    return this.service.findAll(user.id);
  }

  // GET /api/quotations/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
