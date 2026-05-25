import { baseApi } from '@/lib/api/baseApi';

import type {
  CreatePaymentRequest,
  GetPaymentListResponse,
  GetPaymentResponse,
  GetPaymentsResponse,
  PaymentQuery,
} from './types';

const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query<GetPaymentsResponse, PaymentQuery>({
      query: ({ search, method, customerId, invoiceId, dateFrom, dateTo, page = 1, limit = 20 }) => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (method) params.set('method', method);
        if (customerId) params.set('customerId', customerId);
        if (invoiceId) params.set('invoiceId', invoiceId);
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
    getPaymentsByInvoice: builder.query<GetPaymentListResponse, string>({
      query: (invoiceId) => `/payments/by-invoice/${invoiceId}`,
      providesTags: (_result, _error, invoiceId) => [
        { type: 'Payment', id: `invoice-${invoiceId}` },
      ],
      keepUnusedDataFor: 300,
    }),
    getPaymentsByCustomer: builder.query<GetPaymentListResponse, string>({
      query: (customerId) => `/payments/by-customer/${customerId}`,
      providesTags: (_result, _error, customerId) => [
        { type: 'Payment', id: `customer-${customerId}` },
      ],
    }),
    createPayment: builder.mutation<GetPaymentResponse, CreatePaymentRequest>({
      query: (body) => ({ url: '/payments', method: 'POST', body }),
      invalidatesTags: (_result, _error, { invoiceId, customerId }) => [
        'Payment',
        'Invoice',
        { type: 'Payment', id: `invoice-${invoiceId}` },
        { type: 'Payment', id: `customer-${customerId}` },
      ],
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useGetPaymentQuery,
  useGetPaymentsByInvoiceQuery,
  useGetPaymentsByCustomerQuery,
  useCreatePaymentMutation,
} = paymentsApi;
