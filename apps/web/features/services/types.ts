import type { ApiPaginatedResponse, ApiResponse } from '@/lib/api/types';

export interface Service {
  id: string;
  code: string;
  nameEn: string;
  nameKh: string | null;
  imageUrl: string | null;
  category: string | null;
  relatedComponent: string | null;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateServiceRequest {
  code?: string;
  nameEn: string;
  nameKh?: string;
  imageUrl?: string;
  category?: string;
  relatedComponent?: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateServiceRequest {
  code?: string;
  nameEn?: string;
  nameKh?: string;
  imageUrl?: string;
  category?: string;
  relatedComponent?: string;
  description?: string;
  isActive?: boolean;
}

export interface ServiceQuery {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export type GetServicesResponse = ApiPaginatedResponse<Service>;
export type GetServiceResponse = ApiResponse<Service>;
