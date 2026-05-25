'use client';

import { useState } from 'react';

import { useTranslation } from '@/lib/i18n/TranslationContext';

import { ExpenseReport } from './ExpenseReport';
import { InvoiceReport } from './InvoiceReport';
import { LowStockReport } from './LowStockReport';
import { PaymentReport } from './PaymentReport';
import { ProductReport } from './ProductReport';
import { ProfitReport } from './ProfitReport';
import { ReportFilter } from './ReportFilter';
import type { ReportTab } from './ReportTabs';
import { ReportTabs } from './ReportTabs';
import { SalesReport } from './SalesReport';
import { ServiceJobReport } from './ServiceJobReport';
import { SummaryReport } from './SummaryReport';
import { UnpaidBalanceReport } from './UnpaidBalanceReport';

export function ReportPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ReportTab>('summary');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  return (
    <div className="space-y-4">
      <h2 className="hidden md:block text-xl font-semibold">{t('reports.title')}</h2>

      <ReportFilter
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
      />

      <ReportTabs active={activeTab} onChange={setActiveTab} />

      <div className="pt-2">
        {activeTab === 'summary' && <SummaryReport fromDate={fromDate} toDate={toDate} />}
        {activeTab === 'service-jobs' && <ServiceJobReport fromDate={fromDate} toDate={toDate} />}
        {activeTab === 'invoices' && <InvoiceReport fromDate={fromDate} toDate={toDate} />}
        {activeTab === 'payments' && <PaymentReport fromDate={fromDate} toDate={toDate} />}
        {activeTab === 'sales' && <SalesReport fromDate={fromDate} toDate={toDate} />}
        {activeTab === 'expenses' && <ExpenseReport fromDate={fromDate} toDate={toDate} />}
        {activeTab === 'profit' && <ProfitReport fromDate={fromDate} toDate={toDate} />}
        {activeTab === 'unpaid' && <UnpaidBalanceReport fromDate={fromDate} toDate={toDate} />}
        {activeTab === 'products' && <ProductReport fromDate={fromDate} toDate={toDate} />}
        {activeTab === 'low-stock' && <LowStockReport fromDate={fromDate} toDate={toDate} />}
      </div>
    </div>
  );
}
