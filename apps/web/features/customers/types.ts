import type { ApiPaginatedResponse, ApiResponse } from '@/lib/api/types';

export type CustomerType = 'OWNER' | 'MECHANIC';
export type RecordStatus = 'ACTIVE' | 'INACTIVE';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  imageUrl?: string | null;
  note?: string | null;
  customerType: CustomerType;
  lastPurchasedAt?: string | null;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerRequest {
  name: string;
  phone: string;
  imageUrl?: string;
  note?: string;
  customerType?: CustomerType;
  status?: RecordStatus;
}

export interface UpdateCustomerRequest {
  name?: string;
  phone?: string;
  imageUrl?: string;
  note?: string;
  customerType?: CustomerType;
  status?: RecordStatus;
}

export interface UpdateCustomerStatusRequest {
  status: RecordStatus;
}

export interface CustomerQuery {
  search?: string;
  customerType?: CustomerType;
  status?: RecordStatus;
  page?: number;
  limit?: number;
}

export type GetCustomersResponse = ApiPaginatedResponse<Customer>;
export type GetCustomerResponse = ApiResponse<Customer>;
