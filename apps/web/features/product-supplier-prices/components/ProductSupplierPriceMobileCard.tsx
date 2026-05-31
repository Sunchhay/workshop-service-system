'use client';

import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { ProductSupplierPrice } from '../types';

function formatPrice(value: string | number | null | undefined) {
  if (value == null) return '—';
  const n = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(n) ? '—' : n.toFixed(2);
}

function formatDate(d: string | null | undefined) {
  if (!d) return null;
  return new Date(d).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

interface ProductSupplierPriceMobileCardProps {
  entry: ProductSupplierPrice;
  onDelete: (entry: ProductSupplierPrice) => void;
}

export function ProductSupplierPriceMobileCard({
  entry,
  onDelete,
}: ProductSupplierPriceMobileCardProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div
      className="flex items-start gap-3 rounded-xl border bg-card p-4 cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => router.push(`/admin/product-supplier-prices/${entry.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ')
          router.push(`/admin/product-supplier-prices/${entry.id}`);
      }}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2 flex-wrap">
          <span className="font-medium text-sm">{entry.product.name}</span>
          <span className="text-xs text-muted-foreground font-mono">{entry.product.code}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{entry.supplier.name}</p>
        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          <span>
            <span className="text-muted-foreground">
              {t('productSupplierPrices.buyingPrice')}:{' '}
            </span>
            <span className="font-mono font-medium">
              {formatPrice(entry.buyingPrice)} {entry.currency || 'USD'}
            </span>
          </span>
          {formatDate(entry.lastUpdatedAt) && (
            <span>
              <span className="text-muted-foreground">
                {t('productSupplierPrices.lastUpdatedAt')}:{' '}
              </span>
              <span>{formatDate(entry.lastUpdatedAt)}</span>
            </span>
          )}
        </div>
        {entry.note && (
          <p className="text-xs text-muted-foreground mt-1 truncate">{entry.note}</p>
        )}
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
              <Link href={`/admin/product-supplier-prices/${entry.id}`}>
                {t('productSupplierPrices.entryDetail')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/product-supplier-prices/${entry.id}/edit`}>
                {t('common.edit')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(entry)}
              className="text-destructive focus:text-destructive"
            >
              {t('common.delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
