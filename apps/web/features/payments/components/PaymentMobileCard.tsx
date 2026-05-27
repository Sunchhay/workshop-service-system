'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { Payment, PaymentMethod } from '../types';

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

interface PaymentMobileCardProps {
  payment: Payment;
}

export function PaymentMobileCard({ payment }: PaymentMobileCardProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div
      className="flex items-start gap-3 rounded-xl border bg-card p-4  cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => router.push(`/admin/payments/${payment.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') router.push(`/admin/payments/${payment.id}`);
      }}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono font-medium text-sm">{payment.paymentNumber}</span>
          <Badge variant="outline" className={methodClass[payment.method]}>
            {t(`paymentMethods.${payment.method}`)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">{payment.customer.name}</p>
        <div onClick={(e) => e.stopPropagation()}>
          <Link
            href={`/admin/invoices/${payment.invoice.id}`}
            className="text-xs text-muted-foreground hover:underline"
          >
            {payment.invoice.invoiceNumber}
          </Link>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-mono font-medium text-sm">
            ${parseFloat(payment.amount).toFixed(2)}
          </span>
          <span className="text-xs text-muted-foreground">{formatDate(payment.paidAt)}</span>
        </div>
        {payment.referenceNo && (
          <p className="text-xs text-muted-foreground mt-0.5">
            Ref: {payment.referenceNo}
          </p>
        )}
      </div>
    </div>
  );
}
