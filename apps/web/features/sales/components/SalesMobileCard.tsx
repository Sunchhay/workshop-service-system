'use client';

import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

interface SalesMobileCardProps {
  sale: Sale;
  onVoid: (sale: Sale) => void;
}

export function SalesMobileCard({ sale, onVoid }: SalesMobileCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Link href={`/admin/sales/${sale.id}`} className="block p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-medium text-muted-foreground">
                  {sale.invoiceNo}
                </span>
                <span className="text-xs text-muted-foreground">{formatDate(sale.createdAt)}</span>
              </div>
              {sale.customer ? (
                <>
                  <p className="font-semibold text-sm truncate">{sale.customer.name}</p>
                  <p className="text-xs text-muted-foreground">{sale.customer.phone}</p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">—</p>
              )}
              {sale.mechanic && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t('sales.mechanic')}: {sale.mechanic.name}
                </p>
              )}
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="font-mono font-medium">${fmt(sale.grandTotal)}</span>
                {parseFloat(String(sale.balanceAmount)) > 0 && (
                  <span className="text-amber-700 dark:text-amber-400 font-mono">
                    -{t('sales.balanceAmount')} ${fmt(sale.balanceAmount)}
                  </span>
                )}
              </div>
            </div>
            <div className="shrink-0" onClick={(e) => e.preventDefault()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/sales/${sale.id}`}>{t('common.view')}</Link>
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
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="outline" className={paymentStatusClass[sale.paymentStatus]}>
              {t(`paymentStatuses.${sale.paymentStatus}`)}
            </Badge>
            <Badge variant="outline" className={saleStatusClass[sale.saleStatus]}>
              {t(`saleStatuses.${sale.saleStatus}`)}
            </Badge>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
