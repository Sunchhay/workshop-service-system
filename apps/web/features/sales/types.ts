import type { ApiPaginatedResponse, ApiResponse } from '@/lib/api/types';

export type SaleStatus = 'DRAFT' | 'COMPLETED' | 'CANCELLED';

export interface SaleProduct {
  id: string;
  code: string;
  name: string;
  nameKh: string | null;
  nameEn: string | null;
  unit: string;
  stockQuantity: number;
}

export interface SaleItem {
  id: string;
  saleId: string;
  type: 'SERVICE' | 'PRODUCT' | 'CUSTOM';
  serviceId: string | null;
  productId: string | null;
  machineModelId: string | null;
  modelNameSnapshot: string | null;
  itemCode: string | null;
  itemNameKh: string | null;
  itemNameEn: string | null;
  description: string | null;
  quantity: string;
  unitPrice: string;
  discountAmount: string;
  totalPrice: string;
  createdAt: string;
  updatedAt: string;
  product: SaleProduct | null;
  service: { id: string; code: string; nameEn: string; nameKh: string | null } | null;
  machineModel: { id: string; brand: string; model: string; category: string | null } | null;
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

export interface SaleInvoicePayment {
  id: string;
  paymentNumber: string;
  amount: string;
  method: string;
  paidAt: string;
}

export interface SaleInvoice {
  id: string;
  invoiceNumber: string;
  status: string;
  totalAmount: string;
  paidAmount: string;
  dueAmount: string;
  issuedAt: string;
  payments: SaleInvoicePayment[];
}

export interface Sale {
  id: string;
  saleNumber: string;
  customerId: string | null;
  machineModelId: string | null;
  modelNameSnapshot: string | null;
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
  machineModel: { id: string; brand: string; model: string; category: string | null } | null;
  createdBy: SaleCreatedBy;
  items: SaleItem[];
  invoices: SaleInvoice[];
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
