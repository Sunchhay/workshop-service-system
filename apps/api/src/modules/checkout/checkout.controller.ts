import { Body, Controller, Post } from '@nestjs/common';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { RequestUser } from '../../common/types/jwt-payload.type';
import { CheckoutDto } from './dto/checkout.dto';
import { CheckoutService } from './checkout.service';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  // POST /api/checkout/complete
  @Post('complete')
  complete(@Body() dto: CheckoutDto, @CurrentUser() user: RequestUser) {
    return this.checkoutService.complete(dto, user.id);
  }
}
