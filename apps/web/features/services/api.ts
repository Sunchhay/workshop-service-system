import { baseApi } from '@/lib/api/baseApi';

import type {
  CreateServiceRequest,
  GetServiceResponse,
  GetServicesResponse,
  ServiceQuery,
  UpdateServiceRequest,
  UpdateServiceStatusRequest,
} from './types';

const servicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query<GetServicesResponse, ServiceQuery>({
      query: ({ search, status, category, page = 1, limit = 20 }) => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (status) params.set('status', status);
        if (category) params.set('category', category);
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
      { id: string; data: UpdateServiceStatusRequest }
    >({
      query: ({ id, data }) => ({
        url: `/services/${id}/status`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'Service',
        { type: 'Service', id },
      ],
    }),
    deleteService: builder.mutation<GetServiceResponse, string>({
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
