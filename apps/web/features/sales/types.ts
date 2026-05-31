import type { ApiPaginatedResponse, ApiResponse } from '@/lib/api/types';

export type PaymentStatus = 'PAID' | 'UNPAID' | 'PARTIAL';
export type SaleStatus = 'COMPLETED' | 'VOIDED';
export type CommissionStatus = 'NONE' | 'UNPAID' | 'PAID';
export type SaleItemType = 'SERVICE' | 'PRODUCT';
export type SalePaymentMethod = 'CASH' | 'ACLEDA' | 'ABA' | 'BAKONG' | 'OTHER';

export interface SaleItem {
  id: string;
  saleId: string;
  itemType: SaleItemType;
  serviceId?: string | null;
  productId?: string | null;
  machineModelId?: string | null;
  nameSnapshot: string;
  unitPrice: string | number;
  quantity: string | number;
  total: string | number;
  note?: string | null;
  createdAt: string;
}

export interface SalePayment {
  id: string;
  saleId: string;
  paymentMethod: SalePaymentMethod;
  amount: string | number;
  referenceNo?: string | null;
  note?: string | null;
  paidAt: string;
  createdAt: string;
}

export interface Sale {
  id: string;
  invoiceNo: string;
  customerId?: string | null;
  mechanicId?: string | null;
  createdById: string;
  subtotal: string | number;
  grandTotal: string | number;
  paidAmount: string | number;
  balanceAmount: string | number;
  commissionAmount: string | number;
  commissionNote?: string | null;
  commissionStatus: CommissionStatus;
  commissionPaidAt?: string | null;
  paymentStatus: PaymentStatus;
  saleStatus: SaleStatus;
  note?: string | null;
  voidReason?: string | null;
  voidedAt?: string | null;
  voidedById?: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: { id: string; name: string; phone: string; customerType: string } | null;
  mechanic?: { id: string; name: string; phone: string; customerType: string } | null;
  createdBy?: { id: string; name: string } | null;
  items?: SaleItem[];
  payments?: SalePayment[];
}

export interface AddSalePaymentRequest {
  paymentMethod: SalePaymentMethod;
  amount: number;
  referenceNo?: string;
  note?: string;
  paidAt?: string;
}

export interface SaleQuery {
  search?: string;
  paymentStatus?: PaymentStatus;
  saleStatus?: SaleStatus;
  customerId?: string;
  mechanicId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export type GetSalesResponse = ApiPaginatedResponse<Sale>;
export type GetSaleResponse = ApiResponse<Sale>;
