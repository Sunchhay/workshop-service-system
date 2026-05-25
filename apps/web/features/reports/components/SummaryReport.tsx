'use client';

import {
  AlertTriangle, BarChart3, ClipboardList, CreditCard,
  DollarSign, Package, TrendingDown, TrendingUp, Users, Wallet,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';
import { useGetReportSummaryQuery } from '../api';

function fmt(v: string) { return `$${parseFloat(v).toFixed(2)}`; }

interface Props { fromDate: string; toDate: string; }

interface SummaryCardProps {
  title: string; value: string | number; iconClass: string; isLoading: boolean;
  icon: React.ElementType; highlight?: string;
}

function SCard({ title, value, iconClass, isLoading, icon: Icon, highlight }: SummaryCardProps) {
  return (
    <Card className={highlight === 'danger' ? 'border-red-500/30' : highlight === 'warn' ? 'border-amber-500/30' : highlight === 'success' ? 'border-green-500/30' : ''}>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-7 w-28" /></div>
        ) : (
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg shrink-0 ${iconClass}`}><Icon className="h-4 w-4" /></div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground truncate">{title}</p>
              <p className="font-mono text-lg font-bold leading-tight">{value}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function SummaryReport({ fromDate, toDate }: Props) {
  const { t } = useTranslation();
  const { data, isLoading } = useGetReportSummaryQuery({ fromDate: fromDate || undefined, toDate: toDate || undefined });
  const s = data?.data;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      <SCard title={t('reports.totalCustomers')} value={isLoading ? '—' : (s?.totalCustomers ?? 0)} icon={Users} iconClass="bg-blue-500/10 text-blue-600 dark:text-blue-400" isLoading={isLoading} />
      <SCard title={t('reports.totalServiceJobs')} value={isLoading ? '—' : (s?.totalServiceJobs ?? 0)} icon={ClipboardList} iconClass="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400" isLoading={isLoading} />
      <SCard title={t('reports.totalInvoices')} value={isLoading ? '—' : (s?.totalInvoices ?? 0)} icon={BarChart3} iconClass="bg-purple-500/10 text-purple-600 dark:text-purple-400" isLoading={isLoading} />
      <SCard title={t('reports.invoiceTotal')} value={isLoading ? '—' : fmt(s?.invoiceTotal ?? '0')} icon={DollarSign} iconClass="bg-purple-500/10 text-purple-600 dark:text-purple-400" isLoading={isLoading} />
      <SCard title={t('reports.paymentTotal')} value={isLoading ? '—' : fmt(s?.paymentTotal ?? '0')} icon={Wallet} iconClass="bg-green-500/10 text-green-600 dark:text-green-400" isLoading={isLoading} highlight="success" />
      <SCard title={t('reports.unpaidTotal')} value={isLoading ? '—' : fmt(s?.unpaidTotal ?? '0')} icon={AlertTriangle} iconClass="bg-red-500/10 text-red-600 dark:text-red-400" isLoading={isLoading} highlight={s && parseFloat(s.unpaidTotal) > 0 ? 'danger' : undefined} />
      <SCard title={t('reports.salesTotal')} value={isLoading ? '—' : fmt(s?.salesTotal ?? '0')} icon={TrendingUp} iconClass="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" isLoading={isLoading} />
      <SCard title={t('reports.expenseTotal')} value={isLoading ? '—' : fmt(s?.expenseTotal ?? '0')} icon={TrendingDown} iconClass="bg-orange-500/10 text-orange-600 dark:text-orange-400" isLoading={isLoading} />
      <SCard title={t('reports.profitEstimate')} value={isLoading ? '—' : fmt(s?.profitEstimate ?? '0')} icon={CreditCard} iconClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" isLoading={isLoading} highlight={s && parseFloat(s.profitEstimate) >= 0 ? 'success' : 'danger'} />
      <SCard title={t('reports.lowStockCount')} value={isLoading ? '—' : (s?.lowStockCount ?? 0)} icon={Package} iconClass="bg-amber-500/10 text-amber-600 dark:text-amber-400" isLoading={isLoading} highlight={s && s.lowStockCount > 0 ? 'warn' : undefined} />
    </div>
  );
}
