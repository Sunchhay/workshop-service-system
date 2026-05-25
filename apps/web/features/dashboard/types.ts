import type { ApiResponse } from '@/lib/api/types';

export interface DashboardSummary {
  totalCustomers: number;
  todayNewJobs: number;
  pendingJobs: number;
  inProgressJobs: number;
  completedJobs: number;
  invoiceTotalToday: string;
  invoiceTotalMonth: string;
  paymentsTotalToday: string;
  paymentsTotalMonth: string;
  totalUnpaidAmount: string;
  expensesToday: string;
  expensesMonth: string;
  lowStockCount: number;
}

export interface DashboardServiceJobCustomer {
  id: string;
  name: string;
  phone: string;
}

export interface DashboardServiceJob {
  id: string;
  jobCode: string;
  status: string;
  priority: string;
  createdAt: string;
  partDescription: string;
  customer: DashboardServiceJobCustomer;
}

export interface DashboardTransactionInvoice {
  id: string;
  invoiceNumber: string;
}

export interface DashboardTransactionCustomer {
  id: string;
  name: string;
}

export interface DashboardTransaction {
  id: string;
  paymentNumber: string;
  amount: string;
  method: string;
  paidAt: string;
  customer: DashboardTransactionCustomer | null;
  invoice: DashboardTransactionInvoice;
}

export interface LowStockProduct {
  id: string;
  code: string;
  name: string;
  unit: string;
  stockQuantity: number;
  reorderLevel: number;
}

export type GetDashboardSummaryResponse = ApiResponse<DashboardSummary>;
export type GetRecentServiceJobsResponse = ApiResponse<DashboardServiceJob[]>;
export type GetRecentTransactionsResponse = ApiResponse<DashboardTransaction[]>;
export type GetLowStockProductsResponse = ApiResponse<LowStockProduct[]>;
