import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import type { QuerySettingDto } from './dto/query-setting.dto';
import type { UpdateSettingDto } from './dto/update-setting.dto';

const SETTING_SELECT = {
  id: true,
  key: true,
  value: true,
  type: true,
  group: true,
  description: true,
  isPublic: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class SettingsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(dto: QuerySettingDto) {
    const { search, group, isPublic, page = 1, limit = 100 } = dto;
    const skip = (page - 1) * limit;

    const where = {
      ...(group !== undefined && { group }),
      ...(isPublic !== undefined && { isPublic }),
      ...(search !== undefined && {
        OR: [
          { key: { contains: search, mode: 'insensitive' as const } },
          { group: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.setting.findMany({
        where,
        select: SETTING_SELECT,
        skip,
        take: limit,
        orderBy: [{ group: 'asc' }, { key: 'asc' }],
      }),
      this.prisma.setting.count({ where }),
    ]);

    return { data, total };
  }

  findByKey(key: string) {
    return this.prisma.setting.findUnique({ where: { key }, select: SETTING_SELECT });
  }

  async findByGroup(group: string) {
    return this.prisma.setting.findMany({
      where: { group },
      select: SETTING_SELECT,
      orderBy: { key: 'asc' },
    });
  }

  findPublic() {
    return this.prisma.setting.findMany({
      where: { isPublic: true },
      select: SETTING_SELECT,
      orderBy: [{ group: 'asc' }, { key: 'asc' }],
    });
  }

  updateByKey(key: string, dto: UpdateSettingDto) {
    return this.prisma.setting.upsert({
      where: { key },
      update: {
        ...(dto.value !== undefined && { value: dto.value }),
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.group !== undefined && { group: dto.group }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.isPublic !== undefined && { isPublic: dto.isPublic }),
      },
      create: {
        key,
        value: dto.value ?? null,
        type: dto.type ?? 'text',
        group: dto.group ?? key.split('_')[0] ?? 'general',
        description: dto.description,
        isPublic: dto.isPublic ?? false,
      },
      select: SETTING_SELECT,
    });
  }

  async bulkUpdate(settings: Record<string, string | null>, group?: string) {
    await Promise.all(
      Object.entries(settings).map(([key, value]) =>
        this.prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value, group: group ?? key.split('_')[0] ?? 'general' },
        }),
      ),
    );
    if (group) return this.findByGroup(group);
    return this.prisma.setting.findMany({
      where: { key: { in: Object.keys(settings) } },
      select: SETTING_SELECT,
      orderBy: { key: 'asc' },
    });
  }
}
