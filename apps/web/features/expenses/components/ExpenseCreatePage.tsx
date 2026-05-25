'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useCreateExpenseMutation } from '../api';
import type { CreateExpenseRequest, UpdateExpenseRequest } from '../types';
import { ExpenseForm } from './ExpenseForm';

export function ExpenseCreatePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [createExpense, { isLoading }] = useCreateExpenseMutation();

  const handleSubmit = async (payload: CreateExpenseRequest | UpdateExpenseRequest) => {
    try {
      const result = await createExpense(payload as CreateExpenseRequest).unwrap();
      toast.success(t('expenses.createSuccess'));
      router.replace(`/admin/expenses/${result.data.id}`);
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
        <h2 className="text-xl font-semibold">{t('expenses.createExpense')}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('expenses.expenseDetail')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseForm mode="create" onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
