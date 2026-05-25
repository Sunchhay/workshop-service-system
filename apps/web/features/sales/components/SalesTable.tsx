'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { MoreHorizontal } from 'lucide-react';

import type { Sale, SaleStatus } from '../types';

const statusClass: Record<SaleStatus, string> = {
  DRAFT: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
  COMPLETED: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
  CANCELLED: 'bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400',
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

interface SalesTableProps {
  sales: Sale[];
  onCancel: (sale: Sale) => void;
  onDelete: (sale: Sale) => void;
  onComplete?: (sale: Sale) => void;
}

export function SalesTable({ sales, onCancel, onDelete, onComplete }: SalesTableProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('sales.saleNumber')}</TableHead>
            <TableHead>{t('sales.customer')}</TableHead>
            <TableHead>{t('sales.status')}</TableHead>
            <TableHead>{t('sales.totalAmount')}</TableHead>
            <TableHead>{t('sales.soldAt')}</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                {t('sales.noSales')}
              </TableCell>
            </TableRow>
          ) : (
            sales.map((sale) => (
              <TableRow
                key={sale.id}
                className="cursor-pointer"
                onClick={() => router.push(`/admin/sales/${sale.id}`)}
              >
                <TableCell>
                  <div>
                    <p className="font-mono font-medium text-sm">{sale.saleNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {sale.items.length} {sale.items.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {sale.customer ? (
                    <div>
                      <p className="text-sm font-medium">{sale.customer.name}</p>
                      {sale.customer.phone && (
                        <p className="text-xs text-muted-foreground">{sale.customer.phone}</p>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">{t('sales.walkIn')}</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusClass[sale.status]}>
                    {t(`saleStatuses.${sale.status}`)}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm font-medium">
                  ${parseFloat(sale.totalAmount).toFixed(2)}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(sale.soldAt)}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/sales/${sale.id}`}>{t('sales.saleDetail')}</Link>
                      </DropdownMenuItem>
                      {sale.status === 'DRAFT' && (
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/sales/${sale.id}/edit`}>{t('sales.continueDraft')}</Link>
                        </DropdownMenuItem>
                      )}
                      {sale.status === 'DRAFT' && onComplete && (
                        <DropdownMenuItem onClick={() => onComplete(sale)}>
                          {t('sales.completeSale')}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      {sale.status !== 'CANCELLED' && (
                        <DropdownMenuItem
                          onClick={() => onCancel(sale)}
                          className="text-destructive focus:text-destructive"
                        >
                          {t('sales.confirmCancelTitle')}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => onDelete(sale)}
                        className="text-destructive focus:text-destructive"
                      >
                        {t('common.delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
