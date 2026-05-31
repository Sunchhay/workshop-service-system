import type { ApiPaginatedResponse, ApiResponse } from '@/lib/api/types';

export type CartStatus = 'ACTIVE' | 'CHECKED_OUT';
export type ItemType = 'SERVICE' | 'PRODUCT';
export type PaymentMethod = 'CASH' | 'ACLEDA' | 'ABA' | 'BAKONG' | 'OTHER';

export interface CartItem {
  id: string;
  cartId: string;
  itemType: ItemType;
  serviceId?: string | null;
  productId?: string | null;
  machineModelId?: string | null;
  nameSnapshot: string;
  unitPrice: string | number;
  quantity: string | number;
  total: string | number;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: string;
  customerId?: string | null;
  mechanicId?: string | null;
  createdById: string;
  commissionAmount: string | number;
  commissionNote?: string | null;
  status: CartStatus;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: { id: string; name: string; phone: string; customerType: string } | null;
  mechanic?: { id: string; name: string; phone: string; customerType: string } | null;
  createdBy?: { id: string; name: string } | null;
  items?: CartItem[];
}

export interface CreateCartRequest {
  customerId?: string;
  mechanicId?: string;
  commissionAmount?: number;
  commissionNote?: string;
  note?: string;
}

export interface UpdateCartRequest {
  customerId?: string | null;
  mechanicId?: string | null;
  commissionAmount?: number;
  commissionNote?: string;
  note?: string;
}

export interface AddCartItemRequest {
  itemType: ItemType;
  serviceId?: string;
  productId?: string;
  machineModelId?: string;
  unitPrice: number;
  quantity?: number;
  note?: string;
}

export interface UpdateCartItemRequest {
  machineModelId?: string;
  unitPrice?: number;
  quantity?: number;
  note?: string;
}

export interface CheckoutRequest {
  cartId: string;
  paymentMethod?: PaymentMethod;
  paidAmount?: number;
  referenceNo?: string;
  paymentNote?: string;
  saleNote?: string;
}

export interface CartQuery {
  search?: string;
  status?: CartStatus;
  customerId?: string;
  mechanicId?: string;
  page?: number;
  limit?: number;
}

export type GetCartsResponse = ApiPaginatedResponse<Cart>;
export type GetCartResponse = ApiResponse<Cart>;
export type GetCartItemResponse = ApiResponse<CartItem>;
