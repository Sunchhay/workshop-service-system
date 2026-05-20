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

import { MachineModelsService } from './machine-models.service';
import { CreateMachineModelDto } from './dto/create-machine-model.dto';
import { QueryMachineModelDto } from './dto/query-machine-model.dto';
import {
  UpdateMachineModelDto,
  UpdateMachineModelStatusDto,
} from './dto/update-machine-model.dto';

@Controller('machine-models')
export class MachineModelsController {
  constructor(private readonly machineModelsService: MachineModelsService) {}

  // POST /api/machine-models
  @Post()
  create(@Body() dto: CreateMachineModelDto) {
    return this.machineModelsService.create(dto);
  }

  // GET /api/machine-models?search=honda&category=Engine&isActive=true&page=1&limit=20
  @Get()
  findAll(@Query() query: QueryMachineModelDto) {
    return this.machineModelsService.findAll(query);
  }

  // GET /api/machine-models/:id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const machineModel = await this.machineModelsService.findOne(id);
    return { success: true, data: machineModel };
  }

  // PATCH /api/machine-models/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMachineModelDto) {
    return this.machineModelsService.update(id, dto);
  }

  // PATCH /api/machine-models/:id/status
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateMachineModelStatusDto,
  ) {
    return this.machineModelsService.updateStatus(id, dto);
  }

  // DELETE /api/machine-models/:id  (soft delete)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.machineModelsService.remove(id);
  }
}
