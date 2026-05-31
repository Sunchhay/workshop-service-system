'use client';

import { AlertTriangle, Users } from 'lucide-react';

import { AppEmptyState } from '@/components/app/AppEmptyState';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';
import type { TranslationKey } from '@/lib/i18n/TranslationContext';

import { useGetReportCustomerDebtsQuery } from '../api';
import { getReportItems, getReportSummary } from '../reportData';
import type { PaymentStatus } from '../types';
import { ReportSummaryCard } from './ReportSummaryCard';

const PAYMENT_STATUS_CLASS: Record<string, string> = {
  PAID: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
  PARTIAL: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
  UNPAID: 'bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400',
};
const PAYMENT_STATUS_LABELS: Record<PaymentStatus, TranslationKey> = {
  PAID: 'paymentStatuses.PAID',
  PARTIAL: 'paymentStatuses.PARTIAL',
  UNPAID: 'paymentStatuses.UNPAID',
};

function fmtDate(d: string) { return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }); }
function fmtAmt(v: string | number) { return `$${parseFloat(String(v)).toFixed(2)}`; }

interface Props { fromDate: string; toDate: string; }

export function CustomerDebtReport({ fromDate, toDate }: Props) {
  const { t } = useTranslation();

  const { data, isLoading } = useGetReportCustomerDebtsQuery({
    dateFrom: fromDate || undefined,
    dateTo: toDate || undefined,
    page: 1,
    limit: 20,
  });
  const debts = getReportItems(data?.data);
  const summary = getReportSummary(data?.data);

  const totalDebt = summary?.totalDebt ?? debts.reduce((sum, d) => sum + parseFloat(String(d.balanceAmount)), 0);
  const unpaidPartialInvoices = debts.filter((d) => d.paymentStatus === 'UNPAID' || d.paymentStatus === 'PARTIAL').length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <ReportSummaryCard
          title={t('reports.totalDebt')}
          value={isLoading ? '—' : fmtAmt(totalDebt)}
          icon={AlertTriangle}
          iconClass="bg-red-500/10 text-red-600 dark:text-red-400"
          highlight={totalDebt > 0 ? 'danger' : undefined}
          isLoading={isLoading}
        />
        <ReportSummaryCard
          title={t('reports.unpaidPartialInvoices')}
          value={isLoading ? '—' : unpaidPartialInvoices}
          icon={Users}
          iconClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          isLoading={isLoading}
        />
      </div>

      {isLoading && <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}</div>}
      {!isLoading && debts.length === 0 && <AppEmptyState icon={Users} title={t('reports.noData')} description={t('reports.noDataDesc')} />}

      {!isLoading && debts.length > 0 && (
        <div className="hidden md:block rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.invoiceNo')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.date')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.customer')}</th>
                <th className="text-right px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.grandTotal')}</th>
                <th className="text-right px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.paid')}</th>
                <th className="text-right px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.balance')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.paymentStatus')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {debts.map(d => (
                <tr key={d.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-semibold">{d.invoiceNo}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{fmtDate(d.createdAt)}</td>
                  <td className="px-4 py-3 text-sm">{d.customer?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-semibold">{fmtAmt(d.grandTotal)}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-muted-foreground">{fmtAmt(d.paidAmount)}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-red-600 dark:text-red-400">{fmtAmt(d.balanceAmount)}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`text-[10px] py-0 ${PAYMENT_STATUS_CLASS[d.paymentStatus] ?? ''}`}>
                      {t(PAYMENT_STATUS_LABELS[d.paymentStatus])}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && debts.length > 0 && (
        <div className="md:hidden space-y-3">
          {debts.map(d => (
            <Card key={d.id}>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs font-semibold">{d.invoiceNo}</p>
                    <p className="text-sm font-medium mt-0.5">{d.customer?.name ?? '—'}</p>
                    <p className="text-xs text-muted-foreground">{fmtDate(d.createdAt)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge variant="outline" className={`text-[10px] py-0 ${PAYMENT_STATUS_CLASS[d.paymentStatus] ?? ''}`}>
                      {t(PAYMENT_STATUS_LABELS[d.paymentStatus])}
                    </Badge>
                    <p className="font-mono text-sm font-semibold text-red-600 dark:text-red-400">{fmtAmt(d.balanceAmount)}</p>
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
