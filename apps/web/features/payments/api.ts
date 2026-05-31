import { baseApi } from '@/lib/api/baseApi';

import type {
  CreatePaymentRequest,
  GetInvoicePaymentListResponse,
  GetPaymentResponse,
  GetPaymentsResponse,
  PaymentQuery,
} from './types';

const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query<GetPaymentsResponse, PaymentQuery>({
      query: ({ paymentMethod, saleId, dateFrom, dateTo, page = 1, limit = 20 }) => {
        const params = new URLSearchParams();
        if (paymentMethod) params.set('paymentMethod', paymentMethod);
        if (saleId) params.set('saleId', saleId);
        if (dateFrom) params.set('dateFrom', dateFrom);
        if (dateTo) params.set('dateTo', dateTo);
        params.set('page', String(page));
        params.set('limit', String(limit));
        return `/payments?${params}`;
      },
      providesTags: ['Payment'],
    }),
    getPayment: builder.query<GetPaymentResponse, string>({
      query: (id) => `/payments/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Payment', id }],
    }),
    // Kept for InvoiceDetailPage backward compat
    getPaymentsByInvoice: builder.query<GetInvoicePaymentListResponse, string>({
      query: (invoiceId) => `/payments/by-invoice/${invoiceId}`,
      providesTags: (_result, _error, invoiceId) => [
        { type: 'Payment', id: `invoice-${invoiceId}` },
      ],
      keepUnusedDataFor: 300,
    }),
    // Kept for InvoiceDetailPage backward compat
    createPayment: builder.mutation<GetPaymentResponse, CreatePaymentRequest>({
      query: (body) => ({ url: '/payments', method: 'POST', body }),
      invalidatesTags: (_result, _error, { invoiceId }) => [
        'Payment',
        'Invoice',
        { type: 'Payment', id: `invoice-${invoiceId}` },
      ],
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useGetPaymentQuery,
  useGetPaymentsByInvoiceQuery,
  useCreatePaymentMutation,
} = paymentsApi;
