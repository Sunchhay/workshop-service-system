import { baseApi } from '@/lib/api/baseApi';

import type {
  GetDashboardSummaryResponse,
  GetPaymentSummaryResponse,
  GetRecentSalesResponse,
  GetTopProductsResponse,
  GetTopServicesResponse,
} from './types';

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<GetDashboardSummaryResponse, void>({
      query: () => '/dashboard/summary',
      keepUnusedDataFor: 300,
    }),
    getRecentSales: builder.query<GetRecentSalesResponse, void>({
      query: () => '/dashboard/recent-sales',
      providesTags: ['Sale'],
      keepUnusedDataFor: 300,
    }),
    getTopServices: builder.query<GetTopServicesResponse, void>({
      query: () => '/dashboard/top-services',
      keepUnusedDataFor: 300,
    }),
    getTopProducts: builder.query<GetTopProductsResponse, void>({
      query: () => '/dashboard/top-products',
      keepUnusedDataFor: 300,
    }),
    getPaymentSummary: builder.query<GetPaymentSummaryResponse, void>({
      query: () => '/dashboard/payment-summary',
      providesTags: ['Payment'],
      keepUnusedDataFor: 300,
    }),
  }),
});

export const {
  useGetDashboardSummaryQuery,
  useGetRecentSalesQuery,
  useGetTopServicesQuery,
  useGetTopProductsQuery,
  useGetPaymentSummaryQuery,
} = dashboardApi;
