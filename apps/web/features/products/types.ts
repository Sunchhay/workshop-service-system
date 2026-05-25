import type { ApiPaginatedResponse, ApiResponse } from '@/lib/api/types';

export interface ProductLinkedRefBook {
  id: string;
  partName: string;
  partCode: string | null;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  brand: string | null;
  componentPartType: string | null;
  size: string | null;
  supplier: string | null;
  description: string | null;
  category: string | null;
  unit: string;
  costPrice: string; // Prisma Decimal → string
  sellingPrice: string;
  stockQuantity: number;
  reorderLevel: number;
  linkedReferenceBookId: string | null;
  linkedReferenceBook: ProductLinkedRefBook | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  brand?: string;
  componentPartType?: string;
  size?: string;
  supplier?: string;
  description?: string;
  category?: string;
  unit?: string;
  costPrice: number;
  sellingPrice: number;
  stockQuantity?: number;
  reorderLevel?: number;
  linkedReferenceBookId?: string;
}

export type UpdateProductRequest = Partial<CreateProductRequest>;

export interface AdjustStockRequest {
  quantityChange: number;
  reason?: string;
  note?: string;
}

export interface ProductQuery {
  search?: string;
  category?: string;
  componentPartType?: string;
  isActive?: boolean;
  lowStock?: boolean;
  page?: number;
  limit?: number;
}

export type GetProductsResponse = ApiPaginatedResponse<Product>;
export type GetProductResponse = ApiResponse<Product>;
