'use client';

import { DollarSign, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

import { AppEmptyState } from '@/components/app/AppEmptyState';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';
import type { TranslationKey } from '@/lib/i18n/TranslationContext';

import { useGetReportSalesQuery } from '../api';
import { getReportItems, getReportSummary } from '../reportData';
import type { PaymentStatus, SaleStatus } from '../types';
import { ReportSummaryCard } from './ReportSummaryCard';

const PAYMENT_STATUS_CLASS: Record<string, string> = {
  PAID: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
  PARTIAL: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
  UNPAID: 'bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400',
};

const SALE_STATUS_CLASS: Record<string, string> = {
  COMPLETED: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
  VOIDED: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
};

const PAYMENT_STATUSES: PaymentStatus[] = ['PAID', 'PARTIAL', 'UNPAID'];
const SALE_STATUSES: SaleStatus[] = ['COMPLETED', 'VOIDED'];
const PAYMENT_STATUS_LABELS: Record<PaymentStatus, TranslationKey> = {
  PAID: 'paymentStatuses.PAID',
  PARTIAL: 'paymentStatuses.PARTIAL',
  UNPAID: 'paymentStatuses.UNPAID',
};
const SALE_STATUS_LABELS: Record<SaleStatus, TranslationKey> = {
  COMPLETED: 'saleStatuses.COMPLETED',
  VOIDED: 'saleStatuses.VOIDED',
};
const LIMIT = 20;

function fmtDate(d: string) { return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }); }
function fmtAmt(v: string | number) { return `$${parseFloat(String(v)).toFixed(2)}`; }

interface Props { fromDate: string; toDate: string; }

export function SalesReport({ fromDate, toDate }: Props) {
  const { t } = useTranslation();
  const [paymentStatus, setPaymentStatus] = useState('__all');
  const [saleStatus, setSaleStatus] = useState('__all');
  const [customerId, setCustomerId] = useState('');
  const [mechanicId, setMechanicId] = useState('');

  const { data, isLoading } = useGetReportSalesQuery({
    dateFrom: fromDate || undefined,
    dateTo: toDate || undefined,
    paymentStatus: paymentStatus === '__all' ? undefined : paymentStatus as PaymentStatus,
    saleStatus: saleStatus === '__all' ? undefined : saleStatus as SaleStatus,
    customerId: customerId.trim() || undefined,
    mechanicId: mechanicId.trim() || undefined,
    page: 1,
    limit: LIMIT,
  });
  const sales = getReportItems(data?.data);
  const summary = getReportSummary(data?.data);
  const activeSales = sales.filter((s) => s.saleStatus !== 'VOIDED');

  const totalSales = summary?.totalSales ?? activeSales.reduce((sum, s) => sum + parseFloat(String(s.grandTotal)), 0);
  const totalPaid = summary?.totalPaid ?? activeSales.reduce((sum, s) => sum + parseFloat(String(s.paidAmount)), 0);
  const totalBalance = summary?.totalBalance ?? activeSales.reduce((sum, s) => sum + parseFloat(String(s.balanceAmount)), 0);
  const totalOrders = summary?.totalOrders ?? activeSales.length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ReportSummaryCard
          title={t('reports.totalSales')}
          value={isLoading ? '—' : fmtAmt(totalSales)}
          icon={DollarSign}
          iconClass="bg-green-500/10 text-green-600 dark:text-green-400"
          isLoading={isLoading}
        />
        <ReportSummaryCard
          title={t('reports.totalPaid')}
          value={isLoading ? '—' : fmtAmt(totalPaid)}
          icon={DollarSign}
          iconClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          isLoading={isLoading}
        />
        <ReportSummaryCard
          title={t('reports.totalBalance')}
          value={isLoading ? '—' : fmtAmt(totalBalance)}
          icon={DollarSign}
          iconClass="bg-red-500/10 text-red-600 dark:text-red-400"
          highlight={totalBalance > 0 ? 'danger' : undefined}
          isLoading={isLoading}
        />
        <ReportSummaryCard
          title={t('reports.totalOrders')}
          value={isLoading ? '—' : totalOrders}
          icon={ShoppingCart}
          iconClass="bg-purple-500/10 text-purple-600 dark:text-purple-400"
          isLoading={isLoading}
        />
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <Select value={paymentStatus} onValueChange={setPaymentStatus}>
          <SelectTrigger className="w-44 h-8 text-xs">
            <SelectValue placeholder={t('reports.allPaymentStatuses')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">{t('reports.allPaymentStatuses')}</SelectItem>
            {PAYMENT_STATUSES.map(s => <SelectItem key={s} value={s}>{t(PAYMENT_STATUS_LABELS[s])}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={saleStatus} onValueChange={setSaleStatus}>
          <SelectTrigger className="w-40 h-8 text-xs">
            <SelectValue placeholder={t('reports.allSaleStatuses')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">{t('reports.allSaleStatuses')}</SelectItem>
            {SALE_STATUSES.map(s => <SelectItem key={s} value={s}>{t(SALE_STATUS_LABELS[s])}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          placeholder={t('reports.customerId')}
          className="w-40 h-8 text-xs"
        />
        <Input
          value={mechanicId}
          onChange={(e) => setMechanicId(e.target.value)}
          placeholder={t('reports.mechanicId')}
          className="w-40 h-8 text-xs"
        />
        {!isLoading && sales.length > 0 && (
          <p className="text-xs text-muted-foreground self-center">
            {sales.length} {t('reports.totalRecords')}
          </p>
        )}
      </div>

      {isLoading && <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}</div>}
      {!isLoading && sales.length === 0 && <AppEmptyState icon={ShoppingCart} title={t('reports.noData')} description={t('reports.noDataDesc')} />}

      {!isLoading && sales.length > 0 && (
        <div className="hidden md:block rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.invoiceNo')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.date')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.customer')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.mechanic')}</th>
                <th className="text-right px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.grandTotal')}</th>
                <th className="text-right px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.paid')}</th>
                <th className="text-right px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.balance')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.paymentStatus')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.saleStatus')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sales.map(s => (
                <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-semibold">{s.invoiceNo}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{fmtDate(s.createdAt)}</td>
                  <td className="px-4 py-3 text-sm">{s.customer?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{s.mechanic?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-semibold">{fmtAmt(s.grandTotal)}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-muted-foreground">{fmtAmt(s.paidAmount)}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-muted-foreground">{fmtAmt(s.balanceAmount)}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`text-[10px] py-0 ${PAYMENT_STATUS_CLASS[s.paymentStatus] ?? ''}`}>
                      {t(PAYMENT_STATUS_LABELS[s.paymentStatus])}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`text-[10px] py-0 ${SALE_STATUS_CLASS[s.saleStatus] ?? ''}`}>
                      {t(SALE_STATUS_LABELS[s.saleStatus])}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && sales.length > 0 && (
        <div className="md:hidden space-y-3">
          {sales.map(s => (
            <Card key={s.id}>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs font-semibold">{s.invoiceNo}</p>
                    <p className="text-sm font-medium mt-0.5">{s.customer?.name ?? '—'}</p>
                    <p className="text-xs text-muted-foreground">{s.mechanic?.name ?? '—'} · {fmtDate(s.createdAt)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge variant="outline" className={`text-[10px] py-0 ${PAYMENT_STATUS_CLASS[s.paymentStatus] ?? ''}`}>
                      {t(PAYMENT_STATUS_LABELS[s.paymentStatus])}
                    </Badge>
                    <Badge variant="outline" className={`text-[10px] py-0 ${SALE_STATUS_CLASS[s.saleStatus] ?? ''}`}>
                      {t(SALE_STATUS_LABELS[s.saleStatus])}
                    </Badge>
                    <p className="font-mono text-sm font-semibold">{fmtAmt(s.grandTotal)}</p>
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
