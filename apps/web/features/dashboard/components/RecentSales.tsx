'use client';

import { ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetRecentSalesQuery } from '../api';

const paymentStatusClass: Record<string, string> = {
  PAID: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
  PARTIAL: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
  UNPAID: 'bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400',
};

const saleStatusClass: Record<string, string> = {
  COMPLETED: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
  VOIDED: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
};

function fmt(v: string | number) {
  const n = parseFloat(String(v));
  return isNaN(n) ? '0.00' : n.toFixed(2);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function RecentSales() {
  const { t } = useTranslation();
  const { data, isLoading } = useGetRecentSalesQuery();
  const sales = data?.data ?? [];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">{t('dashboard.recentSales')}</CardTitle>
          <Button asChild variant="ghost" size="sm" className="h-7 text-xs gap-1">
            <Link href="/admin/sales">
              {t('dashboard.viewAll')}
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : sales.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 gap-2 text-muted-foreground">
            <ShoppingBag className="h-8 w-8 opacity-30" />
            <p className="text-sm">{t('dashboard.noRecentSales')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sales.map((sale) => (
              <Link
                key={sale.id}
                href={`/admin/sales/${sale.id}`}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono text-xs font-semibold">{sale.invoiceNo}</span>
                    <Badge variant="outline" className={`text-[10px] py-0 ${paymentStatusClass[sale.paymentStatus] ?? ''}`}>
                      {t(`paymentStatuses.${sale.paymentStatus}` as any)}
                    </Badge>
                    <Badge variant="outline" className={`text-[10px] py-0 ${saleStatusClass[sale.saleStatus] ?? ''}`}>
                      {t(`saleStatuses.${sale.saleStatus}` as any)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {sale.customer?.name ?? '—'}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono text-sm font-semibold">${fmt(sale.grandTotal)}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(sale.createdAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
