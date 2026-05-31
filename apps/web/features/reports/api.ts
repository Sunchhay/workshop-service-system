import { baseApi } from '@/lib/api/baseApi';

import type {
  GetReportCustomerDebtsResponse,
  GetReportExpensesResponse,
  GetReportMechanicCommissionsResponse,
  GetReportPaymentsResponse,
  GetReportProductSalesResponse,
  GetReportProfitSummaryResponse,
  GetReportSalesResponse,
  GetReportServiceUsageResponse,
  ReportCommissionQuery,
  ReportDateQuery,
  ReportExpenseQuery,
  ReportPaymentQuery,
  ReportSaleQuery,
} from './types';

const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReportSales: builder.query<GetReportSalesResponse, ReportSaleQuery>({
      query: (params) => ({ url: '/reports/sales', params }),
      providesTags: ['ReportSale'],
      keepUnusedDataFor: 60,
    }),
    getReportPayments: builder.query<GetReportPaymentsResponse, ReportPaymentQuery>({
      query: (params) => ({ url: '/reports/payments', params }),
      providesTags: ['ReportPayment'],
      keepUnusedDataFor: 60,
    }),
    getReportExpenses: builder.query<GetReportExpensesResponse, ReportExpenseQuery>({
      query: (params) => ({ url: '/reports/expenses', params }),
      providesTags: ['ReportExpense'],
      keepUnusedDataFor: 60,
    }),
    getReportProfitSummary: builder.query<GetReportProfitSummaryResponse, ReportDateQuery>({
      query: (params) => ({ url: '/reports/profit-summary', params }),
      providesTags: ['ReportProfit'],
      keepUnusedDataFor: 60,
    }),
    getReportMechanicCommissions: builder.query<GetReportMechanicCommissionsResponse, ReportCommissionQuery>({
      query: (params) => ({ url: '/reports/mechanic-commissions', params }),
      providesTags: ['ReportSale'],
      keepUnusedDataFor: 60,
    }),
    getReportCustomerDebts: builder.query<GetReportCustomerDebtsResponse, ReportDateQuery>({
      query: (params) => ({ url: '/reports/customer-debts', params }),
      providesTags: ['ReportSale'],
      keepUnusedDataFor: 60,
    }),
    getReportServiceUsage: builder.query<GetReportServiceUsageResponse, ReportDateQuery>({
      query: (params) => ({ url: '/reports/service-usage', params }),
      keepUnusedDataFor: 60,
    }),
    getReportProductSales: builder.query<GetReportProductSalesResponse, ReportDateQuery>({
      query: (params) => ({ url: '/reports/product-sales', params }),
      keepUnusedDataFor: 60,
    }),
  }),
});

export const {
  useGetReportSalesQuery,
  useGetReportPaymentsQuery,
  useGetReportExpensesQuery,
  useGetReportProfitSummaryQuery,
  useGetReportMechanicCommissionsQuery,
  useGetReportCustomerDebtsQuery,
  useGetReportServiceUsageQuery,
  useGetReportProductSalesQuery,
} = reportsApi;
