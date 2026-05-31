import { Module } from '@nestjs/common';

import { PaymentsRepository } from '../payments/payments.repository';
import { SalesController } from './sales.controller';
import { SalesRepository } from './sales.repository';
import { SalesService } from './sales.service';

@Module({
  controllers: [SalesController],
  providers: [SalesService, SalesRepository, PaymentsRepository],
  exports: [SalesService, SalesRepository],
})
export class SalesModule {}
