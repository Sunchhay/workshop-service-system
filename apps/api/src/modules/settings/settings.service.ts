import { Injectable, NotFoundException } from '@nestjs/common';
import { createPaginatedResponse, createResponse } from '../../common/types/api-response.type';
import type { QuerySettingDto } from './dto/query-setting.dto';
import type { UpdateSettingDto } from './dto/update-setting.dto';
import type { UpdateSettingsGroupDto } from './dto/update-settings-group.dto';
import { SettingsRepository } from './settings.repository';

@Injectable()
export class SettingsService {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  async findAll(dto: QuerySettingDto) {
    const { page = 1, limit = 100 } = dto;
    const { data, total } = await this.settingsRepository.findAll(dto);
    return createPaginatedResponse(data, total, page, limit);
  }

  async findByKey(key: string) {
    const data = await this.settingsRepository.findByKey(key);
    if (!data) throw new NotFoundException(`Setting with key "${key}" not found`);
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
    const data = await this.settingsRepository.updateByKey(key, dto);
    return createResponse(data);
  }

  async updateGroup(group: string, dto: UpdateSettingsGroupDto) {
    const data = await this.settingsRepository.bulkUpdate(dto.settings, group);
    return createResponse(data);
  }
}
