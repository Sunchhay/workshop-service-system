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
import { CreateServicePriceDto } from './dto/create-service-price.dto';
import {
  QueryServicePriceDto,
  SuggestServicePriceDto,
} from './dto/query-service-price.dto';
import {
  UpdateServicePriceDto,
  UpdateServicePriceStatusDto,
} from './dto/update-service-price.dto';
import { ServicePricesService } from './service-prices.service';

@Controller('service-prices')
@Roles(UserRole.ADMIN)
export class ServicePricesController {
  constructor(private readonly servicePricesService: ServicePricesService) {}

  // POST /api/service-prices
  @Post()
  create(@Body() dto: CreateServicePriceDto) {
    return this.servicePricesService.create(dto);
  }

  // GET /api/service-prices?search=&serviceId=&machineModelId=&status=ACTIVE&category=&machineType=&page=1&limit=20
  @Get()
  findAll(@Query() query: QueryServicePriceDto) {
    return this.servicePricesService.findAll(query);
  }

  // GET /api/service-prices/suggest?serviceId=xxx&machineModelId=xxx&customerType=OWNER — MUST be before /:id
  @Get('suggest')
  suggest(@Query() query: SuggestServicePriceDto) {
    return this.servicePricesService.suggest(query);
  }

  // GET /api/service-prices/:id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const servicePrice = await this.servicePricesService.findOne(id);
    return { success: true, data: servicePrice };
  }

  // PATCH /api/service-prices/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateServicePriceDto) {
    return this.servicePricesService.update(id, dto);
  }

  // PATCH /api/service-prices/:id/status
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateServicePriceStatusDto,
  ) {
    return this.servicePricesService.updateStatus(id, dto);
  }

  // DELETE /api/service-prices/:id (deactivates)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicePricesService.remove(id);
  }
}
