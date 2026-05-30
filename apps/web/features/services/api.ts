import { baseApi } from '@/lib/api/baseApi';

import type {
  CreateServiceRequest,
  GetServiceResponse,
  GetServicesResponse,
  ServiceQuery,
  UpdateServiceRequest,
} from './types';

const servicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query<GetServicesResponse, ServiceQuery>({
      query: ({ search, isActive, page = 1, limit = 20 }) => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (isActive !== undefined) params.set('isActive', String(isActive));
        params.set('page', String(page));
        params.set('limit', String(limit));
        return `/services?${params}`;
      },
      providesTags: ['Service'],
    }),
    getService: builder.query<GetServiceResponse, string>({
      query: (id) => `/services/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Service', id }],
    }),
    createService: builder.mutation<GetServiceResponse, CreateServiceRequest>({
      query: (body) => ({
        url: '/services',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Service'],
    }),
    updateService: builder.mutation<
      GetServiceResponse,
      { id: string; data: UpdateServiceRequest }
    >({
      query: ({ id, data }) => ({
        url: `/services/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'Service',
        { type: 'Service', id },
      ],
    }),
    updateServiceStatus: builder.mutation<
      GetServiceResponse,
      { id: string; isActive: boolean }
    >({
      query: ({ id, isActive }) => ({
        url: `/services/${id}/status`,
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'Service',
        { type: 'Service', id },
      ],
    }),
    deleteService: builder.mutation<{ success: boolean; data: null }, string>({
      query: (id) => ({
        url: `/services/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Service'],
    }),
  }),
});

export const {
  useGetServicesQuery,
  useGetServiceQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useUpdateServiceStatusMutation,
  useDeleteServiceMutation,
} = servicesApi;
