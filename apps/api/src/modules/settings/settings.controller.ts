import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../generated/prisma/enums';
import { QuerySettingDto } from './dto/query-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { UpdateSettingsGroupDto } from './dto/update-settings-group.dto';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // GET /api/settings
  @Get()
  getAll(@Query() dto: QuerySettingDto) {
    return this.settingsService.findAll(dto);
  }

  // GET /api/settings/public  — no auth required
  @Public()
  @Get('public')
  getPublic() {
    return this.settingsService.findPublic();
  }

  // GET /api/settings/group/:group
  @Get('group/:group')
  getGroup(@Param('group') group: string) {
    return this.settingsService.findByGroup(group);
  }

  // PATCH /api/settings/group/:group  — ADMIN only
  @Roles(UserRole.ADMIN)
  @Patch('group/:group')
  updateGroup(
    @Param('group') group: string,
    @Body() dto: UpdateSettingsGroupDto,
  ) {
    return this.settingsService.updateGroup(group, dto);
  }

  // PATCH /api/settings/:key  — ADMIN only
  @Roles(UserRole.ADMIN)
  @Patch(':key')
  updateOne(@Param('key') key: string, @Body() dto: UpdateSettingDto) {
    return this.settingsService.updateOne(key, dto);
  }
}
