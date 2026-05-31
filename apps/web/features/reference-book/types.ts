import type { ApiPaginatedResponse, ApiResponse } from '@/lib/api/types';

export type RecordStatus = 'ACTIVE' | 'INACTIVE';

export interface ReferenceBookMachineModel {
  id: string;
  code: string;
  brand?: string | null;
  modelName: string;
  machineType?: string | null;
}

export interface ReferenceBookItem {
  id: string;
  referenceBookSectionId: string;
  label: string;
  value?: string | null;
  unit?: string | null;
  note?: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReferenceBookSection {
  id: string;
  referenceBookId: string;
  name: string;
  description?: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  items?: ReferenceBookItem[];
}

export interface ReferenceBook {
  id: string;
  title: string;
  category?: string | null;
  machineModelId?: string | null;
  summary?: string | null;
  imageUrl?: string | null;
  fileUrl?: string | null;
  status: RecordStatus;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  machineModel?: ReferenceBookMachineModel | null;
  sections?: ReferenceBookSection[];
}

export interface CreateReferenceBookRequest {
  title: string;
  category?: string;
  machineModelId?: string;
  summary?: string;
  imageUrl?: string;
  fileUrl?: string;
  status?: RecordStatus;
}

export interface UpdateReferenceBookRequest {
  title?: string;
  category?: string;
  machineModelId?: string | null;
  summary?: string;
  imageUrl?: string;
  fileUrl?: string;
  status?: RecordStatus;
}

export interface CreateSectionRequest {
  name: string;
  description?: string;
  sortOrder?: number;
}

export interface UpdateSectionRequest {
  name?: string;
  description?: string;
  sortOrder?: number;
}

export interface CreateItemRequest {
  label: string;
  value?: string;
  unit?: string;
  note?: string;
  sortOrder?: number;
}

export interface UpdateItemRequest {
  label?: string;
  value?: string;
  unit?: string;
  note?: string;
  sortOrder?: number;
}

export interface ReferenceBookQuery {
  search?: string;
  category?: string;
  machineModelId?: string;
  status?: RecordStatus;
  page?: number;
  limit?: number;
}

export type GetReferenceBooksResponse = ApiPaginatedResponse<ReferenceBook>;
export type GetReferenceBookResponse = ApiResponse<ReferenceBook>;
export type GetSectionResponse = ApiResponse<ReferenceBookSection>;
export type GetItemResponse = ApiResponse<ReferenceBookItem>;
