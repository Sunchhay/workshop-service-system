'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

interface PaymentTableProps {
  payments: Payment[];
}

export function PaymentTable({ payments }: PaymentTableProps) {
  const { t } = useTranslation();
  const router = useRouter();

  if (payments.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground text-sm">
        {t('payments.noPayments')}
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('payments.paymentMethod')}</TableHead>
            <TableHead>{t('payments.sale')}</TableHead>
            <TableHead>{t('payments.referenceNo')}</TableHead>
            <TableHead>{t('payments.paidAt')}</TableHead>
            <TableHead className="text-right">{t('payments.amount')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((pay) => (
            <TableRow
              key={pay.id}
              className="cursor-pointer"
              onClick={() => router.push(`/admin/payments/${pay.id}`)}
            >
              <TableCell>
                <Badge variant="outline" className={methodClass[pay.paymentMethod]}>
                  {t(`paymentMethods.${pay.paymentMethod}`)}
                </Badge>
              </TableCell>
              <TableCell>
                {pay.sale ? (
                  <Link
                    href={`/admin/sales/${pay.sale.id}`}
                    className="font-mono text-sm hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {pay.sale.invoiceNo}
                  </Link>
                ) : (
                  <span className="text-muted-foreground text-sm">—</span>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {pay.referenceNo ?? '—'}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDate(pay.paidAt)}
              </TableCell>
              <TableCell className="text-right font-mono font-medium text-sm">
                ${fmt(pay.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
