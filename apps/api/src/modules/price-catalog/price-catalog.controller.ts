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

import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../generated/prisma/enums';
import { CreatePriceCatalogDto } from './dto/create-price-catalog.dto';
import {
  QueryPriceCatalogDto,
  SuggestPriceCatalogDto,
} from './dto/query-price-catalog.dto';
import {
  UpdatePriceCatalogDto,
  UpdatePriceCatalogStatusDto,
} from './dto/update-price-catalog.dto';
import { PriceCatalogService } from './price-catalog.service';

@Controller('price-catalog')
@Roles(UserRole.ADMIN)
export class PriceCatalogController {
  constructor(private readonly priceCatalogService: PriceCatalogService) {}

  // POST /api/price-catalog
  @Post()
  create(@Body() dto: CreatePriceCatalogDto) {
    return this.priceCatalogService.create(dto);
  }

  // GET /api/price-catalog
  @Get()
  findAll(@Query() query: QueryPriceCatalogDto) {
    return this.priceCatalogService.findAll(query);
  }

  // GET /api/price-catalog/suggest — MUST be before /:id
  @Get('suggest')
  suggest(@Query() query: SuggestPriceCatalogDto) {
    return this.priceCatalogService.suggest(query);
  }

  // GET /api/price-catalog/:id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const entry = await this.priceCatalogService.findOne(id);
    return { success: true, data: entry };
  }

  // PATCH /api/price-catalog/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePriceCatalogDto) {
    return this.priceCatalogService.update(id, dto);
  }

  // PATCH /api/price-catalog/:id/status
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdatePriceCatalogStatusDto) {
    return this.priceCatalogService.updateStatus(id, dto);
  }

  // DELETE /api/price-catalog/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.priceCatalogService.remove(id);
  }
}
