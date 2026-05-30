import { Module } from '@nestjs/common';

import { SalesRepository } from '../sales/sales.repository';
import { PosCartsController } from './pos-carts.controller';
import { PosCartsRepository } from './pos-carts.repository';
import { PosCartsService } from './pos-carts.service';

@Module({
  controllers: [PosCartsController],
  providers: [PosCartsService, PosCartsRepository, SalesRepository],
})
export class PosCartsModule {}
