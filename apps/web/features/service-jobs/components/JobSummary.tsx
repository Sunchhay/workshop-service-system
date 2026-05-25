'use client';

import { useFormContext, useWatch } from 'react-hook-form';

import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { ServiceJobFormValues } from './ServiceJobForm';

export function JobSummary() {
  const { t } = useTranslation();
  const { control } = useFormContext<ServiceJobFormValues>();
  const items = useWatch({ control, name: 'items' });

  const total = (items ?? []).reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unitPrice) || 0;
    return sum + qty * price;
  }, 0);

  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-2">
      <Separator />
      <div className="flex items-center justify-between text-sm font-medium py-1">
        <span>{t('serviceJobs.jobTotal')}</span>
        <span className="font-mono text-base">
          ${total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
