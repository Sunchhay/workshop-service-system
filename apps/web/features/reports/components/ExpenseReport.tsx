'use client';

import { Receipt } from 'lucide-react';
import { useState } from 'react';

import { AppEmptyState } from '@/components/app/AppEmptyState';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetReportExpensesQuery } from '../api';

const CATEGORY_CLASS: Record<string, string> = {
  SUPPLIES: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
  UTILITIES: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
  RENT: 'bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400',
  SALARY: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
  MAINTENANCE: 'bg-orange-500/10 text-orange-700 border-orange-500/20 dark:text-orange-400',
  OTHER: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
};

const METHOD_CLASS: Record<string, string> = {
  CASH: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
  ABA: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
  BANK_TRANSFER: 'bg-cyan-500/10 text-cyan-700 border-cyan-500/20 dark:text-cyan-400',
  CARD: 'bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400',
  OTHER: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
};

const CATEGORIES = ['SUPPLIES', 'UTILITIES', 'RENT', 'SALARY', 'MAINTENANCE', 'OTHER'];
const METHODS = ['CASH', 'ABA', 'BANK_TRANSFER', 'CARD', 'OTHER'];

function fmtDate(d: string) { return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }); }
function fmtAmt(v: string) { return `$${parseFloat(v).toFixed(2)}`; }

interface Props { fromDate: string; toDate: string; }

export function ExpenseReport({ fromDate, toDate }: Props) {
  const { t } = useTranslation();
  const [category, setCategory] = useState('__all');
  const [method, setMethod] = useState('__all');

  const { data, isLoading } = useGetReportExpensesQuery({
    fromDate: fromDate || undefined, toDate: toDate || undefined,
    category: category === '__all' ? undefined : category,
    paymentMethod: method === '__all' ? undefined : method,
  });
  const expenses = data?.data ?? [];
  const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-40 h-8 text-xs"><SelectValue placeholder={t('reports.allCategories')} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">{t('reports.allCategories')}</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{t(`expenseCategories.${c}` as any)}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger className="w-44 h-8 text-xs"><SelectValue placeholder={t('reports.allMethods')} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">{t('reports.allMethods')}</SelectItem>
            {METHODS.map(m => <SelectItem key={m} value={m}>{t(`paymentMethods.${m}` as any)}</SelectItem>)}
          </SelectContent>
        </Select>
        {!isLoading && expenses.length > 0 && (
          <p className="text-xs text-muted-foreground self-center">
            {expenses.length} {t('reports.totalRecords')} · {t('reports.totalAmount')}: <span className="font-mono font-semibold text-foreground">{fmtAmt(total.toString())}</span>
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
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.expenseNumber')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.category')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.description')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.method')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.createdBy')}</th>
                <th className="text-right px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.amount')}</th>
                <th className="text-right px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.expenseDate')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {expenses.map(e => (
                <tr key={e.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-semibold">{e.expenseNumber}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`text-[10px] py-0 ${CATEGORY_CLASS[e.category] ?? ''}`}>
                      {t(`expenseCategories.${e.category}` as any)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground max-w-[200px] truncate">{e.description}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`text-[10px] py-0 ${METHOD_CLASS[e.method] ?? ''}`}>
                      {t(`paymentMethods.${e.method}` as any)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{e.createdBy.name}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-semibold">{fmtAmt(e.amount)}</td>
                  <td className="px-4 py-3 text-right text-xs text-muted-foreground">{fmtDate(e.expenseDate)}</td>
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
                    <p className="font-mono text-xs font-semibold">{e.expenseNumber}</p>
                    <p className="text-sm font-medium mt-0.5 truncate">{e.description}</p>
                    <p className="text-xs text-muted-foreground">{e.createdBy.name} · {fmtDate(e.expenseDate)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge variant="outline" className={`text-[10px] py-0 ${CATEGORY_CLASS[e.category] ?? ''}`}>
                      {t(`expenseCategories.${e.category}` as any)}
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
