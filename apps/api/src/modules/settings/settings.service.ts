import { Injectable } from '@nestjs/common';
import { createResponse } from '../../common/types/api-response.type';
import type { QuerySettingDto } from './dto/query-setting.dto';
import type { UpdateSettingDto } from './dto/update-setting.dto';
import type { UpdateSettingsGroupDto } from './dto/update-settings-group.dto';
import { SettingsRepository } from './settings.repository';

@Injectable()
export class SettingsService {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  async findAll(dto: QuerySettingDto) {
    const data = await this.settingsRepository.findAll(dto);
    return createResponse(data);
  }

  async findByGroup(group: string) {
    const data = await this.settingsRepository.findByGroup(group);
    return createResponse(data);
  }

  async findPublic() {
    const data = await this.settingsRepository.findPublic();
    return createResponse(data);
  }

  async updateOne(key: string, dto: UpdateSettingDto) {
    const data = await this.settingsRepository.upsertOne(key, dto.value ?? null);
    return createResponse(data);
  }

  async updateGroup(group: string, dto: UpdateSettingsGroupDto) {
    const data = await this.settingsRepository.upsertGroup(group, dto.settings);
    return createResponse(data);
  }
}
