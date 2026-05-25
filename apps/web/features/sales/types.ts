import type { ApiPaginatedResponse, ApiResponse } from '@/lib/api/types';

export type SaleStatus = 'DRAFT' | 'COMPLETED' | 'CANCELLED';

export interface SaleProduct {
  id: string;
  code: string;
  name: string;
  unit: string;
  stockQuantity: number;
}

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  description: string | null;
  quantity: string;
  unitPrice: string;
  discountAmount: string;
  totalPrice: string;
  createdAt: string;
  updatedAt: string;
  product: SaleProduct;
}

export interface SaleCustomer {
  id: string;
  code: string;
  name: string;
  phone: string | null;
}

export interface SaleCreatedBy {
  id: string;
  name: string;
}

export interface Sale {
  id: string;
  saleNumber: string;
  customerId: string | null;
  status: SaleStatus;
  subtotal: string;
  discountAmount: string;
  totalAmount: string;
  notes: string | null;
  soldAt: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  customer: SaleCustomer | null;
  createdBy: SaleCreatedBy;
  items: SaleItem[];
}

export interface CreateSaleItemRequest {
  productId: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  discountAmount?: number;
}

export interface CreateSaleRequest {
  customerId?: string;
  status?: SaleStatus;
  discountAmount?: number;
  notes?: string;
  soldAt?: string;
  items: CreateSaleItemRequest[];
}

export interface UpdateSaleRequest {
  customerId?: string;
  discountAmount?: number;
  notes?: string;
  soldAt?: string;
  items?: CreateSaleItemRequest[];
}

export interface SaleQuery {
  search?: string;
  status?: SaleStatus;
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export type GetSalesResponse = ApiPaginatedResponse<Sale>;
export type GetSaleResponse = ApiResponse<Sale>;
