import type { ApiResponse } from '@/lib/api/types';

export type PaymentStatus = 'PAID' | 'UNPAID' | 'PARTIAL';
export type SaleStatus = 'COMPLETED' | 'VOIDED';
export type CommissionStatus = 'NONE' | 'UNPAID' | 'PAID';
export type PaymentMethod = 'CASH' | 'ACLEDA' | 'ABA' | 'BAKONG' | 'OTHER';
export type ExpenseStatus = 'PAID' | 'UNPAID' | 'VOIDED';

export interface ReportSale {
  id: string;
  invoiceNo: string;
  grandTotal: string | number;
  paidAmount: string | number;
  balanceAmount: string | number;
  paymentStatus: PaymentStatus;
  saleStatus: SaleStatus;
  createdAt: string;
  customer?: { id: string; name: string; phone?: string } | null;
  mechanic?: { id: string; name: string } | null;
}

export interface ReportPayment {
  id: string;
  saleId: string;
  paymentMethod: PaymentMethod;
  amount: string | number;
  referenceNo?: string | null;
  note?: string | null;
  paidAt: string;
  createdAt: string;
  sale?: { id: string; invoiceNo: string } | null;
}

export interface ReportExpense {
  id: string;
  expenseNo: string;
  title: string;
  category: string;
  amount: string | number;
  paymentMethod: PaymentMethod;
  expenseStatus: ExpenseStatus;
  expenseDate: string;
  supplier?: { id: string; name: string } | null;
  mechanic?: { id: string; name: string } | null;
}

export interface ReportProfitSummary {
  totalSales: number | string;
  totalExpenses: number | string;
  estimatedProfit: number | string;
}

export interface ReportMechanicCommission {
  id: string;
  invoiceNo: string;
  commissionAmount: string | number;
  commissionStatus: CommissionStatus;
  commissionPaidAt?: string | null;
  createdAt: string;
  mechanic?: { id: string; name: string } | null;
  customer?: { id: string; name: string } | null;
}

export interface ReportCustomerDebt {
  id: string;
  invoiceNo: string;
  grandTotal: string | number;
  paidAmount: string | number;
  balanceAmount: string | number;
  paymentStatus: PaymentStatus;
  createdAt: string;
  customer?: { id: string; name: string; phone?: string } | null;
}

export interface ReportServiceUsage {
  serviceId?: string | null;
  nameSnapshot?: string | null;
  name?: string;
  totalQuantity?: number;
  quantity?: number;
  totalRevenue?: string | number;
  total?: string | number;
}

export interface ReportProductSales {
  productId?: string | null;
  nameSnapshot?: string | null;
  name?: string;
  totalQuantity?: number;
  quantity?: number;
  totalRevenue?: string | number;
  total?: string | number;
}

export interface ReportMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ReportListResult<T, TSummary = unknown> {
  items: T[];
  meta?: ReportMeta;
  summary?: TSummary;
}

export interface ReportSalesSummary {
  totalSales: number;
  totalPaid: number;
  totalBalance: number;
  totalOrders: number;
}

export interface ReportExpensesSummary {
  totalExpenses: number;
}

export interface ReportCommissionSummary {
  totalCommission: number;
  paidCommission: number;
  unpaidCommission: number;
}

export interface ReportDebtSummary {
  totalDebt: number;
}

export interface ReportPaymentGrouped {
  paymentMethod: PaymentMethod;
  totalAmount: number;
  transactionCount: number;
}

export interface ReportPaymentsResult extends ReportListResult<ReportPayment> {
  grouped?: ReportPaymentGrouped[];
}

export interface ReportSaleQuery {
  dateFrom?: string;
  dateTo?: string;
  paymentStatus?: PaymentStatus;
  saleStatus?: SaleStatus;
  customerId?: string;
  mechanicId?: string;
  page?: number;
  limit?: number;
}

export interface ReportPaymentQuery {
  dateFrom?: string;
  dateTo?: string;
  paymentMethod?: PaymentMethod;
  page?: number;
  limit?: number;
}

export interface ReportExpenseQuery {
  dateFrom?: string;
  dateTo?: string;
  expenseStatus?: ExpenseStatus;
  paymentMethod?: PaymentMethod;
  supplierId?: string;
  mechanicId?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface ReportCommissionQuery {
  dateFrom?: string;
  dateTo?: string;
  mechanicId?: string;
  commissionStatus?: CommissionStatus;
  page?: number;
  limit?: number;
}

export interface ReportDateQuery {
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export type GetReportSalesResponse = ApiResponse<ReportListResult<ReportSale, ReportSalesSummary> | ReportSale[]>;
export type GetReportPaymentsResponse = ApiResponse<ReportPaymentsResult | ReportPayment[]>;
export type GetReportExpensesResponse = ApiResponse<ReportListResult<ReportExpense, ReportExpensesSummary> | ReportExpense[]>;
export type GetReportProfitSummaryResponse = ApiResponse<ReportProfitSummary>;
export type GetReportMechanicCommissionsResponse = ApiResponse<ReportListResult<ReportMechanicCommission, ReportCommissionSummary> | ReportMechanicCommission[]>;
export type GetReportCustomerDebtsResponse = ApiResponse<ReportListResult<ReportCustomerDebt, ReportDebtSummary> | ReportCustomerDebt[]>;
export type GetReportServiceUsageResponse = ApiResponse<ReportListResult<ReportServiceUsage> | ReportServiceUsage[]>;
export type GetReportProductSalesResponse = ApiResponse<ReportListResult<ReportProductSales> | ReportProductSales[]>;
