'use client';

import { ShoppingBag, SlidersHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { AppEmptyState } from '@/components/app/AppEmptyState';
import { AppSearchInput } from '@/components/app/AppSearchInput';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetSalesQuery, useVoidSaleMutation } from '../api';
import type { PaymentStatus, Sale, SaleStatus } from '../types';
import { VoidSaleDialog } from './dialogs/VoidSaleDialog';
import { SalesMobileCard } from './SalesMobileCard';
import { SalesTable } from './SalesTable';

const PAYMENT_STATUSES: PaymentStatus[] = ['PAID', 'UNPAID', 'PARTIAL'];
const SALE_STATUSES: SaleStatus[] = ['COMPLETED', 'VOIDED'];
const LIMIT = 20;
type PaymentStatusFilter = PaymentStatus | '__all';
type SaleStatusFilter = SaleStatus | '__all';

export function SalesPage() {
  const { t } = useTranslation();

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<PaymentStatusFilter>('__all');
  const [saleStatusFilter, setSaleStatusFilter] = useState<SaleStatusFilter>('__all');
  const [pendingPaymentStatus, setPendingPaymentStatus] = useState<PaymentStatusFilter>('__all');
  const [pendingSaleStatus, setPendingSaleStatus] = useState<SaleStatusFilter>('__all');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [voidTarget, setVoidTarget] = useState<Sale | null>(null);
  const [voidDialogOpen, setVoidDialogOpen] = useState(false);

  const [voidSale, { isLoading: isVoiding }] = useVoidSaleMutation();

  useEffect(() => {
    const timer = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => { setPage(1); }, [paymentStatusFilter, saleStatusFilter]);

  const { data, isLoading, isFetching } = useGetSalesQuery({
    search: search || undefined,
    paymentStatus: paymentStatusFilter === '__all' ? undefined : paymentStatusFilter,
    saleStatus: saleStatusFilter === '__all' ? undefined : saleStatusFilter,
    page,
    limit: LIMIT,
  });

  const sales = data?.data ?? [];
  const meta = data?.meta;

  const activeFilterCount =
    (paymentStatusFilter !== '__all' ? 1 : 0) + (saleStatusFilter !== '__all' ? 1 : 0);

  const handleSheetOpen = (open: boolean) => {
    if (open) {
      setPendingPaymentStatus(paymentStatusFilter);
      setPendingSaleStatus(saleStatusFilter);
    }
    setFilterSheetOpen(open);
  };

  const handleApplyFilters = () => {
    setPaymentStatusFilter(pendingPaymentStatus);
    setSaleStatusFilter(pendingSaleStatus);
    setFilterSheetOpen(false);
  };

  const handleResetFilters = () => {
    setPendingPaymentStatus('__all');
    setPendingSaleStatus('__all');
    setPaymentStatusFilter('__all');
    setSaleStatusFilter('__all');
    setFilterSheetOpen(false);
  };

  const handleVoidConfirm = async (voidReason: string) => {
    if (!voidTarget) return;
    try {
      await voidSale({ id: voidTarget.id, voidReason }).unwrap();
      toast.success(t('sales.voidSuccess'));
      setVoidDialogOpen(false);
      setVoidTarget(null);
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string } })?.data?.message ?? t('common.error');
      toast.error(message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end md:justify-between gap-3">
        <h2 className="hidden md:block text-xl font-semibold">{t('sales.title')}</h2>
      </div>

      {/* Search + Filters */}
      <div className="flex gap-3 items-center">
        <AppSearchInput
          placeholder={t('sales.searchPlaceholder')}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onClear={() => setSearchInput('')}
        />

        {/* Desktop filters */}
        <div className="hidden md:flex gap-3">
          <Select
            value={paymentStatusFilter}
            onValueChange={(v) => setPaymentStatusFilter(v as PaymentStatusFilter)}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder={t('sales.allPaymentStatuses')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{t('sales.allPaymentStatuses')}</SelectItem>
              {PAYMENT_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{t(`paymentStatuses.${s}`)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={saleStatusFilter}
            onValueChange={(v) => setSaleStatusFilter(v as SaleStatusFilter)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t('sales.allSaleStatuses')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{t('sales.allSaleStatuses')}</SelectItem>
              {SALE_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{t(`saleStatuses.${s}`)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Mobile filter sheet */}
        <Sheet open={filterSheetOpen} onOpenChange={handleSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="flex md:hidden relative shrink-0">
              <SlidersHorizontal className="h-4 w-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-medium">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto">
            <SheetHeader><SheetTitle>{t('common.filters')}</SheetTitle></SheetHeader>
            <div className="space-y-4 p-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">{t('sales.paymentStatus')}</p>
                <Select
                  value={pendingPaymentStatus}
                  onValueChange={(v) => setPendingPaymentStatus(v as PaymentStatusFilter)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('sales.allPaymentStatuses')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">{t('sales.allPaymentStatuses')}</SelectItem>
                    {PAYMENT_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{t(`paymentStatuses.${s}`)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">{t('sales.saleStatus')}</p>
                <Select
                  value={pendingSaleStatus}
                  onValueChange={(v) => setPendingSaleStatus(v as SaleStatusFilter)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('sales.allSaleStatuses')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">{t('sales.allSaleStatuses')}</SelectItem>
                    {SALE_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{t(`saleStatuses.${s}`)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 p-4 pt-0">
              <Button variant="outline" onClick={handleResetFilters} className="flex-1">{t('common.reset')}</Button>
              <Button onClick={handleApplyFilters} className="flex-1">{t('common.apply')}</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      )}

      {/* Desktop table */}
      {!isLoading && (
        <div className={`hidden md:block ${isFetching ? 'opacity-60' : ''}`}>
          <SalesTable
            sales={sales}
            onVoid={(sale) => { setVoidTarget(sale); setVoidDialogOpen(true); }}
          />
        </div>
      )}

      {/* Mobile cards */}
      {!isLoading && (
        <div className={`md:hidden space-y-3 ${isFetching ? 'opacity-60' : ''}`}>
          {sales.length === 0 ? (
            <AppEmptyState
              icon={ShoppingBag}
              title={t('sales.noSales')}
              description={t('sales.noSalesDesc')}
            />
          ) : (
            sales.map((sale) => (
              <SalesMobileCard
                key={sale.id}
                sale={sale}
                onVoid={(s) => { setVoidTarget(s); setVoidDialogOpen(true); }}
              />
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 pt-2">
          <p className="text-sm text-muted-foreground">
            {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, meta.total)} / {meta.total}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1 || isFetching}>{t('common.back')}</Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))} disabled={page >= meta.totalPages || isFetching}>{t('common.next')}</Button>
          </div>
        </div>
      )}

      <VoidSaleDialog
        open={voidDialogOpen}
        onOpenChange={setVoidDialogOpen}
        onConfirm={handleVoidConfirm}
        isLoading={isVoiding}
      />
    </div>
  );
}
