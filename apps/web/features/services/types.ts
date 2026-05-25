import type { ApiPaginatedResponse, ApiResponse } from '@/lib/api/types';

export type PriceType = 'FIXED' | 'CATALOG_BASED' | 'CUSTOM';

export interface Service {
  id: string;
  code: string;
  nameEn: string;
  nameKh: string | null;
  category: string | null;
  relatedComponent: string | null;
  defaultPrice: string | null; // Prisma Decimal serializes to string
  priceType: PriceType;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceRequest {
  nameEn: string;
  nameKh?: string;
  category?: string;
  relatedComponent?: string;
  priceType: PriceType;
  defaultPrice?: number;
  description?: string;
}

export interface UpdateServiceRequest {
  nameEn?: string;
  nameKh?: string;
  category?: string;
  relatedComponent?: string;
  priceType?: PriceType;
  defaultPrice?: number;
  description?: string;
}

export interface ServiceQuery {
  search?: string;
  priceType?: PriceType;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export type GetServicesResponse = ApiPaginatedResponse<Service>;
export type GetServiceResponse = ApiResponse<Service>;
