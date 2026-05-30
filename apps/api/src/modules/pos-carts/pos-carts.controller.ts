import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { RequestUser } from '../../common/types/jwt-payload.type';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { CheckoutPosCartDto } from './dto/checkout-pos-cart.dto';
import { CreatePosCartDto } from './dto/create-pos-cart.dto';
import { QueryCartServiceCatalogDto } from './dto/query-cart-service-catalog.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { UpdatePosCartDto } from './dto/update-pos-cart.dto';
import { PosCartsService } from './pos-carts.service';

@Controller('carts')
export class PosCartsController {
  constructor(private readonly service: PosCartsService) {}

  // GET /api/carts/service-catalog
  @Get('service-catalog')
  searchServiceCatalog(@Query() dto: QueryCartServiceCatalogDto) {
    return this.service.searchServiceCatalog(dto);
  }

  // GET /api/carts/active
  @Get('active')
  findActive(@CurrentUser() user: RequestUser) {
    return this.service.findActive(user.id);
  }

  // POST /api/carts
  @Post()
  create(@Body() dto: CreatePosCartDto, @CurrentUser() user: RequestUser) {
    return this.service.create(dto, user.id);
  }

  // GET /api/carts/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // PATCH /api/carts/:id  (cart header only — customer, discount, note, etc.)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePosCartDto) {
    return this.service.update(id, dto);
  }

  // PATCH /api/carts/:id/close
  @Patch(':id/close')
  close(@Param('id') id: string) {
    return this.service.close(id);
  }

  // POST /api/carts/:id/checkout
  @Post(':id/checkout')
  checkout(
    @Param('id') id: string,
    @Body() dto: CheckoutPosCartDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.service.checkout(id, dto, user.id);
  }

  // DELETE /api/carts/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  // ─── CartItem endpoints ────────────────────────────────────────────────────

  // POST /api/carts/:id/items
  @Post(':id/items')
  addItem(@Param('id') cartId: string, @Body() dto: AddCartItemDto) {
    return this.service.addItem(cartId, dto);
  }

  // PATCH /api/carts/:id/items/:itemId
  @Patch(':id/items/:itemId')
  updateItem(
    @Param('id') cartId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.service.updateItem(cartId, itemId, dto);
  }

  // DELETE /api/carts/:id/items/:itemId
  @Delete(':id/items/:itemId')
  removeItem(@Param('id') cartId: string, @Param('itemId') itemId: string) {
    return this.service.removeItem(cartId, itemId);
  }
}
