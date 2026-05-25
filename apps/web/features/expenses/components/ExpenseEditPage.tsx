'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetExpenseQuery, useUpdateExpenseMutation } from '../api';
import type { CreateExpenseRequest, UpdateExpenseRequest } from '../types';
import type { ExpenseFormValues } from './ExpenseForm';
import { ExpenseForm } from './ExpenseForm';

export function ExpenseEditPage({ id }: { id: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading } = useGetExpenseQuery(id);
  const [updateExpense, { isLoading: isSaving }] = useUpdateExpenseMutation();

  const expense = data?.data;

  const defaultValues: Partial<ExpenseFormValues> | undefined = expense
    ? {
        category: expense.category,
        description: expense.description,
        amount: expense.amount,
        method: expense.method,
        expenseDate: expense.expenseDate.slice(0, 10),
        referenceNo: expense.referenceNo ?? '',
        notes: expense.notes ?? '',
      }
    : undefined;

  const handleSubmit = async (payload: CreateExpenseRequest | UpdateExpenseRequest) => {
    try {
      await updateExpense({ id, data: payload as UpdateExpenseRequest }).unwrap();
      toast.success(t('expenses.updateSuccess'));
      router.replace(`/admin/expenses/${id}`);
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ?? t('common.error');
      toast.error(message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="hidden md:flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{t('expenses.editExpense')}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('expenses.expenseDetail')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : expense ? (
            <ExpenseForm
              mode="edit"
              defaultValues={defaultValues}
              onSubmit={handleSubmit}
              isLoading={isSaving}
            />
          ) : (
            <p className="text-muted-foreground">{t('common.error')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
