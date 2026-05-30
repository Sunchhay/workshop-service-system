'use client';

import { Package } from 'lucide-react';

import { AppEmptyState } from '@/components/app/AppEmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetReportLowStockQuery } from '../api';

interface Props { fromDate: string; toDate: string; }

export function LowStockReport({ fromDate: _fromDate, toDate: _toDate }: Props) {
  const { t } = useTranslation();
  const { data, isLoading } = useGetReportLowStockQuery();
  const products = data?.data ?? [];

  return (
    <div className="space-y-4">
      {!isLoading && products.length > 0 && (
        <p className="text-xs text-muted-foreground">{products.length} {t('reports.totalRecords')}</p>
      )}

      {isLoading && <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}</div>}

      {!isLoading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <Package className="h-10 w-10 text-green-500/50" />
          <p className="text-sm font-medium text-muted-foreground">{t('reports.noData')}</p>
          <p className="text-xs text-muted-foreground/70">All products are well-stocked.</p>
        </div>
      )}

      {!isLoading && products.length > 0 && (
        <div className="hidden md:block rounded-xl border overflow-hidden">
          <table className="w-full text-sm bg-card">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.productCode')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.productName')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.category')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.supplier')}</th>
                <th className="text-right px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.stockQuantity')}</th>
                <th className="text-right px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.reorderLevel')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map(p => (
                <tr key={p.id} className="bg-amber-500/5 hover:bg-amber-500/10 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-semibold">{p.code}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-sm">{p.name}</p>
                    {p.componentPartType && <p className="text-xs text-muted-foreground">{p.componentPartType}</p>}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{p.category ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{p.supplier ?? '—'}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-amber-700 dark:text-amber-400">{p.stockQuantity}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-muted-foreground">{p.reorderLevel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && products.length > 0 && (
        <div className="md:hidden space-y-3">
          {products.map(p => (
            <Card key={p.id} className="border-amber-500/30 bg-amber-500/5">
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs font-semibold">{p.code}</p>
                    <p className="text-sm font-medium mt-0.5 truncate">{p.name}</p>
                    {p.supplier && <p className="text-xs text-muted-foreground">{p.supplier}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono text-sm font-semibold text-amber-700 dark:text-amber-400">{p.stockQuantity}</p>
                    <p className="text-xs text-muted-foreground">min: {p.reorderLevel}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
