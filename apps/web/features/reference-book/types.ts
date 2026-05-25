import type { ApiPaginatedResponse, ApiResponse } from '@/lib/api/types';

export type ReferenceSourceType =
  | 'MOM_NOTEBOOK'
  | 'SUPPLIER_INFO'
  | 'REAL_MEASUREMENT'
  | 'SERVICE_HISTORY'
  | 'SERVICE_MANUAL'
  | 'OTHER';

export type VerificationStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'VERIFIED'
  | 'OLD_DATA';

export interface MeasurementDetail {
  label: string;
  value: string;
  unit: string;
}

export interface ReferenceBookMachineModel {
  id: string;
  brand: string;
  model: string;
  category: string | null;
}

export interface ReferenceBook {
  id: string;
  machineModelId: string | null;
  machineModel: ReferenceBookMachineModel | null;
  componentType: string | null;
  partName: string;
  partCode: string | null;
  standardSize: string | null; // Prisma Decimal → string
  wearLimit: string | null;
  serviceLimit: string | null;
  unit: string;
  measurementDetails: MeasurementDetail[] | null;
  sourceType: ReferenceSourceType;
  verificationStatus: VerificationStatus;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReferenceBookRequest {
  machineModelId?: string | null;
  componentType?: string;
  partName: string;
  partCode?: string;
  standardSize?: number;
  wearLimit?: number;
  serviceLimit?: number;
  unit?: string;
  measurementDetails?: MeasurementDetail[];
  sourceType?: ReferenceSourceType;
  verificationStatus?: VerificationStatus;
  notes?: string;
}

export interface UpdateReferenceBookRequest {
  machineModelId?: string | null;
  componentType?: string;
  partName?: string;
  partCode?: string;
  standardSize?: number | null;
  wearLimit?: number | null;
  serviceLimit?: number | null;
  unit?: string;
  measurementDetails?: MeasurementDetail[];
  sourceType?: ReferenceSourceType;
  notes?: string;
}

export interface ReferenceBookQuery {
  search?: string;
  machineModelId?: string;
  componentType?: string;
  sourceType?: ReferenceSourceType;
  verificationStatus?: VerificationStatus;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export type GetReferenceBooksResponse = ApiPaginatedResponse<ReferenceBook>;
export type GetReferenceBookResponse = ApiResponse<ReferenceBook>;
