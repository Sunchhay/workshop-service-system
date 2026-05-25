import type { ApiPaginatedResponse, ApiResponse } from '@/lib/api/types';

export type CustomerType = 'NORMAL' | 'VIP' | 'WHOLESALE' | 'PARTNER';

export interface Customer {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  customerType: CustomerType;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerRequest {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  customerType?: CustomerType;
  notes?: string;
}

export interface UpdateCustomerRequest {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  customerType?: CustomerType;
  notes?: string;
}

export interface CustomerQuery {
  search?: string;
  customerType?: CustomerType;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export type GetCustomersResponse = ApiPaginatedResponse<Customer>;
export type GetCustomerResponse = ApiResponse<Customer>;
