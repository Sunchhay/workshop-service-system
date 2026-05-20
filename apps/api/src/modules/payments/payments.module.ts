import { Module } from '@nestjs/common';

import { InvoicesRepository } from '../invoices/invoices.repository';
import { PaymentsController } from './payments.controller';
import { PaymentsRepository } from './payments.repository';
import { PaymentsService } from './payments.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsRepository, InvoicesRepository],
  exports: [PaymentsService],
})
export class PaymentsModule {}
