import { baseApi } from '@/lib/api/baseApi';

import type {
  GetReportExpensesResponse,
  GetReportInvoicesResponse,
  GetReportLowStockResponse,
  GetReportPaymentsResponse,
  GetReportProductsResponse,
  GetReportProfitResponse,
  GetReportSalesResponse,
  GetReportServiceJobsResponse,
  GetReportSummaryResponse,
  GetReportUnpaidBalancesResponse,
  ReportQuery,
} from './types';

const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReportSummary: builder.query<GetReportSummaryResponse, ReportQuery>({
      query: (params) => ({ url: '/reports/summary', params }),
      providesTags: ['ReportSummary'],
      keepUnusedDataFor: 60,
    }),
    getReportServiceJobs: builder.query<GetReportServiceJobsResponse, ReportQuery>({
      query: (params) => ({ url: '/reports/service-jobs', params }),
      providesTags: ['ReportServiceJob'],
      keepUnusedDataFor: 60,
    }),
    getReportInvoices: builder.query<GetReportInvoicesResponse, ReportQuery>({
      query: (params) => ({ url: '/reports/invoices', params }),
      providesTags: ['ReportInvoice'],
      keepUnusedDataFor: 60,
    }),
    getReportPayments: builder.query<GetReportPaymentsResponse, ReportQuery>({
      query: (params) => ({ url: '/reports/payments', params }),
      providesTags: ['ReportPayment'],
      keepUnusedDataFor: 60,
    }),
    getReportSales: builder.query<GetReportSalesResponse, ReportQuery>({
      query: (params) => ({ url: '/reports/sales', params }),
      providesTags: ['ReportSale'],
      keepUnusedDataFor: 60,
    }),
    getReportExpenses: builder.query<GetReportExpensesResponse, ReportQuery>({
      query: (params) => ({ url: '/reports/expenses', params }),
      providesTags: ['ReportExpense'],
      keepUnusedDataFor: 60,
    }),
    getReportProfit: builder.query<GetReportProfitResponse, ReportQuery>({
      query: (params) => ({ url: '/reports/profit', params }),
      providesTags: ['ReportProfit'],
      keepUnusedDataFor: 60,
    }),
    getReportUnpaidBalances: builder.query<GetReportUnpaidBalancesResponse, ReportQuery>({
      query: (params) => ({ url: '/reports/unpaid-balances', params }),
      providesTags: ['ReportUnpaidBalance'],
      keepUnusedDataFor: 60,
    }),
    getReportProducts: builder.query<GetReportProductsResponse, ReportQuery>({
      query: (params) => ({ url: '/reports/products', params }),
      providesTags: ['ReportProduct'],
      keepUnusedDataFor: 60,
    }),
    getReportLowStock: builder.query<GetReportLowStockResponse, void>({
      query: () => '/reports/low-stock',
      providesTags: ['ReportLowStock'],
      keepUnusedDataFor: 60,
    }),
  }),
});

export const {
  useGetReportSummaryQuery,
  useGetReportServiceJobsQuery,
  useGetReportInvoicesQuery,
  useGetReportPaymentsQuery,
  useGetReportSalesQuery,
  useGetReportExpensesQuery,
  useGetReportProfitQuery,
  useGetReportUnpaidBalancesQuery,
  useGetReportProductsQuery,
  useGetReportLowStockQuery,
} = reportsApi;
