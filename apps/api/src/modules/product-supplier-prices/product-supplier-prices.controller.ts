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
import { CreateProductSupplierPriceDto } from './dto/create-product-supplier-price.dto';
import { QueryProductSupplierPriceDto } from './dto/query-product-supplier-price.dto';
import { UpdateProductSupplierPriceDto } from './dto/update-product-supplier-price.dto';
import { ProductSupplierPricesService } from './product-supplier-prices.service';

@Controller('product-supplier-prices')
@Roles(UserRole.ADMIN)
export class ProductSupplierPricesController {
  constructor(
    private readonly productSupplierPricesService: ProductSupplierPricesService,
  ) {}

  // POST /api/product-supplier-prices
  @Post()
  create(@Body() dto: CreateProductSupplierPriceDto) {
    return this.productSupplierPricesService.create(dto);
  }

  // GET /api/product-supplier-prices?search=&productId=&supplierId=&currency=USD&page=1&limit=20
  @Get()
  findAll(@Query() query: QueryProductSupplierPriceDto) {
    return this.productSupplierPricesService.findAll(query);
  }

  // GET /api/product-supplier-prices/:id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const entry = await this.productSupplierPricesService.findOne(id);
    return { success: true, data: entry };
  }

  // PATCH /api/product-supplier-prices/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductSupplierPriceDto) {
    return this.productSupplierPricesService.update(id, dto);
  }

  // DELETE /api/product-supplier-prices/:id (hard delete)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productSupplierPricesService.remove(id);
  }
}
