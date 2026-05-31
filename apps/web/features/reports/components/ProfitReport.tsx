'use client';

import { ArrowDownLeft, ArrowUpRight, TrendingDown, TrendingUp } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetReportProfitSummaryQuery } from '../api';

function fmtAmt(v: string | number) { return `$${parseFloat(String(v)).toFixed(2)}`; }

interface Props { fromDate: string; toDate: string; }

interface PCardProps {
  title: string; value: string; icon: React.ElementType; iconClass: string;
  borderClass?: string; note?: string; isLoading: boolean;
}

function PCard({ title, value, icon: Icon, iconClass, borderClass = '', note, isLoading }: PCardProps) {
  return (
    <Card className={borderClass}>
      <CardContent className="p-5">
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
  const { data, isLoading } = useGetReportProfitSummaryQuery({
    dateFrom: fromDate || undefined,
    dateTo: toDate || undefined,
    page: 1,
    limit: 20,
  });
  const p = data?.data;
  const totalSales = parseFloat(String(p?.totalSales ?? 0));
  const totalExpenses = parseFloat(String(p?.totalExpenses ?? 0));
  const estimatedProfit = totalSales - totalExpenses;
  const isProfit = estimatedProfit >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <PCard
        title={t('reports.totalSales')}
        value={isLoading ? '—' : fmtAmt(totalSales)}
        icon={ArrowUpRight}
        iconClass="bg-green-500/10 text-green-600 dark:text-green-400"
        borderClass="border-green-500/20"
        isLoading={isLoading}
      />
      <PCard
        title={t('reports.totalExpenses')}
        value={isLoading ? '—' : fmtAmt(totalExpenses)}
        icon={ArrowDownLeft}
        iconClass="bg-red-500/10 text-red-600 dark:text-red-400"
        borderClass="border-red-500/20"
        isLoading={isLoading}
      />
      <PCard
        title={t('reports.estimatedProfit')}
        value={isLoading ? '—' : fmtAmt(estimatedProfit)}
        icon={isProfit ? TrendingUp : TrendingDown}
        iconClass={isProfit ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}
        borderClass={isProfit ? 'border-emerald-500/30' : 'border-red-500/30'}
        note={t('reports.profitNote')}
        isLoading={isLoading}
      />
    </div>
  );
}
