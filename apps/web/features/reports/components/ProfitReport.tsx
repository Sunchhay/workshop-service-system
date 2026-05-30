'use client';

import { AlertTriangle, ArrowDownLeft, ArrowUpRight, TrendingDown, TrendingUp, Wallet } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetReportProfitQuery } from '../api';

function fmtAmt(v: string) { return `$${parseFloat(v).toFixed(2)}`; }

interface Props { fromDate: string; toDate: string; }

interface ProfitCardProps {
  title: string; value: string; icon: React.ElementType; iconClass: string;
  borderClass?: string; note?: string; isLoading: boolean;
}

function PCard({ title, value, icon: Icon, iconClass, borderClass = '', note, isLoading }: ProfitCardProps) {
  return (
    <Card className={borderClass}>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3"><Skeleton className="h-4 w-32" /><Skeleton className="h-9 w-40" /></div>
        ) : (
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl shrink-0 ${iconClass}`}><Icon className="h-5 w-5" /></div>
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="font-mono text-2xl font-bold mt-1">{value}</p>
              {note && <p className="text-xs text-muted-foreground mt-1">{note}</p>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ProfitReport({ fromDate, toDate }: Props) {
  const { t } = useTranslation();
  const { data, isLoading } = useGetReportProfitQuery({ fromDate: fromDate || undefined, toDate: toDate || undefined });
  const p = data?.data;
  const isProfit = p ? parseFloat(p.estimatedProfit) >= 0 : true;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PCard
          title={t('reports.paymentReceived')}
          value={isLoading ? '—' : fmtAmt(p?.paymentReceived ?? '0')}
          icon={ArrowUpRight}
          iconClass="bg-green-500/10 text-green-600 dark:text-green-400"
          borderClass="border-green-500/20"
          isLoading={isLoading}
        />
        <PCard
          title={t('reports.expenseTotal')}
          value={isLoading ? '—' : fmtAmt(p?.expenseTotal ?? '0')}
          icon={ArrowDownLeft}
          iconClass="bg-red-500/10 text-red-600 dark:text-red-400"
          borderClass="border-red-500/20"
          isLoading={isLoading}
        />
        <PCard
          title={t('reports.estimatedProfit')}
          value={isLoading ? '—' : fmtAmt(p?.estimatedProfit ?? '0')}
          icon={isProfit ? TrendingUp : TrendingDown}
          iconClass={isProfit ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}
          borderClass={isProfit ? 'border-emerald-500/30' : 'border-red-500/30'}
          note={t('reports.profitNote')}
          isLoading={isLoading}
        />
        <PCard
          title={t('reports.unpaidTotal')}
          value={isLoading ? '—' : fmtAmt(p?.unpaidAmount ?? '0')}
          icon={AlertTriangle}
          iconClass="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          borderClass={p && parseFloat(p.unpaidAmount) > 0 ? 'border-amber-500/30' : ''}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PCard
          title={t('reports.invoiceTotal')}
          value={isLoading ? '—' : fmtAmt(p?.invoiceTotal ?? '0')}
          icon={Wallet}
          iconClass="bg-purple-500/10 text-purple-600 dark:text-purple-400"
          isLoading={isLoading}
        />
        <PCard
          title={t('reports.salesTotal')}
          value={isLoading ? '—' : fmtAmt(p?.salesTotal ?? '0')}
          icon={TrendingUp}
          iconClass="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
