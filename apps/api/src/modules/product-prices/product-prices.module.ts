import { Module } from '@nestjs/common';

import { ProductPricesController } from './product-prices.controller';
import { ProductPricesRepository } from './product-prices.repository';
import { ProductPricesService } from './product-prices.service';

@Module({
  controllers: [ProductPricesController],
  providers: [ProductPricesService, ProductPricesRepository],
  exports: [ProductPricesService],
})
export class ProductPricesModule {}
