'use client';

import { CreditCard } from 'lucide-react';
import { useState } from 'react';

import { AppEmptyState } from '@/components/app/AppEmptyState';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';
import type { TranslationKey } from '@/lib/i18n/TranslationContext';

import { useGetReportPaymentsQuery } from '../api';
import { getReportItems } from '../reportData';
import type { PaymentMethod } from '../types';
import { ReportSummaryCard } from './ReportSummaryCard';

const METHOD_CLASS: Record<string, string> = {
  CASH: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
  ACLEDA: 'bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400',
  ABA: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
  BAKONG: 'bg-cyan-500/10 text-cyan-700 border-cyan-500/20 dark:text-cyan-400',
  OTHER: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
};

const METHODS: PaymentMethod[] = ['CASH', 'ACLEDA', 'ABA', 'BAKONG', 'OTHER'];
const METHOD_LABELS: Record<PaymentMethod, TranslationKey> = {
  CASH: 'paymentMethods.CASH',
  ACLEDA: 'paymentMethods.ACLEDA',
  ABA: 'paymentMethods.ABA',
  BAKONG: 'paymentMethods.BAKONG',
  OTHER: 'paymentMethods.OTHER',
};
const LIMIT = 20;

function fmtDate(d: string) { return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }); }
function fmtAmt(v: string | number) { return `$${parseFloat(String(v)).toFixed(2)}`; }

interface Props { fromDate: string; toDate: string; }

export function PaymentReport({ fromDate, toDate }: Props) {
  const { t } = useTranslation();
  const [method, setMethod] = useState('__all');

  const { data, isLoading } = useGetReportPaymentsQuery({
    dateFrom: fromDate || undefined,
    dateTo: toDate || undefined,
    paymentMethod: method === '__all' ? undefined : method as PaymentMethod,
    page: 1,
    limit: LIMIT,
  });
  const payments = getReportItems(data?.data);
  const total = payments.reduce((sum, p) => sum + parseFloat(String(p.amount)), 0);
  const grouped = Array.isArray(data?.data) ? undefined : data?.data?.grouped;
  const totalsByMethod = grouped?.map((g) => ({
    method: g.paymentMethod,
    total: g.totalAmount,
  })) ?? METHODS
    .map((m) => ({
      method: m,
      total: payments
        .filter((p) => p.paymentMethod === m)
        .reduce((sum, p) => sum + parseFloat(String(p.amount)), 0),
    }))
    .filter((item) => item.total > 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ReportSummaryCard
          title={t('reports.totalPayment')}
          value={isLoading ? '—' : fmtAmt(total)}
          icon={CreditCard}
          iconClass="bg-green-500/10 text-green-600 dark:text-green-400"
          isLoading={isLoading}
        />
        {totalsByMethod.map(({ method: paymentMethod, total: methodTotal }) => (
          <ReportSummaryCard
            key={paymentMethod}
            title={t(METHOD_LABELS[paymentMethod])}
            value={fmtAmt(methodTotal)}
            icon={CreditCard}
            iconClass={METHOD_CLASS[paymentMethod]}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger className="w-44 h-8 text-xs">
            <SelectValue placeholder={t('reports.allMethods')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">{t('reports.allMethods')}</SelectItem>
            {METHODS.map(m => <SelectItem key={m} value={m}>{t(METHOD_LABELS[m])}</SelectItem>)}
          </SelectContent>
        </Select>
        {!isLoading && payments.length > 0 && (
          <p className="text-xs text-muted-foreground self-center">
            {payments.length} {t('reports.totalRecords')} · {t('reports.totalAmount')}: <span className="font-mono font-semibold text-foreground">{fmtAmt(total)}</span>
          </p>
        )}
      </div>

      {isLoading && <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}</div>}
      {!isLoading && payments.length === 0 && <AppEmptyState icon={CreditCard} title={t('reports.noData')} description={t('reports.noDataDesc')} />}

      {!isLoading && payments.length > 0 && (
        <div className="hidden md:block rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.date')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.invoiceNo')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.paymentMethod')}</th>
                <th className="text-right px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.amount')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.referenceNo')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.note')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-xs text-muted-foreground">{fmtDate(p.paidAt)}</td>
                  <td className="px-4 py-3 font-mono text-xs font-semibold">{p.sale?.invoiceNo ?? '—'}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`text-[10px] py-0 ${METHOD_CLASS[p.paymentMethod] ?? ''}`}>
                      {t(METHOD_LABELS[p.paymentMethod])}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-semibold">{fmtAmt(p.amount)}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{p.referenceNo ?? '—'}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground max-w-[160px] truncate">{p.note ?? '—'}</td>
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
                    <p className="font-mono text-xs font-semibold">{p.sale?.invoiceNo ?? '—'}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.referenceNo ?? '—'}</p>
                    <p className="text-xs text-muted-foreground">{fmtDate(p.paidAt)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge variant="outline" className={`text-[10px] py-0 ${METHOD_CLASS[p.paymentMethod] ?? ''}`}>
                      {t(METHOD_LABELS[p.paymentMethod])}
                    </Badge>
                    <p className="font-mono text-sm font-semibold">{fmtAmt(p.amount)}</p>
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
