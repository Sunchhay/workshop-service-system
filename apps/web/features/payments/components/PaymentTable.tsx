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

interface PaymentTableProps {
  payments: Payment[];
}

export function PaymentTable({ payments }: PaymentTableProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('payments.paymentNumber')}</TableHead>
            <TableHead>{t('payments.customer')}</TableHead>
            <TableHead>{t('payments.invoice')}</TableHead>
            <TableHead>{t('payments.amount')}</TableHead>
            <TableHead>{t('payments.method')}</TableHead>
            <TableHead>{t('payments.paidAt')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                {t('payments.noPayments')}
              </TableCell>
            </TableRow>
          ) : (
            payments.map((pay) => (
              <TableRow
                key={pay.id}
                className="cursor-pointer"
                onClick={() => router.push(`/admin/payments/${pay.id}`)}
              >
                <TableCell className="font-mono font-medium text-sm">
                  {pay.paymentNumber}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm font-medium">{pay.customer.name}</p>
                    {pay.customer.phone && (
                      <p className="text-xs text-muted-foreground">{pay.customer.phone}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/admin/invoices/${pay.invoice.id}`}
                    className="font-mono text-sm hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {pay.invoice.invoiceNumber}
                  </Link>
                </TableCell>
                <TableCell className="font-mono text-sm font-medium">
                  ${parseFloat(pay.amount).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={methodClass[pay.method]}>
                    {t(`paymentMethods.${pay.method}`)}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(pay.paidAt)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
