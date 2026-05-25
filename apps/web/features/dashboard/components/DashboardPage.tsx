'use client';

import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Clock,
  CreditCard,
  DollarSign,
  Package,
  Receipt,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';

import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetDashboardSummaryQuery } from '../api';
import { DashboardQuickActions } from './DashboardQuickActions';
import { DashboardSummaryCard } from './DashboardSummaryCard';
import { LowStockProducts } from './LowStockProducts';
import { RecentServiceJobs } from './RecentServiceJobs';
import { RecentTransactions } from './RecentTransactions';

function fmt(v: string) {
  const n = parseFloat(v);
  return isNaN(n) ? '$0.00' : `$${n.toFixed(2)}`;
}

export function DashboardPage() {
  const { t } = useTranslation();
  const { data, isLoading } = useGetDashboardSummaryQuery();
  const s = data?.data;

  const unpaidNum = parseFloat(s?.totalUnpaidAmount ?? '0');

  return (
    <div className="space-y-6">
      {/* Page title — desktop only */}
      <div className="hidden md:block">
        <h2 className="text-xl font-semibold">{t('dashboard.greeting')}</h2>
      </div>

      {/* Quick actions */}
      <section>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          {t('dashboard.quickActions')}
        </p>
        <DashboardQuickActions />
      </section>

      {/* Summary cards grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {/* Customers */}
        <DashboardSummaryCard
          title={t('dashboard.totalCustomers')}
          value={isLoading ? '—' : (s?.totalCustomers ?? 0)}
          icon={Users}
          iconClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          href="/admin/customers"
          isLoading={isLoading}
        />

        {/* Today's new jobs */}
        <DashboardSummaryCard
          title={t('dashboard.todayNewJobs')}
          value={isLoading ? '—' : (s?.todayNewJobs ?? 0)}
          subtitle={t('dashboard.todaySubtitle')}
          icon={ClipboardList}
          iconClass="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
          href="/admin/service-jobs"
          isLoading={isLoading}
        />

        {/* Pending */}
        <DashboardSummaryCard
          title={t('dashboard.pendingJobs')}
          value={isLoading ? '—' : (s?.pendingJobs ?? 0)}
          subtitle={t('dashboard.jobsSubtitle')}
          icon={Clock}
          iconClass="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          highlight={s && s.pendingJobs > 0 ? 'warn' : undefined}
          href="/admin/service-jobs"
          isLoading={isLoading}
        />

        {/* In Progress */}
        <DashboardSummaryCard
          title={t('dashboard.inProgressJobs')}
          value={isLoading ? '—' : (s?.inProgressJobs ?? 0)}
          subtitle={t('dashboard.jobsSubtitle')}
          icon={TrendingUp}
          iconClass="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
          href="/admin/service-jobs"
          isLoading={isLoading}
        />

        {/* Completed */}
        <DashboardSummaryCard
          title={t('dashboard.completedJobs')}
          value={isLoading ? '—' : (s?.completedJobs ?? 0)}
          subtitle={t('dashboard.jobsSubtitle')}
          icon={CheckCircle2}
          iconClass="bg-green-500/10 text-green-600 dark:text-green-400"
          href="/admin/service-jobs"
          isLoading={isLoading}
        />

        {/* Invoice today */}
        <DashboardSummaryCard
          title={t('dashboard.invoiceToday')}
          value={isLoading ? '—' : fmt(s?.invoiceTotalToday ?? '0')}
          subtitle={t('dashboard.todaySubtitle')}
          icon={Receipt}
          iconClass="bg-purple-500/10 text-purple-600 dark:text-purple-400"
          href="/admin/invoices"
          isLoading={isLoading}
        />

        {/* Invoice month */}
        <DashboardSummaryCard
          title={t('dashboard.invoiceMonth')}
          value={isLoading ? '—' : fmt(s?.invoiceTotalMonth ?? '0')}
          subtitle={t('dashboard.monthSubtitle')}
          icon={DollarSign}
          iconClass="bg-purple-500/10 text-purple-600 dark:text-purple-400"
          href="/admin/invoices"
          isLoading={isLoading}
        />

        {/* Payments today */}
        <DashboardSummaryCard
          title={t('dashboard.paymentsToday')}
          value={isLoading ? '—' : fmt(s?.paymentsTotalToday ?? '0')}
          subtitle={t('dashboard.todaySubtitle')}
          icon={Wallet}
          iconClass="bg-green-500/10 text-green-600 dark:text-green-400"
          href="/admin/payments"
          isLoading={isLoading}
        />

        {/* Payments month */}
        <DashboardSummaryCard
          title={t('dashboard.paymentsMonth')}
          value={isLoading ? '—' : fmt(s?.paymentsTotalMonth ?? '0')}
          subtitle={t('dashboard.monthSubtitle')}
          icon={CreditCard}
          iconClass="bg-green-500/10 text-green-600 dark:text-green-400"
          href="/admin/payments"
          isLoading={isLoading}
        />

        {/* Unpaid — highlighted when > 0 */}
        <DashboardSummaryCard
          title={t('dashboard.unpaidAmount')}
          value={isLoading ? '—' : fmt(s?.totalUnpaidAmount ?? '0')}
          icon={AlertTriangle}
          iconClass="bg-red-500/10 text-red-600 dark:text-red-400"
          highlight={unpaidNum > 0 ? 'danger' : undefined}
          href="/admin/invoices"
          isLoading={isLoading}
        />

        {/* Expenses today */}
        <DashboardSummaryCard
          title={t('dashboard.expensesToday')}
          value={isLoading ? '—' : fmt(s?.expensesToday ?? '0')}
          subtitle={t('dashboard.todaySubtitle')}
          icon={TrendingDown}
          iconClass="bg-orange-500/10 text-orange-600 dark:text-orange-400"
          href="/admin/expenses"
          isLoading={isLoading}
        />

        {/* Expenses month */}
        <DashboardSummaryCard
          title={t('dashboard.expensesMonth')}
          value={isLoading ? '—' : fmt(s?.expensesMonth ?? '0')}
          subtitle={t('dashboard.monthSubtitle')}
          icon={TrendingDown}
          iconClass="bg-orange-500/10 text-orange-600 dark:text-orange-400"
          href="/admin/expenses"
          isLoading={isLoading}
        />

        {/* Low stock */}
        <DashboardSummaryCard
          title={t('dashboard.lowStockCount')}
          value={isLoading ? '—' : (s?.lowStockCount ?? 0)}
          icon={Package}
          iconClass="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          highlight={s && s.lowStockCount > 0 ? 'warn' : undefined}
          href="/admin/products"
          isLoading={isLoading}
        />
      </div>

      {/* Low stock warning list */}
      <LowStockProducts />

      {/* Recent activity — two columns on desktop */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentServiceJobs />
        <RecentTransactions />
      </div>
    </div>
  );
}
