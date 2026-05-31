'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetPaymentSummaryQuery } from '../api';

const methodClass: Record<string, string> = {
  CASH: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
  ACLEDA: 'bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400',
  ABA: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
  BAKONG: 'bg-cyan-500/10 text-cyan-700 border-cyan-500/20 dark:text-cyan-400',
  OTHER: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
};

function fmt(v: string | number) {
  const n = parseFloat(String(v));
  return isNaN(n) ? '0.00' : n.toFixed(2);
}

export function PaymentSummary() {
  const { t } = useTranslation();
  const { data, isLoading } = useGetPaymentSummaryQuery();
  const items = data?.data ?? [];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">{t('dashboard.paymentSummary')}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">{t('dashboard.noData')}</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {items.map((item) => (
              <div key={item.paymentMethod} className="rounded-lg border p-3 flex flex-col items-center gap-1.5 text-center">
                <Badge variant="outline" className={`text-[10px] ${methodClass[item.paymentMethod] ?? ''}`}>
                  {t(`paymentMethods.${item.paymentMethod}` as any)}
                </Badge>
                <p className="font-mono font-semibold text-sm">${fmt(item.total)}</p>
                <p className="text-xs text-muted-foreground">{item.count} {t('dashboard.txCount')}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
