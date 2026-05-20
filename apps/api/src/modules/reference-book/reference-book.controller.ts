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

import { ReferenceBookService } from './reference-book.service';
import { CreateReferenceBookDto } from './dto/create-reference-book.dto';
import { QueryReferenceBookDto } from './dto/query-reference-book.dto';
import {
  UpdateReferenceBookDto,
  UpdateReferenceBookStatusDto,
  UpdateVerificationStatusDto,
} from './dto/update-reference-book.dto';

@Controller('reference-book')
export class ReferenceBookController {
  constructor(private readonly referenceBookService: ReferenceBookService) {}

  // POST /api/reference-book
  @Post()
  create(@Body() dto: CreateReferenceBookDto) {
    return this.referenceBookService.create(dto);
  }

  // GET /api/reference-book
  @Get()
  findAll(@Query() query: QueryReferenceBookDto) {
    return this.referenceBookService.findAll(query);
  }

  // GET /api/reference-book/:id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const record = await this.referenceBookService.findOne(id);
    return { success: true, data: record };
  }

  // PATCH /api/reference-book/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateReferenceBookDto) {
    return this.referenceBookService.update(id, dto);
  }

  // PATCH /api/reference-book/:id/status
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateReferenceBookStatusDto,
  ) {
    return this.referenceBookService.updateStatus(id, dto);
  }

  // PATCH /api/reference-book/:id/verification-status
  @Patch(':id/verification-status')
  updateVerificationStatus(
    @Param('id') id: string,
    @Body() dto: UpdateVerificationStatusDto,
  ) {
    return this.referenceBookService.updateVerificationStatus(id, dto);
  }

  // DELETE /api/reference-book/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.referenceBookService.remove(id);
  }
}
