'use client';

import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useDeleteExpenseMutation, useGetExpenseQuery } from '../api';
import type { ExpenseCategory, ExpensePaymentMethod } from '../types';
import { DeleteExpenseDialog } from './dialogs/DeleteExpenseDialog';

const categoryClass: Record<ExpenseCategory, string> = {
  SUPPLIES: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
  UTILITIES: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
  RENT: 'bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400',
  SALARY: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
  MAINTENANCE: 'bg-orange-500/10 text-orange-700 border-orange-500/20 dark:text-orange-400',
  OTHER: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
};

const methodClass: Record<ExpensePaymentMethod, string> = {
  CASH: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
  ABA: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
  BANK_TRANSFER: 'bg-cyan-500/10 text-cyan-700 border-cyan-500/20 dark:text-cyan-400',
  CARD: 'bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400',
  OTHER: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
};

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function ExpenseDetailPage({ id }: { id: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading } = useGetExpenseQuery(id);
  const [deleteExpense, { isLoading: isDeleting }] = useDeleteExpenseMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const expense = data?.data;

  const handleDeleteConfirm = async () => {
    try {
      await deleteExpense(id).unwrap();
      toast.success(t('expenses.deleteSuccess'));
      router.replace('/admin/expenses');
    } catch {
      toast.error(t('common.error'));
    }
  };

  return (
    <div className="space-y-4">
      <div className="hidden md:flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{t('expenses.expenseDetail')}</h2>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-64" />
          </CardContent>
        </Card>
      ) : expense ? (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <CardTitle className="font-mono">{expense.expenseNumber}</CardTitle>
                  <Badge variant="outline" className={categoryClass[expense.category]}>
                    {t(`expenseCategories.${expense.category}`)}
                  </Badge>
                  <Badge variant="outline" className={methodClass[expense.method]}>
                    {t(`paymentMethods.${expense.method}`)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1 font-medium">
                  {expense.description}
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/expenses/${id}/edit`}>
                    <Pencil className="h-3.5 w-3.5 mr-1.5" />
                    {t('common.edit')}
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <Separator />

            {/* Amount — prominent */}
            <div>
              <p className="text-xs text-muted-foreground mb-1">{t('expenses.amount')}</p>
              <p className="text-2xl font-mono font-bold">
                ${parseFloat(expense.amount).toFixed(2)}
              </p>
            </div>

            <Separator />

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
              <div>
                <p className="text-muted-foreground text-xs mb-1">{t('expenses.expenseDate')}</p>
                <p>{formatDate(expense.expenseDate)}</p>
              </div>
              {expense.referenceNo && (
                <div>
                  <p className="text-muted-foreground text-xs mb-1">{t('expenses.referenceNo')}</p>
                  <p className="font-mono">{expense.referenceNo}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground text-xs mb-1">{t('expenses.createdBy')}</p>
                <p>{expense.createdBy.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">{t('expenses.createdAt')}</p>
                <p>{formatDate(expense.createdAt)}</p>
              </div>
            </div>

            {/* Notes */}
            {expense.notes && (
              <>
                <Separator />
                <div className="text-sm">
                  <p className="text-muted-foreground text-xs mb-1">{t('expenses.notes')}</p>
                  <p className="whitespace-pre-line text-muted-foreground">{expense.notes}</p>
                </div>
              </>
            )}

            <Separator />

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteDialogOpen(true)}
                className="border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                {t('common.delete')}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <p className="text-muted-foreground">{t('common.error')}</p>
      )}

      {expense && (
        <DeleteExpenseDialog
          expense={expense}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
