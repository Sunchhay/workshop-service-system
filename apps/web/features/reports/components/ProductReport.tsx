'use client';

import { Package } from 'lucide-react';
import { useState } from 'react';

import { AppEmptyState } from '@/components/app/AppEmptyState';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetReportProductsQuery } from '../api';

function fmtAmt(v: string) { return `$${parseFloat(v).toFixed(2)}`; }

interface Props { fromDate: string; toDate: string; }

export function ProductReport({ fromDate, toDate }: Props) {
  const { t } = useTranslation();
  const [isActive, setIsActive] = useState('__all');
  const [isLowStock, setIsLowStock] = useState('__all');

  const { data, isLoading } = useGetReportProductsQuery({
    isActive: isActive === '__all' ? undefined : isActive === 'true',
    isLowStock: isLowStock === 'true' ? true : undefined,
  });
  const products = data?.data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <Select value={isActive} onValueChange={setIsActive}>
          <SelectTrigger className="w-36 h-8 text-xs"><SelectValue placeholder={t('common.status')} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">{t('reports.allStatuses')}</SelectItem>
            <SelectItem value="true">{t('common.active')}</SelectItem>
            <SelectItem value="false">{t('common.inactive')}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={isLowStock} onValueChange={setIsLowStock}>
          <SelectTrigger className="w-36 h-8 text-xs"><SelectValue placeholder={t('reports.lowStockFlag')} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">{t('reports.allStatuses')}</SelectItem>
            <SelectItem value="true">{t('reports.lowStockFlag')}</SelectItem>
          </SelectContent>
        </Select>
        {!isLoading && <p className="text-xs text-muted-foreground self-center">{products.length} {t('reports.totalRecords')}</p>}
      </div>

      {isLoading && <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}</div>}
      {!isLoading && products.length === 0 && <AppEmptyState icon={Package} title={t('reports.noData')} description={t('reports.noDataDesc')} />}

      {!isLoading && products.length > 0 && (
        <div className="hidden md:block rounded-xl border overflow-hidden">
          <table className="w-full text-sm bg-card">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.productCode')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.productName')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.category')}</th>
                <th className="text-right px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.stockQuantity')}</th>
                <th className="text-right px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.reorderLevel')}</th>
                <th className="text-right px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.costPrice')}</th>
                <th className="text-right px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.sellingPrice')}</th>
                <th className="text-center px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map(p => (
                <tr key={p.id} className={`hover:bg-muted/30 transition-colors ${p.isLowStock ? 'bg-amber-500/5' : ''}`}>
                  <td className="px-4 py-3 font-mono text-xs font-semibold">{p.code}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-sm">{p.name}</p>
                    {p.componentPartType && <p className="text-xs text-muted-foreground">{p.componentPartType}</p>}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{p.category ?? '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-mono text-sm font-semibold ${p.isLowStock ? 'text-amber-700 dark:text-amber-400' : ''}`}>{p.stockQuantity}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-muted-foreground">{p.reorderLevel}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-muted-foreground">{fmtAmt(p.costPrice)}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-semibold">{fmtAmt(p.sellingPrice)}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex gap-1 justify-center flex-wrap">
                      {p.isLowStock && (
                        <Badge variant="outline" className="text-[10px] py-0 bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400">
                          {t('reports.lowStockFlag')}
                        </Badge>
                      )}
                      <Badge variant="outline" className={`text-[10px] py-0 ${p.isActive ? 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400' : 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400'}`}>
                        {p.isActive ? t('common.active') : t('common.inactive')}
                      </Badge>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && products.length > 0 && (
        <div className="md:hidden space-y-3">
          {products.map(p => (
            <Card key={p.id} className={p.isLowStock ? 'border-amber-500/30' : ''}>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs font-semibold">{p.code}</p>
                    <p className="text-sm font-medium mt-0.5 truncate">{p.name}</p>
                    {p.componentPartType && <p className="text-xs text-muted-foreground">{p.componentPartType}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {p.isLowStock && (
                      <Badge variant="outline" className="text-[10px] py-0 bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400">
                        {t('reports.lowStockFlag')}
                      </Badge>
                    )}
                    <p className={`font-mono text-sm font-semibold ${p.isLowStock ? 'text-amber-700 dark:text-amber-400' : ''}`}>{p.stockQuantity} in stock</p>
                    <p className="text-xs text-muted-foreground">{fmtAmt(p.sellingPrice)}</p>
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
