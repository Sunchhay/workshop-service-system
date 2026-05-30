import type { ApiPaginatedResponse, ApiResponse } from '@/lib/api/types';

export interface MachineModel {
  id: string;
  brand: string;
  model: string;
  category: string | null;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateMachineModelRequest {
  brand: string;
  model: string;
  category?: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateMachineModelRequest {
  brand?: string;
  model?: string;
  category?: string;
  description?: string;
  isActive?: boolean;
}

export interface MachineModelQuery {
  search?: string;
  category?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export type GetMachineModelsResponse = ApiPaginatedResponse<MachineModel>;
export type GetMachineModelResponse = ApiResponse<MachineModel>;
