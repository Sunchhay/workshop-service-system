import type { ApiPaginatedResponse, ApiResponse } from '@/lib/api/types';

export type SupplierStatus = 'ACTIVE' | 'INACTIVE';

export interface Supplier {
  id: string;
  name: string;
  phone?: string | null;
  imageUrl?: string | null;
  note?: string | null;
  status: SupplierStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierRequest {
  name: string;
  phone?: string;
  imageUrl?: string;
  note?: string;
  status?: SupplierStatus;
}

export interface UpdateSupplierRequest {
  name?: string;
  phone?: string;
  imageUrl?: string | null;
  note?: string;
  status?: SupplierStatus;
}

export interface UpdateSupplierStatusRequest {
  status: SupplierStatus;
}

export interface SupplierQuery {
  search?: string;
  status?: SupplierStatus;
  page?: number;
  limit?: number;
}

export type GetSuppliersResponse = ApiPaginatedResponse<Supplier>;
export type GetSupplierResponse = ApiResponse<Supplier>;
