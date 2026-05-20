import { Injectable } from '@nestjs/common';

import { UserRole } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { QueryUserDto } from './dto/query-user.dto';

// Applied to every query — password is never returned
const USER_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  isActive: true,
  avatarUrl: true,
  createdAt: true,
  updatedAt: true,
} as const;

type CreateData = {
  email: string;
  password: string;
  name: string;
  role: UserRole;
};

type UpdateData = {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
};

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateData) {
    return this.prisma.user.create({
      data,
      select: USER_SELECT,
    });
  }

  async findAll(dto: QueryUserDto, excludeId?: string) {
    const { role, search, page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    const where = {
      ...(excludeId !== undefined && { id: { not: excludeId } }),
      ...(role !== undefined && { role }),
      ...(search !== undefined && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: USER_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { data, total };
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: USER_SELECT,
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: USER_SELECT,
    });
  }

  update(id: string, data: UpdateData) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: USER_SELECT,
    });
  }

  updateStatus(id: string, isActive: boolean) {
    return this.prisma.user.update({
      where: { id },
      data: { isActive },
      select: USER_SELECT,
    });
  }
}
