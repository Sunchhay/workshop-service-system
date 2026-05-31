'use client';

import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { Expense, ExpenseStatus, PaymentMethod } from '../types';

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

function formatDate(d: string) {
  return new Date(d).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

interface Props {
  expense: Expense;
  onVoid: (expense: Expense) => void;
}

export function ExpenseMobileCard({ expense, onVoid }: Props) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div
      className="flex items-start gap-3 rounded-xl border bg-card p-4 cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => router.push(`/admin/expenses/${expense.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') router.push(`/admin/expenses/${expense.id}`);
      }}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs text-muted-foreground">{expense.expenseNo}</span>
          <span className="text-xs text-muted-foreground">{formatDate(expense.expenseDate)}</span>
        </div>
        <p className="text-sm font-medium mt-0.5 truncate">{expense.title}</p>
        {expense.category && (
          <p className="text-xs text-muted-foreground mt-0.5">{expense.category}</p>
        )}
        {expense.referenceNo && (
          <p className="text-xs text-muted-foreground">{expense.referenceNo}</p>
        )}
        <div className="flex items-center gap-2 mt-1.5">
          <span className="font-mono text-base font-semibold">
            ${parseFloat(String(expense.amount)).toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          <Badge variant="outline" className={statusClass[expense.expenseStatus]}>
            {t(`expenses.status${expense.expenseStatus.charAt(0) + expense.expenseStatus.slice(1).toLowerCase()}` as Parameters<typeof t>[0])}
          </Badge>
          {expense.paymentMethod && (
            <Badge variant="outline" className={methodClass[expense.paymentMethod]}>
              {t(`paymentMethods.${expense.paymentMethod}`)}
            </Badge>
          )}
        </div>
        {(expense.supplier || expense.mechanic) && (
          <p className="text-xs text-muted-foreground mt-1">
            {expense.supplier?.name ?? expense.mechanic?.name}
          </p>
        )}
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/expenses/${expense.id}`}>{t('expenses.expenseDetail')}</Link>
            </DropdownMenuItem>
            {expense.expenseStatus !== 'VOIDED' && (
              <DropdownMenuItem asChild>
                <Link href={`/admin/expenses/${expense.id}/edit`}>{t('common.edit')}</Link>
              </DropdownMenuItem>
            )}
            {expense.expenseStatus !== 'VOIDED' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onVoid(expense)}
                  className="text-destructive focus:text-destructive"
                >
                  {t('expenses.voidExpense')}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
