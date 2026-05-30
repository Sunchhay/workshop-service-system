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

import { getProductDisplayName } from '@/lib/display-name';

import type { Product } from '../types';

function isLowStock(p: Product) {
  return p.stockQuantity <= p.reorderLevel;
}

interface ProductMobileCardProps {
  product: Product;
  onToggleStatus: (product: Product) => void;
  onDelete: (product: Product) => void;
  onAdjustStock: (product: Product) => void;
}

export function ProductMobileCard({
  product,
  onToggleStatus,
  onDelete,
  onAdjustStock,
}: ProductMobileCardProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const low = isLowStock(product);

  return (
    <div
      className="flex items-start gap-3 rounded-xl border bg-card p-4  cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => router.push(`/admin/products/${product.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ')
          router.push(`/admin/products/${product.id}`);
      }}
    >
      {/* Thumbnail */}
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={getProductDisplayName(product)}
          className="h-12 w-12 rounded-lg object-cover shrink-0"
          loading="lazy"
        />
      ) : (
        <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0 text-xl">
          📦
        </div>
      )}

      {/* Main info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2 flex-wrap">
          <span className="font-medium text-sm">{getProductDisplayName(product)}</span>
          <Badge variant="outline" className="font-mono text-xs px-1.5">
            {product.code}
          </Badge>
        </div>
        {product.nameKh && (
          <p className="text-xs text-muted-foreground mt-0.5">{product.nameEn}</p>
        )}
        {(product.brand || product.componentPartType) && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {[product.brand, product.componentPartType].filter(Boolean).join(' · ')}
          </p>
        )}
        {(product.category || product.size) && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {[product.category, product.size].filter(Boolean).join(' · ')}
          </p>
        )}
        <p className="text-xs font-mono text-foreground mt-0.5">
          ${parseFloat(product.sellingPrice).toFixed(2)}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Badge
            variant="outline"
            className={
              low
                ? 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400'
                : 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400'
            }
          >
            {product.stockQuantity} {product.unit}
            {low && ` · ${t('products.lowStock')}`}
          </Badge>
          <Badge
            variant={product.isActive ? 'default' : 'outline'}
            className={
              product.isActive
                ? 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400'
                : 'text-muted-foreground'
            }
          >
            {t(product.isActive ? 'common.active' : 'common.inactive')}
          </Badge>
        </div>
      </div>

      {/* Actions */}
      <div onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/products/${product.id}`}>
                {t('products.productDetail')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/products/${product.id}/edit`}>
                {t('common.edit')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAdjustStock(product)}>
              {t('products.adjustStock')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onToggleStatus(product)}
              className={
                product.isActive
                  ? 'text-destructive focus:text-destructive'
                  : 'text-green-600 focus:text-green-600'
              }
            >
              {product.isActive
                ? t('products.confirmDisableTitle')
                : t('products.confirmEnableTitle')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(product)}
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
