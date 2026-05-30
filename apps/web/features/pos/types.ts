import type { ApiPaginatedResponse, ApiResponse } from '@/lib/api/types';

export type CartStatus = 'ACTIVE' | 'CLOSED';
export type PaymentMethod = 'CASH' | 'ABA' | 'BANK_TRANSFER' | 'CARD' | 'OTHER';
export type CartItemType = 'SERVICE' | 'PRODUCT' | 'CUSTOM';

// CartItem matches the DB model. Decimal fields come as strings from the API.
export interface CartItem {
  id: string;
  cartId: string;
  type: CartItemType;
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
  sortOrder: number;
}

export interface Cart {
  id: string;
  cartCode: string;
  cartName: string;
  customerId: string | null;
  machineModelId: string | null;
  modelNameSnapshot: string | null;
  machineModel: {
    id: string;
    brand: string;
    model: string;
    category: string | null;
  } | null;
  customerName: string;
  customerPhone: string;
  jobTitle: string | null;
  engineType: string | null;
  discountAmount: string;
  paidAmount: string;
  paymentMethod: PaymentMethod;
  note: string | null;
  internalNote: string | null;
  status: CartStatus;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  items: CartItem[];
}

// ─── Request types ─────────────────────────────────────────────────────────────

export interface CreateCartRequest {
  cartName?: string;
}

export interface UpdateCartRequest {
  cartName?: string;
  customerId?: string | null;
  machineModelId?: string | null;
  modelNameSnapshot?: string | null;
  customerName?: string;
  customerPhone?: string;
  jobTitle?: string;
  engineType?: string;
  discountAmount?: number;
  paidAmount?: number;
  paymentMethod?: PaymentMethod;
  note?: string;
  internalNote?: string;
}

export interface AddCartItemRequest {
  type: CartItemType;
  serviceId?: string;
  productId?: string;
  machineModelId?: string;
  modelNameSnapshot?: string;
  itemCode?: string;
  itemNameKh?: string;
  itemNameEn?: string;
  description?: string;
  quantity?: number;
  unitPrice?: number;
  discountAmount?: number;
}

export interface UpdateCartItemRequest {
  quantity?: number;
  unitPrice?: number;
  discountAmount?: number;
  description?: string;
}

export interface CheckoutCartRequest {
  paidAmount?: number;
  paymentMethod?: PaymentMethod;
}

export interface CheckoutResult {
  sale: {
    id: string;
    saleNumber: string;
    totalAmount: string;
    status: string;
  };
  invoice: {
    id: string;
    invoiceNumber: string;
    totalAmount: string;
    dueAmount: string;
  };
  payment: {
    id: string;
    paymentNumber: string;
    amount: string;
  } | null;
}

// ─── Service Catalog ───────────────────────────────────────────────────────────

export interface CartServiceCatalogItem {
  source: 'PRICE_CATALOG' | 'SERVICE';
  serviceId: string;
  priceCatalogId?: string;
  machineModelId?: string;
  machineModelName?: string;
  nameKh: string | null;
  nameEn: string;
  category?: string | null;
  label?: string | null;
  suggestedPrice?: string | null;
  currency?: string | null;
  description?: string | null;
  code: string;
  imageUrl?: string | null;
}

export interface CartServiceCatalogQuery {
  search?: string;
  machineModelId?: string;
  showAll?: boolean;
  page?: number;
  limit?: number;
}

export type GetCartServiceCatalogResponse = ApiPaginatedResponse<CartServiceCatalogItem>;

// ─── Response types ────────────────────────────────────────────────────────────

export type GetCartsResponse = ApiResponse<Cart[]>;
export type GetCartResponse = ApiResponse<Cart>;
export type CheckoutCartResponse = ApiResponse<CheckoutResult>;

// ─── Legacy aliases (remove once all usages are updated) ──────────────────────
/** @deprecated use Cart */
export type PosCart = Cart;
/** @deprecated use CartItem */
export type PosCartItem = CartItem & { itemType: CartItemType };
