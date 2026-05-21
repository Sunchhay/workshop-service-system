import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { QuerySettingDto } from './dto/query-setting.dto';

@Injectable()
export class SettingsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(dto: QuerySettingDto) {
    return this.prisma.setting.findMany({
      where: {
        ...(dto.group ? { group: dto.group } : {}),
        ...(dto.isPublic !== undefined ? { isPublic: dto.isPublic } : {}),
      },
      orderBy: [{ group: 'asc' }, { key: 'asc' }],
    });
  }

  async findByGroup(group: string): Promise<Record<string, string | null>> {
    const rows = await this.prisma.setting.findMany({
      where: { group },
      orderBy: { key: 'asc' },
    });
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  }

  async findPublic(): Promise<Record<string, string | null>> {
    const rows = await this.prisma.setting.findMany({
      where: { isPublic: true },
      orderBy: { key: 'asc' },
    });
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  }

  async upsertOne(key: string, value: string | null) {
    return this.prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value, group: key.split('.')[0] ?? 'general' },
    });
  }

  async upsertGroup(
    group: string,
    settings: Record<string, string | null>,
  ): Promise<Record<string, string | null>> {
    await Promise.all(
      Object.entries(settings).map(([key, value]) =>
        this.prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value, group },
        }),
      ),
    );
    return this.findByGroup(group);
  }
}
