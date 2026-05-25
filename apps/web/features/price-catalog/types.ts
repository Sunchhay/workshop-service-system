import type { ApiPaginatedResponse, ApiResponse } from '@/lib/api/types';

export type DifficultyLevel = 'NORMAL' | 'DIFFICULT' | 'SPECIAL';
export type CustomerType = 'NORMAL' | 'VIP' | 'WHOLESALE' | 'PARTNER';

export interface PriceCatalogService {
  id: string;
  nameEn: string;
  code: string;
}

export interface PriceCatalog {
  id: string;
  serviceId: string;
  service: PriceCatalogService;
  label: string;
  sizeFrom: string | null; // Prisma Decimal → string
  sizeTo: string | null;
  unit: string | null;
  difficultyLevel: DifficultyLevel;
  customerType: CustomerType | null;
  unitPrice: string; // Decimal → string
  currency: string;
  notes: string | null;
  effectiveDate: string;
  expiredDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePriceCatalogRequest {
  serviceId: string;
  label: string;
  sizeFrom?: number;
  sizeTo?: number;
  unit?: string;
  difficultyLevel?: DifficultyLevel;
  customerType?: CustomerType | null;
  unitPrice: number;
  currency?: string;
  notes?: string;
  effectiveDate?: string;
  expiredDate?: string | null;
}

export interface UpdatePriceCatalogRequest {
  serviceId?: string;
  label?: string;
  sizeFrom?: number;
  sizeTo?: number;
  unit?: string;
  difficultyLevel?: DifficultyLevel;
  customerType?: CustomerType | null;
  unitPrice?: number;
  currency?: string;
  notes?: string;
  effectiveDate?: string;
  expiredDate?: string | null;
}

export interface PriceCatalogQuery {
  search?: string;
  serviceId?: string;
  difficultyLevel?: DifficultyLevel;
  customerType?: CustomerType;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface PriceCatalogSuggestQuery {
  serviceId: string;
  size?: number;
  difficultyLevel?: DifficultyLevel;
  customerType?: CustomerType;
}

export type GetPriceCatalogsResponse = ApiPaginatedResponse<PriceCatalog>;
export type GetPriceCatalogResponse = ApiResponse<PriceCatalog>;
export type GetPriceCatalogSuggestResponse = ApiResponse<PriceCatalog[]>;
