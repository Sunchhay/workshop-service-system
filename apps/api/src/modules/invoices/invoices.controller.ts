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
import { CancelInvoiceDto } from './dto/cancel-invoice.dto';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { QueryInvoiceDto } from './dto/query-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  // POST /api/invoices
  @Post()
  create(@Body() dto: CreateInvoiceDto, @CurrentUser() user: RequestUser) {
    return this.invoicesService.create(dto, user.id);
  }

  // POST /api/invoices/from-service-job/:serviceJobId
  @Post('from-service-job/:serviceJobId')
  createFromServiceJob(
    @Param('serviceJobId') serviceJobId: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.invoicesService.createFromServiceJob(serviceJobId, user.id);
  }

  // GET /api/invoices
  @Get()
  findAll(@Query() query: QueryInvoiceDto) {
    return this.invoicesService.findAll(query);
  }

  // GET /api/invoices/:id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const invoice = await this.invoicesService.findOne(id);
    return { success: true, data: invoice };
  }

  // PATCH /api/invoices/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateInvoiceDto) {
    return this.invoicesService.update(id, dto);
  }

  // PATCH /api/invoices/:id/cancel
  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @Body() dto: CancelInvoiceDto) {
    return this.invoicesService.cancel(id, dto);
  }

  // DELETE /api/invoices/:id  (soft delete)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invoicesService.remove(id);
  }
}
