import type { ApiPaginatedResponse, ApiResponse } from '@/lib/api/types';

export interface ProductSupplierPriceProduct {
  id: string;
  code: string;
  name: string;
  nameEn?: string | null;
  category?: string | null;
  unit?: string | null;
}

export interface ProductSupplierPriceSupplier {
  id: string;
  name: string;
  phone?: string | null;
}

export interface ProductSupplierPrice {
  id: string;
  productId: string;
  supplierId: string;
  buyingPrice: string | number;
  currency: string;
  lastUpdatedAt?: string | null;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
  product: ProductSupplierPriceProduct;
  supplier: ProductSupplierPriceSupplier;
}

export interface CreateProductSupplierPriceRequest {
  productId: string;
  supplierId: string;
  buyingPrice: number;
  currency?: string;
  lastUpdatedAt?: string;
  note?: string;
}

export interface UpdateProductSupplierPriceRequest {
  productId?: string;
  supplierId?: string;
  buyingPrice?: number;
  currency?: string;
  lastUpdatedAt?: string;
  note?: string;
}

export interface ProductSupplierPriceQuery {
  search?: string;
  productId?: string;
  supplierId?: string;
  currency?: string;
  page?: number;
  limit?: number;
}

export type GetProductSupplierPricesResponse = ApiPaginatedResponse<ProductSupplierPrice>;
export type GetProductSupplierPriceResponse = ApiResponse<ProductSupplierPrice>;
