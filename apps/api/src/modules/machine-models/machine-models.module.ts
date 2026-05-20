import { Module } from '@nestjs/common';

import { MachineModelsController } from './machine-models.controller';
import { MachineModelsRepository } from './machine-models.repository';
import { MachineModelsService } from './machine-models.service';

@Module({
  controllers: [MachineModelsController],
  providers: [MachineModelsService, MachineModelsRepository],
  exports: [MachineModelsService],
})
export class MachineModelsModule {}
