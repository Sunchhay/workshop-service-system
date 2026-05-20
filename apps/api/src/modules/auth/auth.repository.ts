import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

// Safe select — password never included
const USER_SAFE_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  isActive: true,
  avatarUrl: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Only called during login — the only place we need the password hash
  findByEmailWithPassword(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        role: true,
        isActive: true,
      },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: USER_SAFE_SELECT,
    });
  }

  findByIdWithPassword(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, password: true },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: USER_SAFE_SELECT,
    });
  }

  update(id: string, data: { name?: string; email?: string; password?: string; avatarUrl?: string | null }) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: USER_SAFE_SELECT,
    });
  }
}
