import { baseApi } from '@/lib/api/baseApi';

import type {
  CreateSupplierRequest,
  GetSupplierResponse,
  GetSuppliersResponse,
  SupplierQuery,
  UpdateSupplierRequest,
  UpdateSupplierStatusRequest,
} from './types';

const suppliersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSuppliers: builder.query<GetSuppliersResponse, SupplierQuery>({
      query: ({ search, status, page = 1, limit = 20 }) => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (status) params.set('status', status);
        params.set('page', String(page));
        params.set('limit', String(limit));
        return `/suppliers?${params}`;
      },
      providesTags: ['Supplier'],
    }),
    getSupplier: builder.query<GetSupplierResponse, string>({
      query: (id) => `/suppliers/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Supplier', id }],
    }),
    createSupplier: builder.mutation<GetSupplierResponse, CreateSupplierRequest>({
      query: (body) => ({
        url: '/suppliers',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Supplier'],
    }),
    updateSupplier: builder.mutation<
      GetSupplierResponse,
      { id: string; data: UpdateSupplierRequest }
    >({
      query: ({ id, data }) => ({
        url: `/suppliers/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'Supplier',
        { type: 'Supplier', id },
      ],
    }),
    updateSupplierStatus: builder.mutation<
      GetSupplierResponse,
      { id: string; data: UpdateSupplierStatusRequest }
    >({
      query: ({ id, data }) => ({
        url: `/suppliers/${id}/status`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'Supplier',
        { type: 'Supplier', id },
      ],
    }),
  }),
});

export const {
  useGetSuppliersQuery,
  useGetSupplierQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useUpdateSupplierStatusMutation,
} = suppliersApi;
