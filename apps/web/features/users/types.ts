import type { ApiPaginatedResponse, ApiResponse } from '@/lib/api/types';

export type UserRole = 'ADMIN' | 'STAFF' | 'VIEWER';
export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface User {
  id: string;
  name: string;
  email: string;
  imageUrl?: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  imageUrl?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  imageUrl?: string | null;
  role?: UserRole;
  status?: UserStatus;
}

export interface UpdateUserStatusRequest {
  status: UserStatus;
}

export interface UserQuery {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  page?: number;
  limit?: number;
}

export type GetUsersResponse = ApiPaginatedResponse<User>;
export type GetUserResponse = ApiResponse<User>;
