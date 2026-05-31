import { Module } from '@nestjs/common';

import { SalesRepository } from '../sales/sales.repository';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';

@Module({
  controllers: [CheckoutController],
  providers: [CheckoutService, SalesRepository],
})
export class CheckoutModule {}
