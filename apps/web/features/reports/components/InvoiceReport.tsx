'use client';

import { FileText } from 'lucide-react';
import { useState } from 'react';

import { AppEmptyState } from '@/components/app/AppEmptyState';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetReportInvoicesQuery } from '../api';

const STATUS_CLASS: Record<string, string> = {
  DRAFT: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
  ISSUED: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
  PARTIAL: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
  PAID: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
  CANCELLED: 'bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400',
};

const STATUSES = ['DRAFT', 'ISSUED', 'PARTIAL', 'PAID', 'CANCELLED'];
function fmtDate(d: string) { return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }); }
function fmtAmt(v: string) { return `$${parseFloat(v).toFixed(2)}`; }

interface Props { fromDate: string; toDate: string; }

export function InvoiceReport({ fromDate, toDate }: Props) {
  const { t } = useTranslation();
  const [status, setStatus] = useState('__all');

  const { data, isLoading } = useGetReportInvoicesQuery({
    fromDate: fromDate || undefined, toDate: toDate || undefined,
    status: status === '__all' ? undefined : status,
  });
  const invoices = data?.data ?? [];
  const total = invoices.reduce((sum, inv) => sum + parseFloat(inv.totalAmount), 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40 h-8 text-xs">
            <SelectValue placeholder={t('reports.allStatuses')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">{t('reports.allStatuses')}</SelectItem>
            {STATUSES.map(s => <SelectItem key={s} value={s}>{t(`invoiceStatuses.${s}` as any)}</SelectItem>)}
          </SelectContent>
        </Select>
        {!isLoading && invoices.length > 0 && (
          <p className="text-xs text-muted-foreground self-center">
            {invoices.length} {t('reports.totalRecords')} · {t('reports.totalAmount')}: <span className="font-mono font-semibold text-foreground">{fmtAmt(total.toString())}</span>
          </p>
        )}
      </div>

      {isLoading && <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}</div>}
      {!isLoading && invoices.length === 0 && <AppEmptyState icon={FileText} title={t('reports.noData')} description={t('reports.noDataDesc')} />}

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
                  <td className="px-4 py-3 text-right font-mono text-sm font-semibold">{fmtAmt(inv.totalAmount)}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-green-700 dark:text-green-400">{fmtAmt(inv.paidAmount)}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-red-600 dark:text-red-400">{fmtAmt(inv.dueAmount)}</td>
                  <td className="px-4 py-3 text-right text-xs text-muted-foreground">{fmtDate(inv.issuedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && invoices.length > 0 && (
        <div className="md:hidden space-y-3">
          {invoices.map(inv => (
            <Card key={inv.id}>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs font-semibold">{inv.invoiceNumber}</p>
                    <p className="text-sm font-medium mt-0.5 truncate">{inv.customer.name}</p>
                    <p className="text-xs text-muted-foreground">{fmtDate(inv.issuedAt)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge variant="outline" className={`text-[10px] py-0 ${STATUS_CLASS[inv.status] ?? ''}`}>
                      {t(`invoiceStatuses.${inv.status}` as any)}
                    </Badge>
                    <p className="font-mono text-sm font-semibold">{fmtAmt(inv.totalAmount)}</p>
                    {parseFloat(inv.dueAmount) > 0 && (
                      <p className="text-xs text-red-600 dark:text-red-400">Due: {fmtAmt(inv.dueAmount)}</p>
                    )}
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
