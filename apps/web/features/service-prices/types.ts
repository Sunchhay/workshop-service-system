import type { ApiPaginatedResponse, ApiResponse } from "@/lib/api/types";

export type RecordStatus = "ACTIVE" | "INACTIVE";
export type CustomerType = "OWNER" | "MECHANIC";

export interface ServicePriceService {
  id: string;
  code: string;
  name: string;
  nameEn: string;
  category?: string | null;
}

export interface ServicePriceMachineModel {
  id: string;
  code: string;
  brand?: string | null;
  modelName: string;
  machineType?: string | null;
  imageUrl?: string | null;
}

export interface ServicePrice {
  id: string;
  serviceId: string;
  machineModelId: string;
  ownerPrice?: string | null;
  mechanicPrice?: string | null;
  note?: string | null;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
  service: ServicePriceService;
  machineModel: ServicePriceMachineModel;
}

export interface CreateServicePriceRequest {
  serviceId: string;
  machineModelId: string;
  ownerPrice?: number;
  mechanicPrice?: number;
  note?: string;
  status?: RecordStatus;
}

export interface UpdateServicePriceRequest {
  serviceId?: string;
  machineModelId?: string;
  ownerPrice?: number;
  mechanicPrice?: number;
  note?: string;
  status?: RecordStatus;
}

export interface UpdateServicePriceStatusRequest {
  status: RecordStatus;
}

export interface ServicePriceQuery {
  search?: string;
  serviceId?: string;
  machineModelId?: string;
  status?: RecordStatus;
  category?: string;
  machineType?: string;
  page?: number;
  limit?: number;
}

export interface SuggestServicePriceQuery {
  serviceId: string;
  machineModelId: string;
  customerType: CustomerType;
}

export interface SuggestServicePriceResult {
  servicePriceId: string;
  serviceId: string;
  machineModelId: string;
  customerType: CustomerType;
  suggestedPrice: number | null;
  priceSource:
    | "OWNER_PRICE"
    | "MECHANIC_PRICE"
    | "FALLBACK_OWNER_PRICE"
    | "FALLBACK_MECHANIC_PRICE"
    | null;
  serviceName: string;
  machineModelName: string;
}

export type GetServicePricesResponse = ApiPaginatedResponse<ServicePrice>;
export type GetServicePriceResponse = ApiResponse<ServicePrice>;
export type GetSuggestServicePriceResponse =
  ApiResponse<SuggestServicePriceResult>;
