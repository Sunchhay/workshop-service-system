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
import { CreateProductPriceDto } from './dto/create-product-price.dto';
import {
  QueryProductPriceDto,
  SuggestProductPriceDto,
} from './dto/query-product-price.dto';
import {
  UpdateProductPriceDto,
  UpdateProductPriceStatusDto,
} from './dto/update-product-price.dto';
import { ProductPricesService } from './product-prices.service';

@Controller('product-prices')
@Roles(UserRole.ADMIN)
export class ProductPricesController {
  constructor(private readonly productPricesService: ProductPricesService) {}

  // POST /api/product-prices
  @Post()
  create(@Body() dto: CreateProductPriceDto) {
    return this.productPricesService.create(dto);
  }

  // GET /api/product-prices?search=&productId=&machineModelId=&status=ACTIVE&category=&machineType=&page=1&limit=20
  @Get()
  findAll(@Query() query: QueryProductPriceDto) {
    return this.productPricesService.findAll(query);
  }

  // GET /api/product-prices/suggest?productId=xxx&machineModelId=xxx&customerType=OWNER — MUST be before /:id
  @Get('suggest')
  suggest(@Query() query: SuggestProductPriceDto) {
    return this.productPricesService.suggest(query);
  }

  // GET /api/product-prices/:id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const productPrice = await this.productPricesService.findOne(id);
    return { success: true, data: productPrice };
  }

  // PATCH /api/product-prices/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductPriceDto) {
    return this.productPricesService.update(id, dto);
  }

  // PATCH /api/product-prices/:id/status
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateProductPriceStatusDto,
  ) {
    return this.productPricesService.updateStatus(id, dto);
  }

  // DELETE /api/product-prices/:id (deactivates)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productPricesService.remove(id);
  }
}
