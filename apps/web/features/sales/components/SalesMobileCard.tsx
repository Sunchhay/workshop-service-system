'use client';

import { MoreHorizontal } from 'lucide-react';
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
import { useTranslation } from '@/lib/i18n/TranslationContext';

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

interface SalesMobileCardProps {
  sale: Sale;
  onCancel: (sale: Sale) => void;
  onDelete: (sale: Sale) => void;
  onComplete?: (sale: Sale) => void;
}

export function SalesMobileCard({ sale, onCancel, onDelete, onComplete }: SalesMobileCardProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div
      className="rounded-xl border bg-card  overflow-hidden"
    >
      {/* Card body — tappable */}
      <div
        className="flex items-start gap-3 p-4 cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={() => router.push(`/admin/sales/${sale.id}`)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') router.push(`/admin/sales/${sale.id}`);
        }}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-medium text-sm">{sale.saleNumber}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {sale.customer ? sale.customer.name : t('sales.walkIn')}
          </p>
          <p className="text-xs text-muted-foreground">
            {sale.items.length} {sale.items.length === 1 ? 'item' : 'items'} · {formatDate(sale.soldAt)}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-sm font-medium">
              ${parseFloat(sale.totalAmount).toFixed(2)}
            </span>
          </div>
          <div className="mt-2">
            <Badge variant="outline" className={statusClass[sale.status]}>
              {t(`saleStatuses.${sale.status}`)}
            </Badge>
          </div>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
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
        </div>
      </div>

      {/* Draft action bar — visible, touch-friendly */}
      {sale.status === 'DRAFT' && (
        <div className="flex gap-2 px-4 pb-4 border-t pt-3">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href={`/admin/sales/${sale.id}/edit`}>
              {t('sales.continueDraft')}
            </Link>
          </Button>
          {onComplete && (
            <Button
              size="sm"
              className="flex-1"
              onClick={(e) => { e.stopPropagation(); onComplete(sale); }}
            >
              {t('sales.completeSale')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
