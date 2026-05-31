'use client';

import { Receipt } from 'lucide-react';
import { useState } from 'react';

import { AppEmptyState } from '@/components/app/AppEmptyState';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';
import type { TranslationKey } from '@/lib/i18n/TranslationContext';

import { useGetReportExpensesQuery } from '../api';
import { getReportItems, getReportSummary } from '../reportData';
import type { ExpenseStatus, PaymentMethod } from '../types';
import { ReportSummaryCard } from './ReportSummaryCard';

const METHOD_CLASS: Record<string, string> = {
  CASH: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
  ACLEDA: 'bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400',
  ABA: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
  BAKONG: 'bg-cyan-500/10 text-cyan-700 border-cyan-500/20 dark:text-cyan-400',
  OTHER: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
};

const EXPENSE_STATUS_CLASS: Record<string, string> = {
  PAID: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
  UNPAID: 'bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400',
  VOIDED: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
};

const METHODS: PaymentMethod[] = ['CASH', 'ACLEDA', 'ABA', 'BAKONG', 'OTHER'];
const EXPENSE_STATUSES: ExpenseStatus[] = ['PAID', 'UNPAID', 'VOIDED'];
const METHOD_LABELS: Record<PaymentMethod, TranslationKey> = {
  CASH: 'paymentMethods.CASH',
  ACLEDA: 'paymentMethods.ACLEDA',
  ABA: 'paymentMethods.ABA',
  BAKONG: 'paymentMethods.BAKONG',
  OTHER: 'paymentMethods.OTHER',
};
const EXPENSE_STATUS_LABELS: Record<ExpenseStatus, TranslationKey> = {
  PAID: 'expenseStatuses.PAID',
  UNPAID: 'expenseStatuses.UNPAID',
  VOIDED: 'expenseStatuses.VOIDED',
};
const LIMIT = 20;

function fmtDate(d: string) { return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }); }
function fmtAmt(v: string | number) { return `$${parseFloat(String(v)).toFixed(2)}`; }

interface Props { fromDate: string; toDate: string; }

export function ExpenseReport({ fromDate, toDate }: Props) {
  const { t } = useTranslation();
  const [expenseStatus, setExpenseStatus] = useState('__all');
  const [method, setMethod] = useState('__all');
  const [supplierId, setSupplierId] = useState('');
  const [mechanicId, setMechanicId] = useState('');
  const [category, setCategory] = useState('');

  const { data, isLoading } = useGetReportExpensesQuery({
    dateFrom: fromDate || undefined,
    dateTo: toDate || undefined,
    expenseStatus: expenseStatus === '__all' ? undefined : expenseStatus as ExpenseStatus,
    paymentMethod: method === '__all' ? undefined : method as PaymentMethod,
    supplierId: supplierId.trim() || undefined,
    mechanicId: mechanicId.trim() || undefined,
    category: category.trim() || undefined,
    page: 1,
    limit: LIMIT,
  });
  const expenses = getReportItems(data?.data);
  const summary = getReportSummary(data?.data);
  const total = summary?.totalExpenses ?? expenses
    .filter((e) => e.expenseStatus !== 'VOIDED')
    .reduce((sum, e) => sum + parseFloat(String(e.amount)), 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ReportSummaryCard
          title={t('reports.totalExpenses')}
          value={isLoading ? '—' : fmtAmt(total)}
          icon={Receipt}
          iconClass="bg-red-500/10 text-red-600 dark:text-red-400"
          isLoading={isLoading}
        />
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <Select value={expenseStatus} onValueChange={setExpenseStatus}>
          <SelectTrigger className="w-40 h-8 text-xs"><SelectValue placeholder={t('reports.allExpenseStatuses')} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">{t('reports.allExpenseStatuses')}</SelectItem>
            {EXPENSE_STATUSES.map(s => <SelectItem key={s} value={s}>{t(EXPENSE_STATUS_LABELS[s])}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input
          value={supplierId}
          onChange={(e) => setSupplierId(e.target.value)}
          placeholder={t('reports.supplierId')}
          className="w-40 h-8 text-xs"
        />
        <Input
          value={mechanicId}
          onChange={(e) => setMechanicId(e.target.value)}
          placeholder={t('reports.mechanicId')}
          className="w-40 h-8 text-xs"
        />
        <Input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder={t('reports.category')}
          className="w-40 h-8 text-xs"
        />
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger className="w-44 h-8 text-xs"><SelectValue placeholder={t('reports.allMethods')} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">{t('reports.allMethods')}</SelectItem>
            {METHODS.map(m => <SelectItem key={m} value={m}>{t(METHOD_LABELS[m])}</SelectItem>)}
          </SelectContent>
        </Select>
        {!isLoading && expenses.length > 0 && (
          <p className="text-xs text-muted-foreground self-center">
            {expenses.length} {t('reports.totalRecords')} · {t('reports.totalAmount')}: <span className="font-mono font-semibold text-foreground">{fmtAmt(total)}</span>
          </p>
        )}
      </div>

      {isLoading && <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}</div>}
      {!isLoading && expenses.length === 0 && <AppEmptyState icon={Receipt} title={t('reports.noData')} description={t('reports.noDataDesc')} />}

      {!isLoading && expenses.length > 0 && (
        <div className="hidden md:block rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.expenseNo')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.date')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.title')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.category')}</th>
                <th className="text-right px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.amount')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.paymentMethod')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.status')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.supplierMechanic')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {expenses.map(e => (
                <tr key={e.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-semibold">{e.expenseNo}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{fmtDate(e.expenseDate)}</td>
                  <td className="px-4 py-3 text-sm max-w-[160px] truncate">{e.title}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{e.category}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-semibold">{fmtAmt(e.amount)}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`text-[10px] py-0 ${METHOD_CLASS[e.paymentMethod] ?? ''}`}>
                      {t(METHOD_LABELS[e.paymentMethod])}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                  <Badge variant="outline" className={`text-[10px] py-0 ${EXPENSE_STATUS_CLASS[e.expenseStatus] ?? ''}`}>
                      {t(EXPENSE_STATUS_LABELS[e.expenseStatus])}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{e.supplier?.name ?? e.mechanic?.name ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && expenses.length > 0 && (
        <div className="md:hidden space-y-3">
          {expenses.map(e => (
            <Card key={e.id}>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs font-semibold">{e.expenseNo}</p>
                    <p className="text-sm font-medium mt-0.5 truncate">{e.title}</p>
                    <p className="text-xs text-muted-foreground">{e.category} · {fmtDate(e.expenseDate)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge variant="outline" className={`text-[10px] py-0 ${EXPENSE_STATUS_CLASS[e.expenseStatus] ?? ''}`}>
                      {t(EXPENSE_STATUS_LABELS[e.expenseStatus])}
                    </Badge>
                    <p className="font-mono text-sm font-semibold">{fmtAmt(e.amount)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
