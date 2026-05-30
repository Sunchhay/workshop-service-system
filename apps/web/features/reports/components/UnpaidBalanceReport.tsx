'use client';

import { AlertTriangle } from 'lucide-react';

import { AppEmptyState } from '@/components/app/AppEmptyState';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetReportUnpaidBalancesQuery } from '../api';

const STATUS_CLASS: Record<string, string> = {
  DRAFT: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
  ISSUED: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
  PARTIAL: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
};

function fmtDate(d: string) { return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }); }
function fmtAmt(v: string) { return `$${parseFloat(v).toFixed(2)}`; }

interface Props { fromDate: string; toDate: string; }

export function UnpaidBalanceReport({ fromDate, toDate }: Props) {
  const { t } = useTranslation();
  const { data, isLoading } = useGetReportUnpaidBalancesQuery({ fromDate: fromDate || undefined, toDate: toDate || undefined });
  const invoices = data?.data ?? [];
  const totalDue = invoices.reduce((sum, inv) => sum + parseFloat(inv.dueAmount), 0);

  return (
    <div className="space-y-4">
      {!isLoading && invoices.length > 0 && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-400">
            {invoices.length} {t('reports.totalRecords')} · {t('reports.unpaidTotal')}: <span className="font-mono font-semibold">{fmtAmt(totalDue.toString())}</span>
          </p>
        </div>
      )}

      {isLoading && <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}</div>}
      {!isLoading && invoices.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <AlertTriangle className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">{t('reports.noData')}</p>
          <p className="text-xs text-muted-foreground/70">{t('reports.noDataDesc')}</p>
        </div>
      )}

      {!isLoading && invoices.length > 0 && (
        <div className="hidden md:block rounded-xl border overflow-hidden">
          <table className="w-full text-sm bg-card">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.invoiceNumber')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.customer')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.status')}</th>
                <th className="text-right px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.totalAmount')}</th>
                <th className="text-right px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.paidAmount')}</th>
                <th className="text-right px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.dueAmount')}</th>
                <th className="text-right px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.issuedAt')}</th>
                <th className="text-right px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.dueDate')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-semibold">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-sm">{inv.customer.name}</p>
                    <p className="text-xs text-muted-foreground">{inv.customer.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`text-[10px] py-0 ${STATUS_CLASS[inv.status] ?? ''}`}>
                      {t(`invoiceStatuses.${inv.status}` as any)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm">{fmtAmt(inv.totalAmount)}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-green-700 dark:text-green-400">{fmtAmt(inv.paidAmount)}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-red-600 dark:text-red-400">{fmtAmt(inv.dueAmount)}</td>
                  <td className="px-4 py-3 text-right text-xs text-muted-foreground">{fmtDate(inv.issuedAt)}</td>
                  <td className="px-4 py-3 text-right text-xs text-muted-foreground">{inv.dueDate ? fmtDate(inv.dueDate) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && invoices.length > 0 && (
        <div className="md:hidden space-y-3">
          {invoices.map(inv => (
            <Card key={inv.id} className="border-red-500/20">
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs font-semibold">{inv.invoiceNumber}</p>
                    <p className="text-sm font-medium mt-0.5 truncate">{inv.customer.name}</p>
                    <p className="text-xs text-muted-foreground">{inv.customer.phone}</p>
                    {inv.dueDate && <p className="text-xs text-muted-foreground">Due: {fmtDate(inv.dueDate)}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge variant="outline" className={`text-[10px] py-0 ${STATUS_CLASS[inv.status] ?? ''}`}>
                      {t(`invoiceStatuses.${inv.status}` as any)}
                    </Badge>
                    <p className="font-mono text-sm font-semibold text-red-600 dark:text-red-400">{fmtAmt(inv.dueAmount)}</p>
                    <p className="text-[10px] text-muted-foreground">Total: {fmtAmt(inv.totalAmount)}</p>
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
