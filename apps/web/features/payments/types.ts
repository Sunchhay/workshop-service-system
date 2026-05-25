import type { ApiPaginatedResponse, ApiResponse } from '@/lib/api/types';

import type { InvoiceStatus } from '../invoices/types';

export type PaymentMethod = 'CASH' | 'ABA' | 'BANK_TRANSFER' | 'CARD' | 'OTHER';

export interface PaymentInvoice {
  id: string;
  invoiceNumber: string;
  totalAmount: string;
  paidAmount: string;
  dueAmount: string;
  status: InvoiceStatus;
}

export interface PaymentCustomer {
  id: string;
  code: string;
  name: string;
  phone: string | null;
}

export interface PaymentCreatedBy {
  id: string;
  name: string;
}

export interface Payment {
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
  invoice: PaymentInvoice;
  customer: PaymentCustomer;
  createdBy: PaymentCreatedBy;
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

export interface PaymentQuery {
  search?: string;
  method?: PaymentMethod;
  customerId?: string;
  invoiceId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export type GetPaymentsResponse = ApiPaginatedResponse<Payment>;
export type GetPaymentResponse = ApiResponse<Payment>;
export type GetPaymentListResponse = ApiResponse<Payment[]>;
