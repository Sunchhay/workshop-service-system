import { Injectable } from '@nestjs/common';

import { RecordStatus, UserRole } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import type { QueryUserDto } from './dto/query-user.dto';

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  imageUrl: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

type CreateData = {
  name: string;
  email: string;
  passwordHash: string;
  imageUrl?: string;
  role?: UserRole;
  status?: RecordStatus;
};

type UpdateData = {
  name?: string;
  email?: string;
  imageUrl?: string;
  role?: UserRole;
  status?: RecordStatus;
};

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateData) {
    return this.prisma.user.create({ data, select: USER_SELECT });
  }

  async findAll(dto: QueryUserDto, excludeId?: string) {
    const { role, status, search, page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    const where = {
      ...(excludeId !== undefined && { id: { not: excludeId } }),
      ...(role !== undefined && { role }),
      ...(status !== undefined && { status }),
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
    return this.prisma.user.findUnique({ where: { id }, select: USER_SELECT });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email }, select: USER_SELECT });
  }

  update(id: string, data: UpdateData) {
    return this.prisma.user.update({ where: { id }, data, select: USER_SELECT });
  }

  updateStatus(id: string, status: RecordStatus) {
    return this.prisma.user.update({ where: { id }, data: { status }, select: USER_SELECT });
  }

  deactivate(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { status: RecordStatus.INACTIVE },
      select: USER_SELECT,
    });
  }
}
