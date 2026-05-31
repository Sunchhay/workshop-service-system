import type { ApiPaginatedResponse, ApiResponse } from '@/lib/api/types';

// New payment method enum (replaces old BANK_TRANSFER/CARD)
export type PaymentMethod = 'CASH' | 'ACLEDA' | 'ABA' | 'BAKONG' | 'OTHER';

// Sale-linked payment (new API)
export interface Payment {
  id: string;
  saleId: string;
  paymentMethod: PaymentMethod;
  amount: string | number;
  referenceNo?: string | null;
  note?: string | null;
  paidAt: string;
  createdAt: string;
  sale?: { id: string; invoiceNo: string } | null;
}

export interface AddPaymentRequest {
  paymentMethod: PaymentMethod;
  amount: number;
  referenceNo?: string;
  note?: string;
  paidAt?: string;
}

export interface PaymentQuery {
  paymentMethod?: PaymentMethod;
  saleId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

// Legacy invoice payment types (for InvoiceDetailPage backward compat)
export interface InvoicePayment {
  id: string;
  paymentNumber: string;
  invoiceId: string;
  customerId: string;
  amount: string;
  method: PaymentMethod;
  referenceNo: string | null;
  notes: string | null;
  paidAt: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  invoice: {
    id: string;
    invoiceNumber: string;
    totalAmount: string;
    paidAmount: string;
    dueAmount: string;
    status: string;
  };
  customer: { id: string; code: string; name: string; phone: string | null };
  createdBy: { id: string; name: string };
}

export interface CreatePaymentRequest {
  invoiceId: string;
  customerId: string;
  amount: number;
  method: PaymentMethod;
  referenceNo?: string;
  notes?: string;
  paidAt?: string;
}

export type GetPaymentsResponse = ApiPaginatedResponse<Payment>;
export type GetPaymentResponse = ApiResponse<Payment>;
export type GetInvoicePaymentListResponse = ApiResponse<InvoicePayment[]>;
export type GetInvoicePaymentResponse = ApiResponse<InvoicePayment>;
