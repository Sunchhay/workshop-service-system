import { baseApi } from '@/lib/api/baseApi';

import type {
  CreateMachineModelRequest,
  GetMachineModelResponse,
  GetMachineModelsResponse,
  MachineModelQuery,
  UpdateMachineModelRequest,
  UpdateMachineModelStatusRequest,
} from './types';

const machineModelsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMachineModels: builder.query<GetMachineModelsResponse, MachineModelQuery>({
      query: ({ search, machineType, status, page = 1, limit = 20 }) => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (machineType) params.set('machineType', machineType);
        if (status) params.set('status', status);
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
      { id: string; data: UpdateMachineModelStatusRequest }
    >({
      query: ({ id, data }) => ({
        url: `/machine-models/${id}/status`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'MachineModel',
        { type: 'MachineModel', id },
      ],
    }),
    deleteMachineModel: builder.mutation<GetMachineModelResponse, string>({
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
