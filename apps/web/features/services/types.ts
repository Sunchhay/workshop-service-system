import type { ApiPaginatedResponse, ApiResponse } from '@/lib/api/types';

export type RecordStatus = 'ACTIVE' | 'INACTIVE';

export interface Service {
  id: string;
  code: string;
  name: string;
  nameEn: string;
  category?: string | null;
  description?: string | null;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceRequest {
  code: string;
  name: string;
  nameEn: string;
  category?: string;
  description?: string;
  status?: RecordStatus;
}

export interface UpdateServiceRequest {
  code?: string;
  name?: string;
  nameEn?: string;
  category?: string;
  description?: string;
  status?: RecordStatus;
}

export interface UpdateServiceStatusRequest {
  status: RecordStatus;
}

export interface ServiceQuery {
  search?: string;
  status?: RecordStatus;
  category?: string;
  page?: number;
  limit?: number;
}

export type GetServicesResponse = ApiPaginatedResponse<Service>;
export type GetServiceResponse = ApiResponse<Service>;
