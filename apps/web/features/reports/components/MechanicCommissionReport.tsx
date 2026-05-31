'use client';

import { DollarSign, Wrench } from 'lucide-react';
import { useState } from 'react';

import { AppEmptyState } from '@/components/app/AppEmptyState';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';
import type { TranslationKey } from '@/lib/i18n/TranslationContext';

import { useGetReportMechanicCommissionsQuery } from '../api';
import { getReportItems, getReportSummary } from '../reportData';
import type { CommissionStatus } from '../types';
import { ReportSummaryCard } from './ReportSummaryCard';

const COMMISSION_STATUS_CLASS: Record<string, string> = {
  NONE: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
  UNPAID: 'bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400',
  PAID: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
};

const COMMISSION_STATUSES: CommissionStatus[] = ['NONE', 'UNPAID', 'PAID'];
const COMMISSION_STATUS_LABELS: Record<CommissionStatus, TranslationKey> = {
  NONE: 'commissionStatuses.NONE',
  UNPAID: 'commissionStatuses.UNPAID',
  PAID: 'commissionStatuses.PAID',
};
const LIMIT = 20;

function fmtDate(d: string) { return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }); }
function fmtAmt(v: string | number) { return `$${parseFloat(String(v)).toFixed(2)}`; }

interface Props { fromDate: string; toDate: string; }

export function MechanicCommissionReport({ fromDate, toDate }: Props) {
  const { t } = useTranslation();
  const [commissionStatus, setCommissionStatus] = useState('__all');
  const [mechanicId, setMechanicId] = useState('');

  const { data, isLoading } = useGetReportMechanicCommissionsQuery({
    dateFrom: fromDate || undefined,
    dateTo: toDate || undefined,
    mechanicId: mechanicId.trim() || undefined,
    commissionStatus: commissionStatus === '__all' ? undefined : commissionStatus as CommissionStatus,
    page: 1,
    limit: LIMIT,
  });
  const items = getReportItems(data?.data);
  const summary = getReportSummary(data?.data);

  const totalCommission = summary?.totalCommission ?? items.reduce((sum, c) => sum + parseFloat(String(c.commissionAmount)), 0);
  const paidCommission = summary?.paidCommission ?? items
    .filter(c => c.commissionStatus === 'PAID')
    .reduce((sum, c) => sum + parseFloat(String(c.commissionAmount)), 0);
  const unpaidCommission = summary?.unpaidCommission ?? items
    .filter(c => c.commissionStatus === 'UNPAID')
    .reduce((sum, c) => sum + parseFloat(String(c.commissionAmount)), 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <ReportSummaryCard
          title={t('reports.totalCommission')}
          value={isLoading ? '—' : fmtAmt(totalCommission)}
          icon={DollarSign}
          iconClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          isLoading={isLoading}
        />
        <ReportSummaryCard
          title={t('reports.paidCommission')}
          value={isLoading ? '—' : fmtAmt(paidCommission)}
          icon={DollarSign}
          iconClass="bg-green-500/10 text-green-600 dark:text-green-400"
          highlight="success"
          isLoading={isLoading}
        />
        <ReportSummaryCard
          title={t('reports.unpaidCommission')}
          value={isLoading ? '—' : fmtAmt(unpaidCommission)}
          icon={DollarSign}
          iconClass="bg-red-500/10 text-red-600 dark:text-red-400"
          highlight={unpaidCommission > 0 ? 'danger' : undefined}
          isLoading={isLoading}
        />
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <Select value={commissionStatus} onValueChange={setCommissionStatus}>
          <SelectTrigger className="w-44 h-8 text-xs">
            <SelectValue placeholder={t('reports.allCommissionStatuses')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">{t('reports.allCommissionStatuses')}</SelectItem>
            {COMMISSION_STATUSES.map(s => <SelectItem key={s} value={s}>{t(COMMISSION_STATUS_LABELS[s])}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input
          value={mechanicId}
          onChange={(e) => setMechanicId(e.target.value)}
          placeholder={t('reports.mechanicId')}
          className="w-40 h-8 text-xs"
        />
        {!isLoading && items.length > 0 && (
          <p className="text-xs text-muted-foreground self-center">
            {items.length} {t('reports.totalRecords')}
          </p>
        )}
      </div>

      {isLoading && <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}</div>}
      {!isLoading && items.length === 0 && <AppEmptyState icon={Wrench} title={t('reports.noData')} description={t('reports.noDataDesc')} />}

      {!isLoading && items.length > 0 && (
        <div className="hidden md:block rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.invoiceNo')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.date')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.mechanic')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.customer')}</th>
                <th className="text-right px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.commissionAmount')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.commissionStatus')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.commissionPaidAt')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map(c => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-semibold">{c.invoiceNo}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{fmtDate(c.createdAt)}</td>
                  <td className="px-4 py-3 text-sm">{c.mechanic?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{c.customer?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-semibold">{fmtAmt(c.commissionAmount)}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`text-[10px] py-0 ${COMMISSION_STATUS_CLASS[c.commissionStatus] ?? ''}`}>
                      {t(COMMISSION_STATUS_LABELS[c.commissionStatus])}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{c.commissionPaidAt ? fmtDate(c.commissionPaidAt) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && items.length > 0 && (
        <div className="md:hidden space-y-3">
          {items.map(c => (
            <Card key={c.id}>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs font-semibold">{c.invoiceNo}</p>
                    <p className="text-sm font-medium mt-0.5">{c.mechanic?.name ?? '—'}</p>
                    <p className="text-xs text-muted-foreground">{c.customer?.name ?? '—'} · {fmtDate(c.createdAt)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge variant="outline" className={`text-[10px] py-0 ${COMMISSION_STATUS_CLASS[c.commissionStatus] ?? ''}`}>
                      {t(COMMISSION_STATUS_LABELS[c.commissionStatus])}
                    </Badge>
                    <p className="font-mono text-sm font-semibold">{fmtAmt(c.commissionAmount)}</p>
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
