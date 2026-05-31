import type { ApiPaginatedResponse, ApiResponse } from '@/lib/api/types';

export type RecordStatus = 'ACTIVE' | 'INACTIVE';

export interface MachineModel {
  id: string;
  code: string;
  brand?: string | null;
  modelName: string;
  machineType?: string | null;
  year?: string | null;
  imageUrl?: string | null;
  description?: string | null;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMachineModelRequest {
  code: string;
  modelName: string;
  brand?: string;
  machineType?: string;
  year?: string;
  imageUrl?: string;
  description?: string;
  status?: RecordStatus;
}

export interface UpdateMachineModelRequest {
  code?: string;
  modelName?: string;
  brand?: string;
  machineType?: string;
  year?: string;
  imageUrl?: string;
  description?: string;
  status?: RecordStatus;
}

export interface UpdateMachineModelStatusRequest {
  status: RecordStatus;
}

export interface MachineModelQuery {
  search?: string;
  machineType?: string;
  status?: RecordStatus;
  page?: number;
  limit?: number;
}

export type GetMachineModelsResponse = ApiPaginatedResponse<MachineModel>;
export type GetMachineModelResponse = ApiResponse<MachineModel>;
