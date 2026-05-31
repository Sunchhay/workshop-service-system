import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { createPaginatedResponse, createResponse } from '../../common/types/api-response.type';
import type { CreateUserDto } from './dto/create-user.dto';
import type { QueryUserDto } from './dto/query-user.dto';
import type { UpdateUserDto, UpdateUserStatusDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

const BCRYPT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(dto: CreateUserDto) {
    const existing = await this.usersRepository.findByEmail(dto.email);
    if (existing) throw new BadRequestException('Email is already in use');

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    const user = await this.usersRepository.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      imageUrl: dto.imageUrl,
      role: dto.role,
      status: dto.status,
    });
    return createResponse(user, 'User created');
  }

  async findAll(dto: QueryUserDto, currentUserId: string) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const { data, total } = await this.usersRepository.findAll(dto, currentUserId);
    return createPaginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return createResponse(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');

    if (dto.email) {
      const existing = await this.usersRepository.findByEmail(dto.email);
      if (existing && existing.id !== id) throw new BadRequestException('Email is already in use');
    }

    const updated = await this.usersRepository.update(id, {
      name: dto.name,
      email: dto.email,
      imageUrl: dto.imageUrl,
      role: dto.role,
      status: dto.status,
    });
    return createResponse(updated, 'User updated');
  }

  async updateStatus(id: string, dto: UpdateUserStatusDto, currentUserId: string) {
    if (id === currentUserId) throw new ForbiddenException('You cannot change your own status');

    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');

    const updated = await this.usersRepository.updateStatus(id, dto.status);
    return createResponse(updated, 'User status updated');
  }

  async remove(id: string, currentUserId: string) {
    if (id === currentUserId) throw new ForbiddenException('You cannot deactivate your own account');

    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');

    await this.usersRepository.deactivate(id);
    return createResponse(null, 'User deactivated');
  }
}
