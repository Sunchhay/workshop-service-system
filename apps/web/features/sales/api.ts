import { baseApi } from '@/lib/api/baseApi';

import type {
  CreateSaleRequest,
  GetSaleResponse,
  GetSalesResponse,
  SaleQuery,
  UpdateSaleRequest,
} from './types';

const salesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSales: builder.query<GetSalesResponse, SaleQuery>({
      query: ({ search, status, customerId, dateFrom, dateTo, page = 1, limit = 20 }) => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (status) params.set('status', status);
        if (customerId) params.set('customerId', customerId);
        if (dateFrom) params.set('dateFrom', dateFrom);
        if (dateTo) params.set('dateTo', dateTo);
        params.set('page', String(page));
        params.set('limit', String(limit));
        return `/sales?${params}`;
      },
      providesTags: ['Sale'],
    }),
    getSale: builder.query<GetSaleResponse, string>({
      query: (id) => `/sales/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Sale', id }],
    }),
    createSale: builder.mutation<GetSaleResponse, CreateSaleRequest>({
      query: (body) => ({ url: '/sales', method: 'POST', body }),
      invalidatesTags: ['Sale', 'Product'],
    }),
    updateSale: builder.mutation<GetSaleResponse, { id: string; data: UpdateSaleRequest }>({
      query: ({ id, data }) => ({ url: `/sales/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (_result, _error, { id }) => ['Sale', { type: 'Sale', id }],
    }),
    cancelSale: builder.mutation<GetSaleResponse, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/sales/${id}/cancel`,
        method: 'PATCH',
        body: { reason },
      }),
      invalidatesTags: (_result, _error, { id }) => ['Sale', { type: 'Sale', id }, 'Product'],
    }),
    completeSale: builder.mutation<GetSaleResponse, string>({
      query: (id) => ({ url: `/sales/${id}/complete`, method: 'PATCH' }),
      invalidatesTags: (_result, _error, id) => ['Sale', { type: 'Sale', id }, 'Product'],
    }),
    deleteSale: builder.mutation<{ success: boolean; data: null }, string>({
      query: (id) => ({ url: `/sales/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Sale'],
    }),
  }),
});

export const {
  useGetSalesQuery,
  useGetSaleQuery,
  useCreateSaleMutation,
  useUpdateSaleMutation,
  useCompleteSaleMutation,
  useCancelSaleMutation,
  useDeleteSaleMutation,
} = salesApi;
