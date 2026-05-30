'use client';

import { CreditCard } from 'lucide-react';
import { useState } from 'react';

import { AppEmptyState } from '@/components/app/AppEmptyState';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetReportPaymentsQuery } from '../api';

const METHOD_CLASS: Record<string, string> = {
  CASH: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
  ABA: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
  BANK_TRANSFER: 'bg-cyan-500/10 text-cyan-700 border-cyan-500/20 dark:text-cyan-400',
  CARD: 'bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400',
  OTHER: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
};

const METHODS = ['CASH', 'ABA', 'BANK_TRANSFER', 'CARD', 'OTHER'];
function fmtDate(d: string) { return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }); }
function fmtAmt(v: string) { return `$${parseFloat(v).toFixed(2)}`; }

interface Props { fromDate: string; toDate: string; }

export function PaymentReport({ fromDate, toDate }: Props) {
  const { t } = useTranslation();
  const [method, setMethod] = useState('__all');

  const { data, isLoading } = useGetReportPaymentsQuery({
    fromDate: fromDate || undefined, toDate: toDate || undefined,
    paymentMethod: method === '__all' ? undefined : method,
  });
  const payments = data?.data ?? [];
  const total = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger className="w-44 h-8 text-xs">
            <SelectValue placeholder={t('reports.allMethods')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">{t('reports.allMethods')}</SelectItem>
            {METHODS.map(m => <SelectItem key={m} value={m}>{t(`paymentMethods.${m}` as any)}</SelectItem>)}
          </SelectContent>
        </Select>
        {!isLoading && payments.length > 0 && (
          <p className="text-xs text-muted-foreground self-center">
            {payments.length} {t('reports.totalRecords')} · {t('reports.totalAmount')}: <span className="font-mono font-semibold text-foreground">{fmtAmt(total.toString())}</span>
          </p>
        )}
      </div>

      {isLoading && <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}</div>}
      {!isLoading && payments.length === 0 && <AppEmptyState icon={CreditCard} title={t('reports.noData')} description={t('reports.noDataDesc')} />}

      {!isLoading && payments.length > 0 && (
        <div className="hidden md:block rounded-xl border overflow-hidden">
          <table className="w-full text-sm bg-card">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.paymentNumber')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.invoiceNumber')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.customer')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.method')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.referenceNo')}</th>
                <th className="text-right px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.amount')}</th>
                <th className="text-right px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.paidAt')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-semibold">{p.paymentNumber}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.invoice.invoiceNumber}</td>
                  <td className="px-4 py-3 text-sm">{p.customer.name}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`text-[10px] py-0 ${METHOD_CLASS[p.method] ?? ''}`}>
                      {t(`paymentMethods.${p.method}` as any)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{p.referenceNo ?? '—'}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-semibold">{fmtAmt(p.amount)}</td>
                  <td className="px-4 py-3 text-right text-xs text-muted-foreground">{fmtDate(p.paidAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && payments.length > 0 && (
        <div className="md:hidden space-y-3">
          {payments.map(p => (
            <Card key={p.id}>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs font-semibold">{p.paymentNumber}</p>
                    <p className="text-sm font-medium mt-0.5 truncate">{p.customer.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{p.invoice.invoiceNumber}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge variant="outline" className={`text-[10px] py-0 ${METHOD_CLASS[p.method] ?? ''}`}>
                      {t(`paymentMethods.${p.method}` as any)}
                    </Badge>
                    <p className="font-mono text-sm font-semibold">{fmtAmt(p.amount)}</p>
                    <p className="text-[10px] text-muted-foreground">{fmtDate(p.paidAt)}</p>
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
