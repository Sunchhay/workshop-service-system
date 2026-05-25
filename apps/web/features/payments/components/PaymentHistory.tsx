'use client';

import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetPaymentsByInvoiceQuery } from '../api';
import type { PaymentMethod } from '../types';

const methodClass: Record<PaymentMethod, string> = {
  CASH: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
  ABA: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
  BANK_TRANSFER: 'bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400',
  CARD: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
  OTHER: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

interface PaymentHistoryProps {
  invoiceId: string;
}

export function PaymentHistory({ invoiceId }: PaymentHistoryProps) {
  const { t } = useTranslation();
  const { data, isLoading } = useGetPaymentsByInvoiceQuery(invoiceId);
  const payments = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        {t('payments.noPaymentHistory')}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {payments.map((pay) => (
        <Link
          key={pay.id}
          href={`/admin/payments/${pay.id}`}
          className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono text-xs text-muted-foreground shrink-0">
              {pay.paymentNumber}
            </span>
            <Badge variant="outline" className={`${methodClass[pay.method]} text-[10px] shrink-0`}>
              {t(`paymentMethods.${pay.method}`)}
            </Badge>
            {pay.referenceNo && (
              <span className="text-xs text-muted-foreground truncate hidden sm:block">
                {pay.referenceNo}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-muted-foreground">{formatDate(pay.paidAt)}</span>
            <span className="font-mono font-medium">${parseFloat(pay.amount).toFixed(2)}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
