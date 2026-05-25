import type { ApiResponse } from '@/lib/api/types';

export interface Setting {
  id: string;
  key: string;
  value: string | null;
  type: string;
  group: string;
  description: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SettingsMap = Record<string, string | null>;

export interface UpdateSettingsGroupRequest {
  group: string;
  settings: SettingsMap;
}

export type GetSettingsResponse = ApiResponse<Setting[]>;
export type GetSettingsGroupResponse = ApiResponse<SettingsMap>;
export type GetPublicSettingsResponse = ApiResponse<SettingsMap>;
export type UpdateSettingResponse = ApiResponse<Setting>;
export type UpdateSettingsGroupResponse = ApiResponse<SettingsMap>;
