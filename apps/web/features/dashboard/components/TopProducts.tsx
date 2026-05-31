'use client';

import { Package } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetTopProductsQuery } from '../api';

function fmt(v: string | number) {
  const n = parseFloat(String(v));
  return isNaN(n) ? '0.00' : n.toFixed(2);
}

export function TopProducts() {
  const { t } = useTranslation();
  const { data, isLoading } = useGetTopProductsQuery();
  const products = data?.data ?? [];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">{t('dashboard.topProducts')}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 gap-2 text-muted-foreground">
            <Package className="h-8 w-8 opacity-30" />
            <p className="text-sm">{t('dashboard.noData')}</p>
          </div>
        ) : (
          <div className="space-y-1">
            {products.map((prod, idx) => (
              <div key={prod.productId} className="flex items-center gap-3 p-2.5 rounded-lg">
                <span className="text-xs font-mono text-muted-foreground w-4 shrink-0 text-right">{idx + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{prod.name}</p>
                  <p className="text-xs text-muted-foreground">{t('dashboard.qty')}: {prod.quantity}</p>
                </div>
                <p className="font-mono text-sm font-semibold shrink-0">${fmt(prod.total)}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
