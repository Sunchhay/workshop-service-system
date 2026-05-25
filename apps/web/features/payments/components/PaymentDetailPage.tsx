'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetPaymentQuery } from '../api';
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
    month: 'long',
    day: 'numeric',
  });
}

export function PaymentDetailPage({ id }: { id: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading } = useGetPaymentQuery(id);
  const payment = data?.data;

  return (
    <div className="space-y-4">
      <div className="hidden md:flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{t('payments.paymentDetail')}</h2>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-64" />
          </CardContent>
        </Card>
      ) : payment ? (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <CardTitle className="font-mono">{payment.paymentNumber}</CardTitle>
                  <Badge variant="outline" className={methodClass[payment.method]}>
                    {t(`paymentMethods.${payment.method}`)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {payment.customer.name}
                  {payment.customer.phone && ` · ${payment.customer.phone}`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-mono font-bold">
                  ${parseFloat(payment.amount).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">{formatDate(payment.paidAt)}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
              <div>
                <p className="text-muted-foreground text-xs mb-1">{t('payments.invoice')}</p>
                <Link
                  href={`/admin/invoices/${payment.invoice.id}`}
                  className="font-mono font-medium hover:underline"
                >
                  {payment.invoice.invoiceNumber}
                </Link>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">{t('payments.customer')}</p>
                <p>{payment.customer.name}</p>
              </div>
              {payment.referenceNo && (
                <div>
                  <p className="text-muted-foreground text-xs mb-1">{t('payments.referenceNo')}</p>
                  <p className="font-mono">{payment.referenceNo}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground text-xs mb-1">{t('payments.createdBy')}</p>
                <p>{payment.createdBy.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">{t('payments.createdAt')}</p>
                <p>{formatDate(payment.createdAt)}</p>
              </div>
            </div>

            {/* Invoice status at time of this payment */}
            <Separator />
            <div className="rounded-lg bg-muted/50 px-4 py-3 text-sm space-y-1.5">
              <p className="text-xs text-muted-foreground uppercase mb-2">{t('payments.invoice')}</p>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('invoices.totalAmount')}</span>
                <span className="font-mono">${parseFloat(payment.invoice.totalAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('invoices.paidAmount')}</span>
                <span className="font-mono text-green-700 dark:text-green-400">
                  ${parseFloat(payment.invoice.paidAmount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-medium">
                <span>{t('invoices.dueAmount')}</span>
                <span className={`font-mono ${parseFloat(payment.invoice.dueAmount) > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-green-700 dark:text-green-400'}`}>
                  ${parseFloat(payment.invoice.dueAmount).toFixed(2)}
                </span>
              </div>
            </div>

            {payment.notes && (
              <>
                <Separator />
                <div className="text-sm">
                  <p className="text-muted-foreground text-xs mb-1">{t('payments.notes')}</p>
                  <p className="whitespace-pre-line text-muted-foreground">{payment.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <p className="text-muted-foreground">{t('common.error')}</p>
      )}
    </div>
  );
}
