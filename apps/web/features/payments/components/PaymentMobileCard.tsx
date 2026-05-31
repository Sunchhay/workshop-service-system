'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { Payment, PaymentMethod } from '../types';

const methodClass: Record<PaymentMethod, string> = {
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

function formatDate(d: string) {
  return new Date(d).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

interface PaymentMobileCardProps {
  payment: Payment;
}

export function PaymentMobileCard({ payment }: PaymentMobileCardProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div
      className="flex items-start gap-3 rounded-xl border bg-card p-4 cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => router.push(`/admin/payments/${payment.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') router.push(`/admin/payments/${payment.id}`);
      }}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className={methodClass[payment.paymentMethod]}>
            {t(`paymentMethods.${payment.paymentMethod}`)}
          </Badge>
          <span className="text-xs text-muted-foreground">{formatDate(payment.paidAt)}</span>
        </div>
        {payment.sale && (
          <div className="mt-1" onClick={(e) => e.stopPropagation()}>
            <Link
              href={`/admin/sales/${payment.sale.id}`}
              className="font-mono text-xs text-muted-foreground hover:underline"
            >
              {payment.sale.invoiceNo}
            </Link>
          </div>
        )}
        <div className="flex items-center gap-3 mt-1">
          <span className="font-mono font-medium text-sm">${fmt(payment.amount)}</span>
          {payment.referenceNo && (
            <span className="text-xs text-muted-foreground">Ref: {payment.referenceNo}</span>
          )}
        </div>
        {payment.note && (
          <p className="text-xs text-muted-foreground mt-0.5">{payment.note}</p>
        )}
      </div>
    </div>
  );
}
