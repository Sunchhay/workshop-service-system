import type { ApiPaginatedResponse, ApiResponse } from '@/lib/api/types';

export type PaymentMethod = 'CASH' | 'ACLEDA' | 'ABA' | 'BAKONG' | 'OTHER';
export type ExpenseStatus = 'PAID' | 'UNPAID' | 'VOIDED';

export interface Expense {
  id: string;
  expenseNo: string;
  title: string;
  category?: string | null;
  amount: string | number;
  paymentMethod?: PaymentMethod | null;
  expenseStatus: ExpenseStatus;
  supplierId?: string | null;
  mechanicId?: string | null;
  referenceNo?: string | null;
  imageUrl?: string | null;
  note?: string | null;
  expenseDate: string;
  createdById: string;
  voidReason?: string | null;
  voidedAt?: string | null;
  voidedById?: string | null;
  createdAt: string;
  updatedAt: string;
  supplier?: { id: string; name: string; phone?: string | null } | null;
  mechanic?: { id: string; name: string; phone?: string | null; customerType?: string } | null;
  createdBy?: { id: string; name: string } | null;
  voidedBy?: { id: string; name: string } | null;
}

export interface CreateExpenseRequest {
  title: string;
  amount: number;
  expenseDate: string;
  category?: string;
  paymentMethod?: PaymentMethod;
  expenseStatus?: ExpenseStatus;
  supplierId?: string;
  mechanicId?: string;
  referenceNo?: string;
  imageUrl?: string;
  note?: string;
}

export interface UpdateExpenseRequest {
  title?: string;
  amount?: number;
  expenseDate?: string;
  category?: string;
  paymentMethod?: PaymentMethod;
  expenseStatus?: ExpenseStatus;
  supplierId?: string;
  mechanicId?: string;
  referenceNo?: string;
  imageUrl?: string;
  note?: string;
}

export interface VoidExpenseRequest {
  voidReason: string;
}

export interface ExpenseQuery {
  search?: string;
  expenseStatus?: ExpenseStatus;
  paymentMethod?: PaymentMethod;
  category?: string;
  supplierId?: string;
  mechanicId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface ExpensesMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  totalAmount?: string;
}

export type GetExpensesResponse = ApiPaginatedResponse<Expense> & { meta: ExpensesMeta };
export type GetExpenseResponse = ApiResponse<Expense>;
