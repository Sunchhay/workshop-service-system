import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';

import { CancelSaleDto } from './dto/cancel-sale.dto';
import { QuerySaleDto } from './dto/query-sale.dto';
import { SalesService } from './sales.service';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  // GET /api/sales
  @Get()
  findAll(@Query() query: QuerySaleDto) {
    return this.salesService.findAll(query);
  }

  // GET /api/sales/:id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const sale = await this.salesService.findOne(id);
    return { success: true, data: sale };
  }

  // PATCH /api/sales/:id/cancel
  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @Body() dto: CancelSaleDto) {
    return this.salesService.cancel(id, dto);
  }

  // DELETE /api/sales/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesService.remove(id);
  }
}
