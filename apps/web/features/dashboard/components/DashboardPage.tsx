'use client';

import {
  AlertTriangle,
  Banknote,
  DollarSign,
  Receipt,
  ShoppingBag,
  TrendingDown,
  Users,
} from 'lucide-react';

import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetDashboardSummaryQuery } from '../api';
import { DashboardQuickActions } from './DashboardQuickActions';
import { DashboardSummaryCard } from './DashboardSummaryCard';
import { PaymentSummary } from './PaymentSummary';
import { RecentSales } from './RecentSales';
import { TopProducts } from './TopProducts';
import { TopServices } from './TopServices';

function fmtMoney(v: number) {
  return `$${v.toFixed(2)}`;
}

export function DashboardPage() {
  const { t } = useTranslation();
  const { data, isLoading } = useGetDashboardSummaryQuery();
  const s = data?.data;

  const unpaidSales = s?.unpaidSalesAmount ?? 0;
  const unpaidCommission = s?.unpaidCommissionAmount ?? 0;

  return (
    <div className="space-y-6">
      <div className="hidden md:block">
        <h2 className="text-xl font-semibold">{t('dashboard.greeting')}</h2>
      </div>

      <section>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          {t('dashboard.quickActions')}
        </p>
        <DashboardQuickActions />
      </section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <DashboardSummaryCard
          title={t('dashboard.todaySales')}
          value={isLoading ? '—' : fmtMoney(s?.todaySales ?? 0)}
          subtitle={t('dashboard.todaySubtitle')}
          icon={Receipt}
          iconClass="bg-green-500/10 text-green-600 dark:text-green-400"
          href="/admin/sales"
          isLoading={isLoading}
        />

        <DashboardSummaryCard
          title={t('dashboard.todayOrders')}
          value={isLoading ? '—' : (s?.todayOrders ?? 0)}
          subtitle={t('dashboard.todaySubtitle')}
          icon={ShoppingBag}
          iconClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          href="/admin/sales"
          isLoading={isLoading}
        />

        <DashboardSummaryCard
          title={t('dashboard.thisMonthSales')}
          value={isLoading ? '—' : fmtMoney(s?.thisMonthSales ?? 0)}
          subtitle={t('dashboard.monthSubtitle')}
          icon={DollarSign}
          iconClass="bg-purple-500/10 text-purple-600 dark:text-purple-400"
          href="/admin/sales"
          isLoading={isLoading}
        />

        <DashboardSummaryCard
          title={t('dashboard.totalCustomers')}
          value={isLoading ? '—' : (s?.totalCustomers ?? 0)}
          icon={Users}
          iconClass="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
          href="/admin/customers"
          isLoading={isLoading}
        />

        <DashboardSummaryCard
          title={t('dashboard.unpaidSalesAmount')}
          value={isLoading ? '—' : fmtMoney(unpaidSales)}
          icon={AlertTriangle}
          iconClass="bg-red-500/10 text-red-600 dark:text-red-400"
          highlight={unpaidSales > 0 ? 'danger' : undefined}
          href="/admin/sales"
          isLoading={isLoading}
        />

        <DashboardSummaryCard
          title={t('dashboard.unpaidCommission')}
          value={isLoading ? '—' : fmtMoney(unpaidCommission)}
          icon={Banknote}
          iconClass="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          highlight={unpaidCommission > 0 ? 'warn' : undefined}
          href="/admin/sales"
          isLoading={isLoading}
        />

        <DashboardSummaryCard
          title={t('dashboard.expensesToday')}
          value={isLoading ? '—' : fmtMoney(s?.todayExpenses ?? 0)}
          subtitle={t('dashboard.todaySubtitle')}
          icon={TrendingDown}
          iconClass="bg-orange-500/10 text-orange-600 dark:text-orange-400"
          href="/admin/expenses"
          isLoading={isLoading}
        />

        <DashboardSummaryCard
          title={t('dashboard.expensesMonth')}
          value={isLoading ? '—' : fmtMoney(s?.thisMonthExpenses ?? 0)}
          subtitle={t('dashboard.monthSubtitle')}
          icon={TrendingDown}
          iconClass="bg-orange-500/10 text-orange-600 dark:text-orange-400"
          href="/admin/expenses"
          isLoading={isLoading}
        />
      </div>

      <RecentSales />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TopServices />
        <TopProducts />
      </div>

      <PaymentSummary />
    </div>
  );
}
