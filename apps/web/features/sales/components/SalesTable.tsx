'use client';

import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { PaymentStatus, Sale, SaleStatus } from '../types';

const paymentStatusClass: Record<PaymentStatus, string> = {
  PAID: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
  PARTIAL: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
  UNPAID: 'bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400',
};

const saleStatusClass: Record<SaleStatus, string> = {
  COMPLETED: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
  VOIDED: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
};

function fmt(v: string | number) {
  const n = parseFloat(String(v));
  return isNaN(n) ? '0.00' : n.toFixed(2);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

interface SalesTableProps {
  sales: Sale[];
  onVoid: (sale: Sale) => void;
}

export function SalesTable({ sales, onVoid }: SalesTableProps) {
  const { t } = useTranslation();
  const router = useRouter();

  if (sales.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground text-sm">
        {t('sales.noSales')}
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('sales.invoiceNo')}</TableHead>
            <TableHead>{t('sales.date')}</TableHead>
            <TableHead>{t('sales.customer')}</TableHead>
            <TableHead>{t('sales.mechanic')}</TableHead>
            <TableHead className="text-right">{t('sales.grandTotal')}</TableHead>
            <TableHead className="text-right">{t('sales.paidAmount')}</TableHead>
            <TableHead className="text-right">{t('sales.balanceAmount')}</TableHead>
            <TableHead>{t('sales.paymentStatus')}</TableHead>
            <TableHead>{t('sales.saleStatus')}</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow
              key={sale.id}
              className="cursor-pointer"
              onClick={() => router.push(`/admin/sales/${sale.id}`)}
            >
              <TableCell className="font-mono font-medium text-sm">{sale.invoiceNo}</TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDate(sale.createdAt)}
              </TableCell>
              <TableCell>
                {sale.customer ? (
                  <>
                    <p className="text-sm font-medium">{sale.customer.name}</p>
                    <p className="text-xs text-muted-foreground">{sale.customer.phone}</p>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                {sale.mechanic ? (
                  <p className="text-sm">{sale.mechanic.name}</p>
                ) : (
                  <span className="text-muted-foreground text-sm">—</span>
                )}
              </TableCell>
              <TableCell className="text-right font-mono text-sm font-medium">
                ${fmt(sale.grandTotal)}
              </TableCell>
              <TableCell className="text-right font-mono text-sm text-green-700 dark:text-green-400">
                ${fmt(sale.paidAmount)}
              </TableCell>
              <TableCell className={`text-right font-mono text-sm ${parseFloat(String(sale.balanceAmount)) > 0 ? 'text-amber-700 dark:text-amber-400' : ''}`}>
                ${fmt(sale.balanceAmount)}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={paymentStatusClass[sale.paymentStatus]}>
                  {t(`paymentStatuses.${sale.paymentStatus}`)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={saleStatusClass[sale.saleStatus]}>
                  {t(`saleStatuses.${sale.saleStatus}`)}
                </Badge>
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/admin/sales/${sale.id}`)}>
                      {t('common.view')}
                    </DropdownMenuItem>
                    {sale.saleStatus === 'COMPLETED' && (
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onVoid(sale)}
                      >
                        {t('sales.voidSale')}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
