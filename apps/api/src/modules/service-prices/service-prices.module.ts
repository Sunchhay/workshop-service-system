import { Module } from '@nestjs/common';

import { ServicePricesController } from './service-prices.controller';
import { ServicePricesRepository } from './service-prices.repository';
import { ServicePricesService } from './service-prices.service';

@Module({
  controllers: [ServicePricesController],
  providers: [ServicePricesService, ServicePricesRepository],
  exports: [ServicePricesService],
})
export class ServicePricesModule {}
