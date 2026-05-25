import { baseApi } from '@/lib/api/baseApi';

import type {
  GetDashboardSummaryResponse,
  GetLowStockProductsResponse,
  GetRecentServiceJobsResponse,
  GetRecentTransactionsResponse,
} from './types';

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<GetDashboardSummaryResponse, void>({
      query: () => '/dashboard/summary',
      keepUnusedDataFor: 300,
    }),
    getRecentServiceJobs: builder.query<GetRecentServiceJobsResponse, void>({
      query: () => '/dashboard/recent-service-jobs',
      providesTags: ['ServiceJob'],
      keepUnusedDataFor: 300,
    }),
    getRecentTransactions: builder.query<GetRecentTransactionsResponse, void>({
      query: () => '/dashboard/recent-transactions',
      providesTags: ['Payment'],
      keepUnusedDataFor: 300,
    }),
    getLowStockProducts: builder.query<GetLowStockProductsResponse, void>({
      query: () => '/dashboard/low-stock-products',
      providesTags: ['Product'],
      keepUnusedDataFor: 300,
    }),
  }),
});

export const {
  useGetDashboardSummaryQuery,
  useGetRecentServiceJobsQuery,
  useGetRecentTransactionsQuery,
  useGetLowStockProductsQuery,
} = dashboardApi;
