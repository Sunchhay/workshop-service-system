import { baseApi } from '@/lib/api/baseApi';

import type {
  CreateMachineModelRequest,
  GetMachineModelResponse,
  GetMachineModelsResponse,
  MachineModelQuery,
  UpdateMachineModelRequest,
} from './types';

const machineModelsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMachineModels: builder.query<GetMachineModelsResponse, MachineModelQuery>({
      query: ({ search, category, isActive, page = 1, limit = 20 }) => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (category) params.set('category', category);
        if (isActive !== undefined) params.set('isActive', String(isActive));
        params.set('page', String(page));
        params.set('limit', String(limit));
        return `/machine-models?${params}`;
      },
      providesTags: ['MachineModel'],
    }),
    getMachineModel: builder.query<GetMachineModelResponse, string>({
      query: (id) => `/machine-models/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'MachineModel', id }],
    }),
    createMachineModel: builder.mutation<
      GetMachineModelResponse,
      CreateMachineModelRequest
    >({
      query: (body) => ({
        url: '/machine-models',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['MachineModel'],
    }),
    updateMachineModel: builder.mutation<
      GetMachineModelResponse,
      { id: string; data: UpdateMachineModelRequest }
    >({
      query: ({ id, data }) => ({
        url: `/machine-models/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'MachineModel',
        { type: 'MachineModel', id },
      ],
    }),
    updateMachineModelStatus: builder.mutation<
      GetMachineModelResponse,
      { id: string; isActive: boolean }
    >({
      query: ({ id, isActive }) => ({
        url: `/machine-models/${id}/status`,
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'MachineModel',
        { type: 'MachineModel', id },
      ],
    }),
    deleteMachineModel: builder.mutation<{ success: boolean; data: null }, string>({
      query: (id) => ({
        url: `/machine-models/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MachineModel'],
    }),
  }),
});

export const {
  useGetMachineModelsQuery,
  useGetMachineModelQuery,
  useCreateMachineModelMutation,
  useUpdateMachineModelMutation,
  useUpdateMachineModelStatusMutation,
  useDeleteMachineModelMutation,
} = machineModelsApi;
