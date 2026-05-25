import { baseApi } from '@/lib/api/baseApi';

import type {
  CreateExpenseRequest,
  ExpenseQuery,
  GetExpenseResponse,
  GetExpensesResponse,
  UpdateExpenseRequest,
} from './types';

const expensesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExpenses: builder.query<GetExpensesResponse, ExpenseQuery>({
      query: ({ search, category, method, createdById, dateFrom, dateTo, page = 1, limit = 20 }) => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (category) params.set('category', category);
        if (method) params.set('method', method);
        if (createdById) params.set('createdById', createdById);
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
    deleteExpense: builder.mutation<{ success: boolean; data: null }, string>({
      query: (id) => ({ url: `/expenses/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Expense'],
    }),
  }),
});

export const {
  useGetExpensesQuery,
  useGetExpenseQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} = expensesApi;
