'use client';

import { cn } from '@/lib/utils';
import type { TranslationKey } from '@/lib/i18n/TranslationContext';
import { useTranslation } from '@/lib/i18n/TranslationContext';

export type ReportTab =
  | 'summary'
  | 'invoices'
  | 'payments'
  | 'sales'
  | 'expenses'
  | 'profit'
  | 'unpaid'
  | 'products'
  | 'low-stock';

interface TabDef {
  id: ReportTab;
  labelKey: TranslationKey;
}

const TABS: TabDef[] = [
  { id: 'summary', labelKey: 'reports.tabSummary' },
  { id: 'invoices', labelKey: 'reports.tabInvoices' },
  { id: 'payments', labelKey: 'reports.tabPayments' },
  { id: 'sales', labelKey: 'reports.tabSales' },
  { id: 'expenses', labelKey: 'reports.tabExpenses' },
  { id: 'profit', labelKey: 'reports.tabProfit' },
  { id: 'unpaid', labelKey: 'reports.tabUnpaid' },
  { id: 'products', labelKey: 'reports.tabProducts' },
  { id: 'low-stock', labelKey: 'reports.tabLowStock' },
];

interface ReportTabsProps {
  active: ReportTab;
  onChange: (tab: ReportTab) => void;
}

export function ReportTabs({ active, onChange }: ReportTabsProps) {
  const { t } = useTranslation();

  return (
    <div className="relative">
      <div className="flex overflow-x-auto scrollbar-none gap-1 pb-1 -mb-px">
        {TABS.map(({ id, labelKey }) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              'shrink-0 px-3 py-2 text-sm rounded-t-md border-b-2 transition-colors whitespace-nowrap',
              active === id
                ? 'border-primary text-primary font-medium bg-primary/5'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50',
            )}
          >
            {t(labelKey)}
          </button>
        ))}
      </div>
      <div className="border-b" />
    </div>
  );
}
