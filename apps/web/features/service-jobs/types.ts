import type { ApiPaginatedResponse, ApiResponse } from '@/lib/api/types';

export type JobStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELIVERED' | 'CANCELLED';
export type Priority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
export type ItemType = 'SERVICE' | 'PRODUCT' | 'CUSTOM';

export interface ServiceJobCustomer {
  id: string;
  code: string;
  name: string;
  phone: string;
}

export interface ServiceJobMachineModel {
  id: string;
  brand: string;
  model: string;
  category: string | null;
}

export interface ServiceJobUser {
  id: string;
  name: string;
}

export interface ServiceJobService {
  id: string;
  code: string;
  nameEn: string;
}

export interface ServiceJobPriceCatalog {
  id: string;
  label: string;
}

export interface ServiceJobItem {
  id: string;
  serviceJobId: string;
  type: ItemType;
  serviceId: string | null;
  priceCatalogId: string | null;
  productId: string | null;
  description: string;
  quantity: string; // Prisma Decimal → string
  unitPrice: string;
  totalPrice: string;
  measurement: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  service: ServiceJobService | null;
  priceCatalog: ServiceJobPriceCatalog | null;
}

export interface ServiceJob {
  id: string;
  jobCode: string;
  customerId: string;
  machineModelId: string | null;
  partDescription: string;
  status: JobStatus;
  priority: Priority;
  estimatedCompletionDate: string | null;
  completedAt: string | null;
  deliveredAt: string | null;
  notes: string | null;
  technicianNotes: string | null;
  createdById: string;
  assignedToId: string | null;
  createdAt: string;
  updatedAt: string;
  customer: ServiceJobCustomer;
  machineModel: ServiceJobMachineModel | null;
  createdBy: ServiceJobUser;
  assignedTo: ServiceJobUser | null;
  items: ServiceJobItem[];
}

export interface CreateServiceJobItemRequest {
  type?: ItemType;
  serviceId?: string;
  priceCatalogId?: string;
  description: string;
  quantity?: number;
  unitPrice: number;
  measurement?: string;
  notes?: string;
}

export interface CreateServiceJobRequest {
  customerId: string;
  machineModelId?: string;
  partDescription: string;
  status?: JobStatus;
  priority?: Priority;
  estimatedCompletionDate?: string;
  notes?: string;
  technicianNotes?: string;
  assignedToId?: string;
  items?: CreateServiceJobItemRequest[];
}

export interface UpdateServiceJobRequest {
  machineModelId?: string | null;
  partDescription?: string;
  priority?: Priority;
  estimatedCompletionDate?: string | null;
  notes?: string;
  technicianNotes?: string;
  assignedToId?: string | null;
  items?: CreateServiceJobItemRequest[];
}

export interface ServiceJobQuery {
  search?: string;
  status?: JobStatus;
  priority?: Priority;
  customerId?: string;
  machineModelId?: string;
  assignedToId?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export type GetServiceJobsResponse = ApiPaginatedResponse<ServiceJob>;
export type GetServiceJobResponse = ApiResponse<ServiceJob>;
