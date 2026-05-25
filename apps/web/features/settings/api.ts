import { baseApi } from '@/lib/api/baseApi';

import type {
  GetPublicSettingsResponse,
  GetSettingsGroupResponse,
  GetSettingsResponse,
  UpdateSettingResponse,
  UpdateSettingsGroupResponse,
} from './types';

const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<GetSettingsResponse, void>({
      query: () => '/settings',
      providesTags: ['Setting'],
    }),
    getSettingsGroup: builder.query<GetSettingsGroupResponse, string>({
      query: (group) => `/settings/group/${group}`,
      providesTags: (_result, _error, group) => [{ type: 'Setting', id: group }],
    }),
    getPublicSettings: builder.query<GetPublicSettingsResponse, void>({
      query: () => '/settings/public',
    }),
    updateSetting: builder.mutation<
      UpdateSettingResponse,
      { key: string; value: string | null }
    >({
      query: ({ key, value }) => ({
        url: `/settings/${key}`,
        method: 'PATCH',
        body: { value },
      }),
      invalidatesTags: ['Setting'],
    }),
    updateSettingsGroup: builder.mutation<
      UpdateSettingsGroupResponse,
      { group: string; settings: Record<string, string | null> }
    >({
      query: ({ group, settings }) => ({
        url: `/settings/group/${group}`,
        method: 'PATCH',
        body: { settings },
      }),
      invalidatesTags: (_result, _error, { group }) => [
        { type: 'Setting', id: group },
        'Setting',
      ],
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useGetSettingsGroupQuery,
  useGetPublicSettingsQuery,
  useUpdateSettingMutation,
  useUpdateSettingsGroupMutation,
} = settingsApi;
