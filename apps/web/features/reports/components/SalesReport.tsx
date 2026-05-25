'use client';

import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

import { AppEmptyState } from '@/components/app/AppEmptyState';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetReportSalesQuery } from '../api';

const STATUS_CLASS: Record<string, string> = {
  DRAFT: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
  COMPLETED: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
  CANCELLED: 'bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400',
};

const STATUSES = ['DRAFT', 'COMPLETED', 'CANCELLED'];
function fmtDate(d: string) { return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }); }
function fmtAmt(v: string) { return `$${parseFloat(v).toFixed(2)}`; }

interface Props { fromDate: string; toDate: string; }

export function SalesReport({ fromDate, toDate }: Props) {
  const { t } = useTranslation();
  const [status, setStatus] = useState('__all');

  const { data, isLoading } = useGetReportSalesQuery({
    fromDate: fromDate || undefined, toDate: toDate || undefined,
    status: status === '__all' ? undefined : status,
  });
  const sales = data?.data ?? [];
  const total = sales.filter(s => s.status === 'COMPLETED').reduce((sum, s) => sum + parseFloat(s.totalAmount), 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40 h-8 text-xs">
            <SelectValue placeholder={t('reports.allStatuses')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">{t('reports.allStatuses')}</SelectItem>
            {STATUSES.map(s => <SelectItem key={s} value={s}>{t(`saleStatuses.${s}` as any)}</SelectItem>)}
          </SelectContent>
        </Select>
        {!isLoading && sales.length > 0 && (
          <p className="text-xs text-muted-foreground self-center">
            {sales.length} {t('reports.totalRecords')} · {t('reports.salesTotal')}: <span className="font-mono font-semibold text-foreground">{fmtAmt(total.toString())}</span>
          </p>
        )}
      </div>

      {isLoading && <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}</div>}
      {!isLoading && sales.length === 0 && <AppEmptyState icon={ShoppingCart} title={t('reports.noData')} description={t('reports.noDataDesc')} />}

      {!isLoading && sales.length > 0 && (
        <div className="hidden md:block rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.saleNumber')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.customer')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.status')}</th>
                <th className="text-right px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.itemCount')}</th>
                <th className="text-right px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.discount')}</th>
                <th className="text-right px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.totalAmount')}</th>
                <th className="text-right px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.soldAt')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sales.map(s => (
                <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-semibold">{s.saleNumber}</td>
                  <td className="px-4 py-3 text-sm">{s.customer?.name ?? t('reports.walkIn')}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`text-[10px] py-0 ${STATUS_CLASS[s.status] ?? ''}`}>
                      {t(`saleStatuses.${s.status}` as any)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-muted-foreground">{s._count.items}</td>
                  <td className="px-4 py-3 text-right text-sm text-muted-foreground">{fmtAmt(s.discountAmount)}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-semibold">{fmtAmt(s.totalAmount)}</td>
                  <td className="px-4 py-3 text-right text-xs text-muted-foreground">{fmtDate(s.soldAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && sales.length > 0 && (
        <div className="md:hidden space-y-3">
          {sales.map(s => (
            <Card key={s.id}>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs font-semibold">{s.saleNumber}</p>
                    <p className="text-sm font-medium mt-0.5">{s.customer?.name ?? t('reports.walkIn')}</p>
                    <p className="text-xs text-muted-foreground">{s._count.items} items · {fmtDate(s.soldAt)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge variant="outline" className={`text-[10px] py-0 ${STATUS_CLASS[s.status] ?? ''}`}>
                      {t(`saleStatuses.${s.status}` as any)}
                    </Badge>
                    <p className="font-mono text-sm font-semibold">{fmtAmt(s.totalAmount)}</p>
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
