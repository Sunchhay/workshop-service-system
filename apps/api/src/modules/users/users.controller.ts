import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { createResponse } from '../../common/types/api-response.type';
import type { RequestUser } from '../../common/types/jwt-payload.type';
import { UserRole } from '../../generated/prisma/enums';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto, UpdateUserStatusDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@Roles(UserRole.ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // POST /api/users
  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return createResponse(user, 'User created');
  }

  // GET /api/users?role=STAFF&search=john&page=1&limit=20
  @Get()
  findAll(@Query() query: QueryUserDto, @CurrentUser() currentUser: RequestUser) {
    return this.usersService.findAll(query, currentUser.id);
  }

  // GET /api/users/:id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return createResponse(user);
  }

  // PATCH /api/users/:id
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const user = await this.usersService.update(id, dto);
    return createResponse(user, 'User updated');
  }

  // PATCH /api/users/:id/status
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
    @CurrentUser() currentUser: RequestUser,
  ) {
    const user = await this.usersService.updateStatus(id, dto, currentUser.id);
    return createResponse(user, 'User status updated');
  }
}
