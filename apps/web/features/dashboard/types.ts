import type { ApiResponse } from '@/lib/api/types';

export interface DashboardSummary {
  todaySales: number;
  todayOrders: number;
  thisMonthSales: number;
  totalCustomers: number;
  unpaidSalesAmount: number;
  unpaidCommissionAmount: number;
  todayExpenses: number;
  thisMonthExpenses: number;
}

export interface DashboardRecentSale {
  id: string;
  invoiceNo: string;
  grandTotal: number | string;
  paymentStatus: string;
  saleStatus: string;
  createdAt: string;
  customer?: { id: string; name: string } | null;
}

export interface DashboardTopService {
  serviceId: string;
  name: string;
  quantity: number;
  total: number | string;
}

export interface DashboardTopProduct {
  productId: string;
  name: string;
  quantity: number;
  total: number | string;
}

export interface DashboardPaymentSummaryItem {
  paymentMethod: string;
  total: number | string;
  count: number;
}

export type GetDashboardSummaryResponse = ApiResponse<DashboardSummary>;
export type GetRecentSalesResponse = ApiResponse<DashboardRecentSale[]>;
export type GetTopServicesResponse = ApiResponse<DashboardTopService[]>;
export type GetTopProductsResponse = ApiResponse<DashboardTopProduct[]>;
export type GetPaymentSummaryResponse = ApiResponse<DashboardPaymentSummaryItem[]>;
