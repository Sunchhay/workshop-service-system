import { baseApi } from '@/lib/api/baseApi';

import type {
  CreateExpenseRequest,
  ExpenseQuery,
  GetExpenseResponse,
  GetExpensesResponse,
  UpdateExpenseRequest,
  VoidExpenseRequest,
} from './types';

const expensesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExpenses: builder.query<GetExpensesResponse, ExpenseQuery>({
      query: ({
        search,
        expenseStatus,
        paymentMethod,
        category,
        supplierId,
        mechanicId,
        dateFrom,
        dateTo,
        page = 1,
        limit = 20,
      }) => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (expenseStatus) params.set('expenseStatus', expenseStatus);
        if (paymentMethod) params.set('paymentMethod', paymentMethod);
        if (category) params.set('category', category);
        if (supplierId) params.set('supplierId', supplierId);
        if (mechanicId) params.set('mechanicId', mechanicId);
        if (dateFrom) params.set('dateFrom', dateFrom);
        if (dateTo) params.set('dateTo', dateTo);
        params.set('page', String(page));
        params.set('limit', String(limit));
        return `/expenses?${params}`;
      },
      providesTags: ['Expense'],
    }),
    getExpense: builder.query<GetExpenseResponse, string>({
      query: (id) => `/expenses/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Expense', id }],
    }),
    createExpense: builder.mutation<GetExpenseResponse, CreateExpenseRequest>({
      query: (body) => ({ url: '/expenses', method: 'POST', body }),
      invalidatesTags: ['Expense'],
    }),
    updateExpense: builder.mutation<GetExpenseResponse, { id: string; data: UpdateExpenseRequest }>({
      query: ({ id, data }) => ({ url: `/expenses/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (_result, _error, { id }) => ['Expense', { type: 'Expense', id }],
    }),
    voidExpense: builder.mutation<GetExpenseResponse, { id: string; data: VoidExpenseRequest }>({
      query: ({ id, data }) => ({ url: `/expenses/${id}/void`, method: 'POST', body: data }),
      invalidatesTags: (_result, _error, { id }) => ['Expense', { type: 'Expense', id }],
    }),
  }),
});

export const {
  useGetExpensesQuery,
  useGetExpenseQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useVoidExpenseMutation,
} = expensesApi;
