'use client';

import { ArrowLeft, Pencil } from 'lucide-react';
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

import { useGetExpenseQuery, useVoidExpenseMutation } from '../api';
import type { ExpenseStatus, PaymentMethod } from '../types';
import { VoidExpenseDialog } from './dialogs/VoidExpenseDialog';

const statusClass: Record<ExpenseStatus, string> = {
  PAID: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
  UNPAID: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
  VOIDED: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
};

const methodClass: Record<PaymentMethod, string> = {
  CASH: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
  ACLEDA: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
  ABA: 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20 dark:text-indigo-400',
  BAKONG: 'bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400',
  OTHER: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
};

function formatDate(d: string | null | undefined) {
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
  const [voidExpense, { isLoading: isVoiding }] = useVoidExpenseMutation();
  const [voidDialogOpen, setVoidDialogOpen] = useState(false);

  const expense = data?.data;

  const handleVoidConfirm = async (voidReason: string) => {
    try {
      await voidExpense({ id, data: { voidReason } }).unwrap();
      toast.success(t('expenses.voidSuccess'));
      setVoidDialogOpen(false);
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string } })?.data?.message ?? t('common.error');
      toast.error(message);
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
                  <CardTitle className="font-mono">{expense.expenseNo}</CardTitle>
                  <Badge variant="outline" className={statusClass[expense.expenseStatus]}>
                    {t(`expenses.status${expense.expenseStatus.charAt(0) + expense.expenseStatus.slice(1).toLowerCase()}` as Parameters<typeof t>[0])}
                  </Badge>
                  {expense.paymentMethod && (
                    <Badge variant="outline" className={methodClass[expense.paymentMethod]}>
                      {t(`paymentMethods.${expense.paymentMethod}`)}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1 font-medium">{expense.title}</p>
                {expense.category && (
                  <p className="text-xs text-muted-foreground mt-0.5">{expense.category}</p>
                )}
              </div>
              {expense.expenseStatus !== 'VOIDED' && (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/expenses/${id}/edit`}>
                    <Pencil className="h-3.5 w-3.5 mr-1.5" />
                    {t('common.edit')}
                  </Link>
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <Separator />

            <div>
              <p className="text-xs text-muted-foreground mb-1">{t('expenses.amount')}</p>
              <p className="text-2xl font-mono font-bold">
                ${parseFloat(String(expense.amount)).toFixed(2)}
              </p>
            </div>

            <Separator />

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
              {expense.supplier && (
                <div>
                  <p className="text-muted-foreground text-xs mb-1">{t('expenses.supplier')}</p>
                  <p>{expense.supplier.name}</p>
                </div>
              )}
              {expense.mechanic && (
                <div>
                  <p className="text-muted-foreground text-xs mb-1">{t('expenses.mechanic')}</p>
                  <p>{expense.mechanic.name}</p>
                </div>
              )}
              {expense.createdBy && (
                <div>
                  <p className="text-muted-foreground text-xs mb-1">{t('expenses.createdBy')}</p>
                  <p>{expense.createdBy.name}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground text-xs mb-1">{t('expenses.createdAt')}</p>
                <p>{formatDate(expense.createdAt)}</p>
              </div>
            </div>

            {expense.imageUrl && (
              <>
                <Separator />
                <div>
                  <p className="text-muted-foreground text-xs mb-2">{t('expenses.imageUrl')}</p>
                  <img
                    src={expense.imageUrl}
                    alt={expense.title}
                    className="max-h-48 rounded-lg border object-contain"
                  />
                </div>
              </>
            )}

            {expense.note && (
              <>
                <Separator />
                <div className="text-sm">
                  <p className="text-muted-foreground text-xs mb-1">{t('expenses.note')}</p>
                  <p className="whitespace-pre-line text-muted-foreground">{expense.note}</p>
                </div>
              </>
            )}

            {expense.expenseStatus === 'VOIDED' && expense.voidReason && (
              <>
                <Separator />
                <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-3 text-sm">
                  <p className="text-destructive font-medium text-xs mb-1">{t('expenses.voidReason')}</p>
                  <p className="text-muted-foreground">{expense.voidReason}</p>
                  {expense.voidedAt && (
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(expense.voidedAt)}</p>
                  )}
                </div>
              </>
            )}

            {expense.expenseStatus !== 'VOIDED' && (
              <>
                <Separator />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVoidDialogOpen(true)}
                  className="border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  {t('expenses.voidExpense')}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <p className="text-muted-foreground">{t('common.error')}</p>
      )}

      {expense && (
        <VoidExpenseDialog
          expense={expense}
          open={voidDialogOpen}
          onOpenChange={setVoidDialogOpen}
          onConfirm={handleVoidConfirm}
          isLoading={isVoiding}
        />
      )}
    </div>
  );
}
