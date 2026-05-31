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
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { CreateCartDto } from './dto/create-cart.dto';
import { QueryCartDto } from './dto/query-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartsService } from './carts.service';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  // POST /api/carts
  @Post()
  create(@Body() dto: CreateCartDto, @CurrentUser() user: RequestUser) {
    return this.cartsService.create(dto, user.id);
  }

  // GET /api/carts?search=&status=ACTIVE&customerId=&mechanicId=&createdById=&page=1&limit=20
  @Get()
  findAll(@Query() query: QueryCartDto) {
    return this.cartsService.findAll(query);
  }

  // GET /api/carts/:id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const cart = await this.cartsService.findOne(id);
    return { success: true, data: cart };
  }

  // PATCH /api/carts/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCartDto) {
    return this.cartsService.update(id, dto);
  }

  // DELETE /api/carts/:id (discard — hard delete active cart)
  @Delete(':id')
  discard(@Param('id') id: string) {
    return this.cartsService.discard(id);
  }

  // POST /api/carts/:id/items
  @Post(':id/items')
  addItem(@Param('id') id: string, @Body() dto: AddCartItemDto) {
    return this.cartsService.addItem(id, dto);
  }

  // DELETE /api/carts/:id/items  (clear all items)
  @Delete(':id/items')
  clearItems(@Param('id') id: string) {
    return this.cartsService.clearItems(id);
  }

  // PATCH /api/carts/:id/items/:itemId
  @Patch(':id/items/:itemId')
  updateItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartsService.updateItem(id, itemId, dto);
  }

  // DELETE /api/carts/:id/items/:itemId
  @Delete(':id/items/:itemId')
  removeItem(@Param('id') id: string, @Param('itemId') itemId: string) {
    return this.cartsService.removeItem(id, itemId);
  }
}
