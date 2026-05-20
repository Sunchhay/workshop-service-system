import { Module } from '@nestjs/common';

import { PriceCatalogController } from './price-catalog.controller';
import { PriceCatalogRepository } from './price-catalog.repository';
import { PriceCatalogService } from './price-catalog.service';

@Module({
  controllers: [PriceCatalogController],
  providers: [PriceCatalogService, PriceCatalogRepository],
  exports: [PriceCatalogService],
})
export class PriceCatalogModule {}
