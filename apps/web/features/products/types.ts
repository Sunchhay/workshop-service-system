import type { ApiPaginatedResponse, ApiResponse } from '@/lib/api/types';

export type RecordStatus = 'ACTIVE' | 'INACTIVE';

export interface Product {
  id: string;
  code: string;
  name: string;
  nameEn?: string | null;
  category?: string | null;
  unit?: string | null;
  description?: string | null;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  code: string;
  name: string;
  nameEn?: string;
  category?: string;
  unit?: string;
  description?: string;
  status?: RecordStatus;
}

export interface UpdateProductRequest {
  code?: string;
  name?: string;
  nameEn?: string;
  category?: string;
  unit?: string;
  description?: string;
  status?: RecordStatus;
}

export interface UpdateProductStatusRequest {
  status: RecordStatus;
}

export interface ProductQuery {
  search?: string;
  status?: RecordStatus;
  category?: string;
  unit?: string;
  page?: number;
  limit?: number;
}

export type GetProductsResponse = ApiPaginatedResponse<Product>;
export type GetProductResponse = ApiResponse<Product>;
