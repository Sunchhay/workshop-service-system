import type { ApiPaginatedResponse, ApiResponse } from '@/lib/api/types';

export type InvoiceStatus = 'DRAFT' | 'ISSUED' | 'PARTIAL' | 'PAID' | 'CANCELLED';
export type ItemType = 'SERVICE' | 'PRODUCT' | 'CUSTOM';

export interface InvoiceCustomer {
  id: string;
  code: string;
  name: string;
  phone: string | null;
}

export interface InvoiceCreatedBy {
  id: string;
  name: string;
}

export interface InvoiceItemService {
  id: string;
  code: string;
  nameEn: string;
  nameKh: string | null;
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
  machineModelId: string | null;
  modelNameSnapshot: string | null;
  description: string;
  itemCode: string | null;
  itemNameKh: string | null;
  itemNameEn: string | null;
  quantity: string; // Decimal → string
  unitPrice: string;
  discountAmount: string;
  totalPrice: string;
  createdAt: string;
  updatedAt: string;
  service: InvoiceItemService | null;
  product: InvoiceItemProduct | null;
  machineModel: { id: string; brand: string; model: string; category: string | null } | null;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
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
  createdBy: InvoiceCreatedBy;
  items: InvoiceItem[];
}

export interface CreateInvoiceItemRequest {
  type?: ItemType;
  serviceId?: string;
  productId?: string;
  machineModelId?: string;
  modelNameSnapshot?: string;
  description: string;
  itemCode?: string;
  itemNameKh?: string;
  itemNameEn?: string;
  quantity?: number;
  unitPrice: number;
  discountAmount?: number;
}

export interface CreateInvoiceRequest {
  customerId: string;
  discountAmount?: number;
  taxAmount?: number;
  notes?: string;
  dueDate?: string;
  items: CreateInvoiceItemRequest[];
}

export interface UpdateInvoiceRequest {
  customerId?: string;
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
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export type GetInvoicesResponse = ApiPaginatedResponse<Invoice>;
export type GetInvoiceResponse = ApiResponse<Invoice>;
