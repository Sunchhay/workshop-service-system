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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  expenses: Expense[];
  onVoid: (expense: Expense) => void;
}

export function ExpenseTable({ expenses, onVoid }: Props) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('expenses.expenseNo')}</TableHead>
            <TableHead>{t('expenses.expenseDate')}</TableHead>
            <TableHead>{t('expenses.title')}</TableHead>
            <TableHead>{t('expenses.category')}</TableHead>
            <TableHead>{t('expenses.amount')}</TableHead>
            <TableHead>{t('expenses.paymentMethod')}</TableHead>
            <TableHead>{t('expenses.expenseStatus')}</TableHead>
            <TableHead>{t('expenses.supplierMechanic')}</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground py-10">
                {t('expenses.noExpenses')}
              </TableCell>
            </TableRow>
          ) : (
            expenses.map((expense) => (
              <TableRow
                key={expense.id}
                className="cursor-pointer"
                onClick={() => router.push(`/admin/expenses/${expense.id}`)}
              >
                <TableCell className="font-mono text-sm font-medium whitespace-nowrap">
                  {expense.expenseNo}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                  {formatDate(expense.expenseDate)}
                </TableCell>
                <TableCell>
                  <p className="text-sm font-medium max-w-[180px] truncate">{expense.title}</p>
                  {expense.referenceNo && (
                    <p className="text-xs text-muted-foreground">{expense.referenceNo}</p>
                  )}
                </TableCell>
                <TableCell>
                  {expense.category ? (
                    <span className="text-sm text-muted-foreground">{expense.category}</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="font-mono text-sm font-semibold whitespace-nowrap">
                  ${parseFloat(String(expense.amount)).toFixed(2)}
                </TableCell>
                <TableCell>
                  {expense.paymentMethod ? (
                    <Badge variant="outline" className={methodClass[expense.paymentMethod]}>
                      {t(`paymentMethods.${expense.paymentMethod}`)}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusClass[expense.expenseStatus]}>
                    {t(`expenses.status${expense.expenseStatus.charAt(0) + expense.expenseStatus.slice(1).toLowerCase()}` as Parameters<typeof t>[0])}
                  </Badge>
                </TableCell>
                <TableCell>
                  {expense.supplier ? (
                    <p className="text-sm text-muted-foreground truncate max-w-[120px]">
                      {expense.supplier.name}
                    </p>
                  ) : expense.mechanic ? (
                    <p className="text-sm text-muted-foreground truncate max-w-[120px]">
                      {expense.mechanic.name}
                    </p>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
