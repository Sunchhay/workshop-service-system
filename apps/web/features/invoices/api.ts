import { baseApi } from '@/lib/api/baseApi';

import type {
  CreateInvoiceRequest,
  GetInvoiceResponse,
  GetInvoicesResponse,
  InvoiceQuery,
  UpdateInvoiceRequest,
} from './types';

const invoicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInvoices: builder.query<GetInvoicesResponse, InvoiceQuery>({
      query: ({
        search,
        status,
        customerId,
        serviceJobId,
        dateFrom,
        dateTo,
        page = 1,
        limit = 20,
      }) => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (status) params.set('status', status);
        if (customerId) params.set('customerId', customerId);
        if (serviceJobId) params.set('serviceJobId', serviceJobId);
        if (dateFrom) params.set('dateFrom', dateFrom);
        if (dateTo) params.set('dateTo', dateTo);
        params.set('page', String(page));
        params.set('limit', String(limit));
        return `/invoices?${params}`;
      },
      providesTags: ['Invoice'],
    }),
    getInvoice: builder.query<GetInvoiceResponse, string>({
      query: (id) => `/invoices/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Invoice', id }],
    }),
    createInvoice: builder.mutation<GetInvoiceResponse, CreateInvoiceRequest>({
      query: (body) => ({ url: '/invoices', method: 'POST', body }),
      invalidatesTags: ['Invoice'],
    }),
    createInvoiceFromServiceJob: builder.mutation<GetInvoiceResponse, string>({
      query: (serviceJobId) => ({
        url: `/invoices/from-service-job/${serviceJobId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Invoice'],
    }),
    updateInvoice: builder.mutation<
      GetInvoiceResponse,
      { id: string; data: UpdateInvoiceRequest }
    >({
      query: ({ id, data }) => ({
        url: `/invoices/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'Invoice',
        { type: 'Invoice', id },
      ],
    }),
    cancelInvoice: builder.mutation<
      GetInvoiceResponse,
      { id: string; reason?: string }
    >({
      query: ({ id, reason }) => ({
        url: `/invoices/${id}/cancel`,
        method: 'PATCH',
        body: { reason },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'Invoice',
        { type: 'Invoice', id },
      ],
    }),
    deleteInvoice: builder.mutation<{ success: boolean; data: null }, string>({
      query: (id) => ({ url: `/invoices/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Invoice'],
    }),
  }),
});

export const {
  useGetInvoicesQuery,
  useGetInvoiceQuery,
  useCreateInvoiceMutation,
  useCreateInvoiceFromServiceJobMutation,
  useUpdateInvoiceMutation,
  useCancelInvoiceMutation,
  useDeleteInvoiceMutation,
} = invoicesApi;
