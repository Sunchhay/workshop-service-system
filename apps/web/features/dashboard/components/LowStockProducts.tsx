'use client';

import Link from 'next/link';
import { AlertTriangle, ArrowRight, Package } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetLowStockProductsQuery } from '../api';

export function LowStockProducts() {
  const { t } = useTranslation();
  const { data, isLoading } = useGetLowStockProductsQuery();
  const products = data?.data ?? [];

  if (!isLoading && products.length === 0) return null;

  return (
    <Card className="border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <CardTitle className="text-sm font-semibold text-amber-700 dark:text-amber-400">
              {t('dashboard.lowStockProducts')}
            </CardTitle>
          </div>
          <Button asChild variant="ghost" size="sm" className="h-7 text-xs gap-1">
            <Link href="/admin/products">
              {t('dashboard.viewAll')}
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}`}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-amber-500/10 transition-colors"
              >
                <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                  <Package className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.code}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono text-sm font-semibold text-amber-700 dark:text-amber-400">
                    {product.stockQuantity} {product.unit}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('dashboard.reorderAt')} {product.reorderLevel}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
