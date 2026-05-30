import type { ApiPaginatedResponse, ApiResponse } from "@/lib/api/types";

export interface PriceCatalogService {
  id: string;
  nameEn: string;
  nameKh: string | null;
  code: string;
}

export interface PriceCatalogMachineModel {
  id: string;
  brand: string;
  model: string;
  category: string | null;
}

export interface PriceCatalog {
  id: string;
  serviceId: string;
  service: PriceCatalogService;
  machineModelId: string;
  machineModel: PriceCatalogMachineModel;
  label: string;
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
  machineModelId: string;
  label: string;
  unitPrice: number;
  currency?: string;
  notes?: string;
  effectiveDate?: string;
  expiredDate?: string | null;
  isActive?: boolean;
}

export interface UpdatePriceCatalogRequest {
  serviceId?: string;
  machineModelId?: string;
  label?: string;
  unitPrice?: number;
  currency?: string;
  notes?: string;
  effectiveDate?: string;
  expiredDate?: string | null;
  isActive?: boolean;
}

export interface PriceCatalogQuery {
  search?: string;
  serviceId?: string;
  machineModelId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export type GetPriceCatalogsResponse = ApiPaginatedResponse<PriceCatalog>;
export type GetPriceCatalogResponse = ApiResponse<PriceCatalog>;
