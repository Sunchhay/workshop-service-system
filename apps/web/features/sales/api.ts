import { baseApi } from '@/lib/api/baseApi';

import type {
  AddSalePaymentRequest,
  GetSaleResponse,
  GetSalesResponse,
  SaleQuery,
} from './types';

const salesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSales: builder.query<GetSalesResponse, SaleQuery>({
      query: ({
        search,
        paymentStatus,
        saleStatus,
        customerId,
        mechanicId,
        dateFrom,
        dateTo,
        page = 1,
        limit = 20,
      }) => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (paymentStatus) params.set('paymentStatus', paymentStatus);
        if (saleStatus) params.set('saleStatus', saleStatus);
        if (customerId) params.set('customerId', customerId);
        if (mechanicId) params.set('mechanicId', mechanicId);
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
    voidSale: builder.mutation<GetSaleResponse, { id: string; voidReason: string }>({
      query: ({ id, voidReason }) => ({
        url: `/sales/${id}/void`,
        method: 'PATCH',
        body: { voidReason },
      }),
      invalidatesTags: (_result, _error, { id }) => ['Sale', { type: 'Sale', id }],
    }),
    markCommissionPaid: builder.mutation<GetSaleResponse, string>({
      query: (id) => ({ url: `/sales/${id}/commission-paid`, method: 'PATCH' }),
      invalidatesTags: (_result, _error, id) => ['Sale', { type: 'Sale', id }],
    }),
    addSalePayment: builder.mutation<
      GetSaleResponse,
      { saleId: string; data: AddSalePaymentRequest }
    >({
      query: ({ saleId, data }) => ({
        url: `/sales/${saleId}/payments`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { saleId }) => ['Sale', { type: 'Sale', id: saleId }],
    }),
  }),
});

export const {
  useGetSalesQuery,
  useGetSaleQuery,
  useVoidSaleMutation,
  useMarkCommissionPaidMutation,
  useAddSalePaymentMutation,
} = salesApi;
