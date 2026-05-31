import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

const USER_SAFE_SELECT = {
  id: true,
  name: true,
  email: true,
  imageUrl: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmailWithPassword(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
        role: true,
        status: true,
        passwordHash: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id }, select: USER_SAFE_SELECT });
  }

  findByIdWithPassword(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, passwordHash: true },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email }, select: USER_SAFE_SELECT });
  }

  update(
    id: string,
    data: { name?: string; email?: string; passwordHash?: string; imageUrl?: string | null },
  ) {
    return this.prisma.user.update({ where: { id }, data, select: USER_SAFE_SELECT });
  }
}
