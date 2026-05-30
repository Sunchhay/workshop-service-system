'use client';

import Link from 'next/link';
import { ArrowRight, CreditCard } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetRecentTransactionsQuery } from '../api';

const methodClass: Record<string, string> = {
  CASH: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
  ABA: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
  BANK_TRANSFER: 'bg-cyan-500/10 text-cyan-700 border-cyan-500/20 dark:text-cyan-400',
  CARD: 'bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400',
  OTHER: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function RecentTransactions() {
  const { t } = useTranslation();
  const { data, isLoading } = useGetRecentTransactionsQuery();
  const transactions = data?.data ?? [];

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">{t('dashboard.recentTransactions')}</CardTitle>
          <Button asChild variant="ghost" size="sm" className="h-7 text-xs gap-1">
            <Link href="/admin/payments">
              {t('dashboard.viewAll')}
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 gap-2 text-muted-foreground">
            <CreditCard className="h-8 w-8 opacity-30" />
            <p className="text-sm">{t('dashboard.noRecentTransactions')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <Link
                key={tx.id}
                href={`/admin/invoices/${tx.invoice.id}`}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-semibold">{tx.paymentNumber}</span>
                    <Badge variant="outline" className={`text-[10px] py-0 ${methodClass[tx.method] ?? ''}`}>
                      {t(`paymentMethods.${tx.method}` as any)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {tx.customer?.name ?? '—'} · {tx.invoice.invoiceNumber}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono text-sm font-semibold">${parseFloat(tx.amount).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(tx.paidAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
