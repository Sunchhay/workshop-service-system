import type { ApiResponse } from '@/lib/api/types';

export interface DashboardSummary {
  totalCustomers: number;
  salesTodayCount: number;
  salesMonthCount: number;
  invoiceTotalToday: string;
  invoiceTotalMonth: string;
  paymentsTotalToday: string;
  paymentsTotalMonth: string;
  totalUnpaidAmount: string;
  expensesToday: string;
  expensesMonth: string;
  lowStockCount: number;
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
export type GetRecentTransactionsResponse = ApiResponse<DashboardTransaction[]>;
export type GetLowStockProductsResponse = ApiResponse<LowStockProduct[]>;
