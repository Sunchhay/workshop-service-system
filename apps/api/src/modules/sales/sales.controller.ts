import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { RequestUser } from '../../common/types/jwt-payload.type';
import { CancelSaleDto } from './dto/cancel-sale.dto';
import { CreateSaleDto } from './dto/create-sale.dto';
import { QuerySaleDto } from './dto/query-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { SalesService } from './sales.service';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  // POST /api/sales
  @Post()
  create(@Body() dto: CreateSaleDto, @CurrentUser() user: RequestUser) {
    return this.salesService.create(dto, user.id);
  }

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

  // PATCH /api/sales/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSaleDto) {
    return this.salesService.update(id, dto);
  }

  // PATCH /api/sales/:id/complete
  @Patch(':id/complete')
  complete(@Param('id') id: string) {
    return this.salesService.complete(id);
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
