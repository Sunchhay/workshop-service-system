import { baseApi } from '@/lib/api/baseApi';

import type {
  CreateCustomerRequest,
  CustomerQuery,
  GetCustomerResponse,
  GetCustomersResponse,
  UpdateCustomerRequest,
  UploadCustomerImageResponse,
} from './types';

const customersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<GetCustomersResponse, CustomerQuery>({
      query: ({ search, customerType, isActive, page = 1, limit = 20 }) => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (customerType) params.set('customerType', customerType);
        if (isActive !== undefined) params.set('isActive', String(isActive));
        params.set('page', String(page));
        params.set('limit', String(limit));
        return `/customers?${params}`;
      },
      providesTags: ['Customer'],
    }),
    getCustomer: builder.query<GetCustomerResponse, string>({
      query: (id) => `/customers/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Customer', id }],
    }),
    createCustomer: builder.mutation<GetCustomerResponse, CreateCustomerRequest>({
      query: (body) => ({
        url: '/customers',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Customer'],
    }),
    updateCustomer: builder.mutation<
      GetCustomerResponse,
      { id: string; data: UpdateCustomerRequest }
    >({
      query: ({ id, data }) => ({
        url: `/customers/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'Customer',
        { type: 'Customer', id },
      ],
    }),
    updateCustomerStatus: builder.mutation<
      GetCustomerResponse,
      { id: string; isActive: boolean }
    >({
      query: ({ id, isActive }) => ({
        url: `/customers/${id}/status`,
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'Customer',
        { type: 'Customer', id },
      ],
    }),
    deleteCustomer: builder.mutation<{ success: boolean; data: null }, string>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Customer'],
    }),
    uploadCustomerImage: builder.mutation<UploadCustomerImageResponse, File>({
      query: (file) => {
        const body = new FormData();
        body.append('file', file);
        return {
          url: '/customers/upload-image',
          method: 'POST',
          body,
        };
      },
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useUpdateCustomerStatusMutation,
  useDeleteCustomerMutation,
  useUploadCustomerImageMutation,
} = customersApi;
