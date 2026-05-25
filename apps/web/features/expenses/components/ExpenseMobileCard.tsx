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

import type { Expense, ExpenseCategory, ExpensePaymentMethod } from '../types';

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

function formatDate(d: string) {
  return new Date(d).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

interface Props {
  expense: Expense;
  onDelete: (expense: Expense) => void;
}

export function ExpenseMobileCard({ expense, onDelete }: Props) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div
      className="flex items-start gap-3 rounded-xl border bg-card p-4 shadow-sm cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => router.push(`/admin/expenses/${expense.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') router.push(`/admin/expenses/${expense.id}`);
      }}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs text-muted-foreground">{expense.expenseNumber}</span>
        </div>
        <p className="text-sm font-medium mt-0.5 truncate">{expense.description}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatDate(expense.expenseDate)}
          {expense.referenceNo && ` · ${expense.referenceNo}`}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="font-mono text-base font-semibold">
            ${parseFloat(expense.amount).toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          <Badge variant="outline" className={categoryClass[expense.category]}>
            {t(`expenseCategories.${expense.category}`)}
          </Badge>
          <Badge variant="outline" className={methodClass[expense.method]}>
            {t(`paymentMethods.${expense.method}`)}
          </Badge>
        </div>
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
            <DropdownMenuItem asChild>
              <Link href={`/admin/expenses/${expense.id}/edit`}>{t('common.edit')}</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(expense)}
              className="text-destructive focus:text-destructive"
            >
              {t('common.delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
