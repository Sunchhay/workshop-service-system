'use client';

import { useState } from 'react';

import { useTranslation } from '@/lib/i18n/TranslationContext';

import { CustomerDebtReport } from './CustomerDebtReport';
import { ExpenseReport } from './ExpenseReport';
import { MechanicCommissionReport } from './MechanicCommissionReport';
import { PaymentReport } from './PaymentReport';
import { ProductSalesReport } from './ProductSalesReport';
import { ProfitReport } from './ProfitReport';
import { ReportFilter } from './ReportFilter';
import type { ReportTab } from './ReportTabs';
import { ReportTabs } from './ReportTabs';
import { SalesReport } from './SalesReport';
import { ServiceUsageReport } from './ServiceUsageReport';

export function ReportPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ReportTab>('sales');
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
        {activeTab === 'sales' && <SalesReport fromDate={fromDate} toDate={toDate} />}
        {activeTab === 'payments' && <PaymentReport fromDate={fromDate} toDate={toDate} />}
        {activeTab === 'expenses' && <ExpenseReport fromDate={fromDate} toDate={toDate} />}
        {activeTab === 'profit' && <ProfitReport fromDate={fromDate} toDate={toDate} />}
        {activeTab === 'mechanic-commissions' && <MechanicCommissionReport fromDate={fromDate} toDate={toDate} />}
        {activeTab === 'customer-debts' && <CustomerDebtReport fromDate={fromDate} toDate={toDate} />}
        {activeTab === 'service-usage' && <ServiceUsageReport fromDate={fromDate} toDate={toDate} />}
        {activeTab === 'product-sales' && <ProductSalesReport fromDate={fromDate} toDate={toDate} />}
      </div>
    </div>
  );
}
