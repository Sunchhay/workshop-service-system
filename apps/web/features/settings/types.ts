import type { ApiPaginatedResponse, ApiResponse } from '@/lib/api/types';

export interface Setting {
  id: string;
  key: string;
  value?: string | null;
  type: string;
  group: string;
  description?: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SettingsMap = Record<string, string | null>;

export interface UpdateSettingRequest {
  value?: string | null;
  type?: string;
  group?: string;
  description?: string | null;
  isPublic?: boolean;
}

export interface UpdateSettingsGroupRequest {
  group: string;
  settings: SettingsMap;
}

export type GetSettingsResponse = ApiPaginatedResponse<Setting>;
export type GetSettingsGroupResponse = ApiResponse<Setting[]>;
export type GetPublicSettingsResponse = ApiResponse<Setting[]>;
export type UpdateSettingResponse = ApiResponse<Setting>;
export type UpdateSettingsGroupResponse = ApiResponse<Setting[]>;
