'use client';

import { useFormContext, useWatch } from 'react-hook-form';

import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { InvoiceFormValues } from './InvoiceForm';

export function InvoiceSummary() {
  const { t } = useTranslation();
  const { control } = useFormContext<InvoiceFormValues>();

  const items = useWatch({ control, name: 'items' }) ?? [];
  const discountAmount = useWatch({ control, name: 'discountAmount' });
  const taxAmount = useWatch({ control, name: 'taxAmount' });

  const subtotal = items.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unitPrice) || 0;
    const disc = parseFloat(item.discountAmount) || 0;
    return sum + Math.max(0, qty * price - disc);
  }, 0);

  const invoiceDiscount = Math.min(parseFloat(discountAmount) || 0, subtotal);
  const tax = parseFloat(taxAmount) || 0;
  const total = Math.max(0, subtotal - invoiceDiscount + tax);

  const Row = ({
    label,
    value,
    bold,
    highlight,
  }: {
    label: string;
    value: string;
    bold?: boolean;
    highlight?: boolean;
  }) => (
    <div
      className={`flex justify-between items-center text-sm ${bold ? 'font-semibold' : ''} ${highlight ? 'text-amber-600 dark:text-amber-400' : ''}`}
    >
      <span className={bold ? '' : 'text-muted-foreground'}>{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );

  return (
    <div className="rounded-lg border bg-card p-4 space-y-2">
      <Row label={t('invoices.subtotal')} value={`$${subtotal.toFixed(2)}`} />
      {invoiceDiscount > 0 && (
        <Row
          label={t('invoices.discountAmount')}
          value={`-$${invoiceDiscount.toFixed(2)}`}
        />
      )}
      {tax > 0 && (
        <Row label={t('invoices.taxAmount')} value={`+$${tax.toFixed(2)}`} />
      )}
      <Separator />
      <Row label={t('invoices.totalAmount')} value={`$${total.toFixed(2)}`} bold />
      <Row label={t('invoices.paidAmount')} value="$0.00" />
      <Row
        label={t('invoices.dueAmount')}
        value={`$${total.toFixed(2)}`}
        bold
        highlight
      />
    </div>
  );
}
