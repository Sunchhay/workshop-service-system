import type { ApiResponse } from '@/lib/api/types';

export interface ReportSummary {
  totalCustomers: number;
  totalInvoices: number;
  invoiceTotal: string;
  paymentTotal: string;
  unpaidTotal: string;
  salesTotal: string;
  expenseTotal: string;
  profitEstimate: string;
  lowStockCount: number;
}

export interface ReportInvoice {
  id: string;
  invoiceNumber: string;
  status: string;
  subtotal: string;
  discountAmount: string;
  taxAmount: string;
  totalAmount: string;
  paidAmount: string;
  dueAmount: string;
  issuedAt: string;
  dueDate: string | null;
  customer: { id: string; name: string; phone: string };
}

export interface ReportPayment {
  id: string;
  paymentNumber: string;
  amount: string;
  method: string;
  referenceNo: string | null;
  paidAt: string;
  invoice: { id: string; invoiceNumber: string };
  customer: { id: string; name: string };
  createdBy: { id: string; name: string };
}

export interface ReportSale {
  id: string;
  saleNumber: string;
  status: string;
  subtotal: string;
  discountAmount: string;
  totalAmount: string;
  soldAt: string;
  customer: { id: string; name: string } | null;
  _count: { items: number };
}

export interface ReportExpense {
  id: string;
  expenseNumber: string;
  category: string;
  description: string;
  amount: string;
  method: string;
  referenceNo: string | null;
  expenseDate: string;
  createdBy: { id: string; name: string };
}

export interface ReportProfit {
  invoiceTotal: string;
  salesTotal: string;
  paymentReceived: string;
  expenseTotal: string;
  estimatedProfit: string;
  unpaidAmount: string;
}

export interface ReportUnpaidInvoice {
  id: string;
  invoiceNumber: string;
  status: string;
  totalAmount: string;
  paidAmount: string;
  dueAmount: string;
  issuedAt: string;
  dueDate: string | null;
  customer: { id: string; name: string; phone: string };
}

export interface ReportProduct {
  id: string;
  code: string;
  name: string;
  category: string | null;
  componentPartType: string | null;
  supplier: string | null;
  stockQuantity: number;
  reorderLevel: number;
  costPrice: string;
  sellingPrice: string;
  isActive: boolean;
  isLowStock: boolean;
}

export interface ReportLowStockProduct {
  id: string;
  code: string;
  name: string;
  category: string | null;
  componentPartType: string | null;
  supplier: string | null;
  stockQuantity: number;
  reorderLevel: number;
}

export interface ReportQuery {
  fromDate?: string;
  toDate?: string;
  customerId?: string;
  status?: string;
  paymentMethod?: string;
  category?: string;
  componentPartType?: string;
  isActive?: boolean;
  isLowStock?: boolean;
}

export type GetReportSummaryResponse = ApiResponse<ReportSummary>;
export type GetReportInvoicesResponse = ApiResponse<ReportInvoice[]>;
export type GetReportPaymentsResponse = ApiResponse<ReportPayment[]>;
export type GetReportSalesResponse = ApiResponse<ReportSale[]>;
export type GetReportExpensesResponse = ApiResponse<ReportExpense[]>;
export type GetReportProfitResponse = ApiResponse<ReportProfit>;
export type GetReportUnpaidBalancesResponse = ApiResponse<ReportUnpaidInvoice[]>;
export type GetReportProductsResponse = ApiResponse<ReportProduct[]>;
export type GetReportLowStockResponse = ApiResponse<ReportLowStockProduct[]>;
