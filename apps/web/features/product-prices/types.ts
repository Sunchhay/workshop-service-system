import type { ApiPaginatedResponse, ApiResponse } from '@/lib/api/types';

export type RecordStatus = 'ACTIVE' | 'INACTIVE';
export type CustomerType = 'OWNER' | 'MECHANIC';

export interface ProductPriceProduct {
  id: string;
  code: string;
  name: string;
  nameEn?: string | null;
  category?: string | null;
  unit?: string | null;
}

export interface ProductPriceMachineModel {
  id: string;
  code: string;
  brand?: string | null;
  modelName: string;
  machineType?: string | null;
  imageUrl?: string | null;
}

export interface ProductPrice {
  id: string;
  productId: string;
  machineModelId: string;
  imageUrl?: string | null;
  ownerPrice?: string | null;
  mechanicPrice?: string | null;
  note?: string | null;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
  product: ProductPriceProduct;
  machineModel: ProductPriceMachineModel;
}

export interface CreateProductPriceRequest {
  productId: string;
  machineModelId: string;
  imageUrl?: string;
  ownerPrice?: number;
  mechanicPrice?: number;
  note?: string;
  status?: RecordStatus;
}

export interface UpdateProductPriceRequest {
  productId?: string;
  machineModelId?: string;
  imageUrl?: string;
  ownerPrice?: number;
  mechanicPrice?: number;
  note?: string;
  status?: RecordStatus;
}

export interface UpdateProductPriceStatusRequest {
  status: RecordStatus;
}

export interface ProductPriceQuery {
  search?: string;
  productId?: string;
  machineModelId?: string;
  status?: RecordStatus;
  category?: string;
  machineType?: string;
  page?: number;
  limit?: number;
}

export interface SuggestProductPriceQuery {
  productId: string;
  machineModelId: string;
  customerType: CustomerType;
}

export interface SuggestProductPriceResult {
  productPriceId: string;
  productId: string;
  machineModelId: string;
  customerType: CustomerType;
  suggestedPrice: number | null;
  priceSource:
    | 'OWNER_PRICE'
    | 'MECHANIC_PRICE'
    | 'FALLBACK_OWNER_PRICE'
    | 'FALLBACK_MECHANIC_PRICE'
    | null;
  productName: string;
  machineModelName: string;
  imageUrl?: string | null;
}

export type GetProductPricesResponse = ApiPaginatedResponse<ProductPrice>;
export type GetProductPriceResponse = ApiResponse<ProductPrice>;
export type GetSuggestProductPriceResponse = ApiResponse<SuggestProductPriceResult>;
