'use client';

import { useFormContext, useWatch } from 'react-hook-form';

import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { SalesFormValues } from './SalesForm';

export function SalesSummary() {
  const { t } = useTranslation();
  const { control } = useFormContext<SalesFormValues>();

  const items = useWatch({ control, name: 'items' }) ?? [];
  const discountAmount = useWatch({ control, name: 'discountAmount' });

  const subtotal = items.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unitPrice) || 0;
    const disc = parseFloat(item.discountAmount) || 0;
    return sum + Math.max(0, qty * price - disc);
  }, 0);

  const saleDiscount = Math.min(parseFloat(discountAmount) || 0, subtotal);
  const total = Math.max(0, subtotal - saleDiscount);

  return (
    <div className="rounded-lg border bg-card p-4 space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">{t('sales.subtotal')}</span>
        <span className="font-mono">${subtotal.toFixed(2)}</span>
      </div>
      {saleDiscount > 0 && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">{t('sales.discountAmount')}</span>
          <span className="font-mono text-destructive">-${saleDiscount.toFixed(2)}</span>
        </div>
      )}
      <Separator />
      <div className="flex justify-between items-center text-sm font-semibold">
        <span>{t('sales.totalAmount')}</span>
        <span className="font-mono">${total.toFixed(2)}</span>
      </div>
    </div>
  );
}
