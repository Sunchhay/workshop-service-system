import type { ApiResponse } from '@/lib/api/types';

export type ExpenseCategory = 'SUPPLIES' | 'UTILITIES' | 'RENT' | 'SALARY' | 'MAINTENANCE' | 'OTHER';
export type ExpensePaymentMethod = 'CASH' | 'ABA' | 'BANK_TRANSFER' | 'CARD' | 'OTHER';

export interface ExpenseCreatedBy {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  expenseNumber: string;
  category: ExpenseCategory;
  description: string;
  amount: string;
  method: ExpensePaymentMethod;
  referenceNo: string | null;
  notes: string | null;
  expenseDate: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  createdBy: ExpenseCreatedBy;
}

export interface CreateExpenseRequest {
  category: ExpenseCategory;
  description: string;
  amount: number;
  method: ExpensePaymentMethod;
  referenceNo?: string;
  notes?: string;
  expenseDate?: string;
}

export interface UpdateExpenseRequest {
  category?: ExpenseCategory;
  description?: string;
  amount?: number;
  method?: ExpensePaymentMethod;
  referenceNo?: string;
  notes?: string;
  expenseDate?: string;
}

export interface ExpenseQuery {
  search?: string;
  category?: ExpenseCategory;
  method?: ExpensePaymentMethod;
  createdById?: string;
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
  totalAmount: string;
}

export interface GetExpensesResponse {
  success: boolean;
  data: Expense[];
  meta: ExpensesMeta;
}

export type GetExpenseResponse = ApiResponse<Expense>;
