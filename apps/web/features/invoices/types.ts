import type { ApiPaginatedResponse, ApiResponse } from '@/lib/api/types';

export type InvoiceStatus = 'DRAFT' | 'ISSUED' | 'PARTIAL' | 'PAID' | 'CANCELLED';
export type ItemType = 'SERVICE' | 'PRODUCT' | 'CUSTOM';

export interface InvoiceCustomer {
  id: string;
  code: string;
  name: string;
  phone: string | null;
}

export interface InvoiceServiceJob {
  id: string;
  jobCode: string;
  partDescription: string;
}

export interface InvoiceCreatedBy {
  id: string;
  name: string;
}

export interface InvoiceItemService {
  id: string;
  code: string;
  nameEn: string;
}

export interface InvoiceItemProduct {
  id: string;
  code: string;
  name: string;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  type: ItemType;
  serviceId: string | null;
  productId: string | null;
  description: string;
  quantity: string; // Decimal → string
  unitPrice: string;
  discountAmount: string;
  totalPrice: string;
  createdAt: string;
  updatedAt: string;
  service: InvoiceItemService | null;
  product: InvoiceItemProduct | null;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  serviceJobId: string | null;
  saleId: string | null;
  status: InvoiceStatus;
  subtotal: string;
  discountAmount: string;
  taxAmount: string;
  totalAmount: string;
  paidAmount: string;
  dueAmount: string;
  notes: string | null;
  issuedAt: string;
  dueDate: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  customer: InvoiceCustomer;
  serviceJob: InvoiceServiceJob | null;
  createdBy: InvoiceCreatedBy;
  items: InvoiceItem[];
}

export interface CreateInvoiceItemRequest {
  type?: ItemType;
  serviceId?: string;
  productId?: string;
  description: string;
  quantity?: number;
  unitPrice: number;
  discountAmount?: number;
}

export interface CreateInvoiceRequest {
  customerId: string;
  serviceJobId?: string;
  discountAmount?: number;
  taxAmount?: number;
  notes?: string;
  dueDate?: string;
  items: CreateInvoiceItemRequest[];
}

export interface UpdateInvoiceRequest {
  customerId?: string;
  serviceJobId?: string;
  discountAmount?: number;
  taxAmount?: number;
  notes?: string;
  dueDate?: string;
  status?: InvoiceStatus;
  items?: CreateInvoiceItemRequest[];
}

export interface InvoiceQuery {
  search?: string;
  status?: InvoiceStatus;
  customerId?: string;
  serviceJobId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export type GetInvoicesResponse = ApiPaginatedResponse<Invoice>;
export type GetInvoiceResponse = ApiResponse<Invoice>;
