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
import { CreateReferenceBookDto } from './dto/create-reference-book.dto';
import { CreateReferenceBookItemDto } from './dto/create-reference-book-item.dto';
import { CreateReferenceBookSectionDto } from './dto/create-reference-book-section.dto';
import { QueryReferenceBookDto } from './dto/query-reference-book.dto';
import { UpdateReferenceBookDto } from './dto/update-reference-book.dto';
import { UpdateReferenceBookItemDto } from './dto/update-reference-book-item.dto';
import { UpdateReferenceBookSectionDto } from './dto/update-reference-book-section.dto';
import { ReferenceBookService } from './reference-book.service';

@Controller()
export class ReferenceBookController {
  constructor(private readonly referenceBookService: ReferenceBookService) {}

  // POST /api/reference-books
  @Post('reference-books')
  create(@Body() dto: CreateReferenceBookDto, @CurrentUser() user: RequestUser) {
    return this.referenceBookService.create(dto, user.id);
  }

  // GET /api/reference-books?search=&category=&machineModelId=&status=ACTIVE&page=1&limit=20
  @Get('reference-books')
  findAll(@Query() query: QueryReferenceBookDto) {
    return this.referenceBookService.findAll(query);
  }

  // GET /api/reference-books/:id
  @Get('reference-books/:id')
  async findOne(@Param('id') id: string) {
    const record = await this.referenceBookService.findOne(id);
    return { success: true, data: record };
  }

  // PATCH /api/reference-books/:id
  @Patch('reference-books/:id')
  update(@Param('id') id: string, @Body() dto: UpdateReferenceBookDto) {
    return this.referenceBookService.update(id, dto);
  }

  // DELETE /api/reference-books/:id (deactivates)
  @Delete('reference-books/:id')
  remove(@Param('id') id: string) {
    return this.referenceBookService.remove(id);
  }

  // POST /api/reference-books/:id/sections
  @Post('reference-books/:id/sections')
  createSection(@Param('id') id: string, @Body() dto: CreateReferenceBookSectionDto) {
    return this.referenceBookService.createSection(id, dto);
  }

  // PATCH /api/reference-book-sections/:id
  @Patch('reference-book-sections/:id')
  updateSection(@Param('id') id: string, @Body() dto: UpdateReferenceBookSectionDto) {
    return this.referenceBookService.updateSection(id, dto);
  }

  // DELETE /api/reference-book-sections/:id
  @Delete('reference-book-sections/:id')
  deleteSection(@Param('id') id: string) {
    return this.referenceBookService.deleteSection(id);
  }

  // POST /api/reference-book-sections/:id/items
  @Post('reference-book-sections/:id/items')
  createItem(@Param('id') id: string, @Body() dto: CreateReferenceBookItemDto) {
    return this.referenceBookService.createItem(id, dto);
  }

  // PATCH /api/reference-book-items/:id
  @Patch('reference-book-items/:id')
  updateItem(@Param('id') id: string, @Body() dto: UpdateReferenceBookItemDto) {
    return this.referenceBookService.updateItem(id, dto);
  }

  // DELETE /api/reference-book-items/:id
  @Delete('reference-book-items/:id')
  deleteItem(@Param('id') id: string) {
    return this.referenceBookService.deleteItem(id);
  }
}
