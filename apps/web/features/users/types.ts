import type { ApiPaginatedResponse, ApiResponse } from '@/lib/api/types';

export type UserRole = 'ADMIN' | 'STAFF' | 'TECHNICIAN' | 'CASHIER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

export interface UserQuery {
  role?: UserRole;
  search?: string;
  page?: number;
  limit?: number;
}

export type GetUsersResponse = ApiPaginatedResponse<User>;
export type GetUserResponse = ApiResponse<User>;
