'use client';

import { Wrench } from 'lucide-react';

import { AppEmptyState } from '@/components/app/AppEmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetReportServiceUsageQuery } from '../api';
import { getReportItems } from '../reportData';

function fmtAmt(v: string | number) { return `$${parseFloat(String(v)).toFixed(2)}`; }

interface Props { fromDate: string; toDate: string; }

export function ServiceUsageReport({ fromDate, toDate }: Props) {
  const { t } = useTranslation();

  const { data, isLoading } = useGetReportServiceUsageQuery({
    dateFrom: fromDate || undefined,
    dateTo: toDate || undefined,
    page: 1,
    limit: 20,
  });
  const items = getReportItems(data?.data);

  return (
    <div className="space-y-4">
      {isLoading && <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}</div>}
      {!isLoading && items.length === 0 && <AppEmptyState icon={Wrench} title={t('reports.noData')} description={t('reports.noDataDesc')} />}

      {!isLoading && items.length > 0 && (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.serviceName')}</th>
                <th className="text-right px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.qty')}</th>
                <th className="text-right px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.total')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((s, index) => (
                <tr key={s.serviceId ?? `${s.nameSnapshot ?? s.name}-${index}`} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium">{s.nameSnapshot ?? s.name ?? '—'}</td>
                  <td className="px-4 py-3 text-right text-sm text-muted-foreground">{s.totalQuantity ?? s.quantity ?? 0}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-semibold">{fmtAmt(s.totalRevenue ?? s.total ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
