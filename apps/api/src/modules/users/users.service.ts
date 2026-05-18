import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { createPaginatedResponse } from '../../common/types/api-response.type';
import { UserRole } from '../../generated/prisma/client';
import type { CreateUserDto } from './dto/create-user.dto';
import type { QueryUserDto } from './dto/query-user.dto';
import type {
  UpdateUserDto,
  UpdateUserStatusDto,
} from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

const BCRYPT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(dto: CreateUserDto) {
    const existing = await this.usersRepository.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException('Email is already in use');
    }

    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    return this.usersRepository.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
      role: dto.role,
    });
  }

  async findAll(dto: QueryUserDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const { data, total } = await this.usersRepository.findAll(dto);
    return createPaginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);

    if (dto.email) {
      const existing = await this.usersRepository.findByEmail(dto.email);
      if (existing && existing.id !== id) {
        throw new BadRequestException('Email is already in use');
      }
    }

    const updateData: {
      name?: string;
      email?: string;
      role?: UserRole;
      password?: string;
    } = {};

    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.email !== undefined) updateData.email = dto.email;
    if (dto.role !== undefined) updateData.role = dto.role;
    if (dto.password !== undefined) {
      updateData.password = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    }

    return this.usersRepository.update(id, updateData);
  }

  async updateStatus(id: string, dto: UpdateUserStatusDto) {
    await this.findOne(id);
    return this.usersRepository.updateStatus(id, dto.isActive);
  }
}
