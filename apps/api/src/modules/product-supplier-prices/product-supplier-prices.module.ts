import { Module } from '@nestjs/common';

import { ProductSupplierPricesController } from './product-supplier-prices.controller';
import { ProductSupplierPricesRepository } from './product-supplier-prices.repository';
import { ProductSupplierPricesService } from './product-supplier-prices.service';

@Module({
  controllers: [ProductSupplierPricesController],
  providers: [ProductSupplierPricesService, ProductSupplierPricesRepository],
  exports: [ProductSupplierPricesService],
})
export class ProductSupplierPricesModule {}
