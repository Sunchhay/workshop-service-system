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

import { useCancelSaleMutation, useDeleteSaleMutation, useGetSalesQuery } from '../api';
import type { Sale, SaleStatus } from '../types';
import { CancelSaleDialog } from './dialogs/CancelSaleDialog';
import { DeleteSaleDialog } from './dialogs/DeleteSaleDialog';
import { SalesMobileCard } from './SalesMobileCard';
import { SalesTable } from './SalesTable';

const HISTORY_STATUSES: SaleStatus[] = ['COMPLETED', 'CANCELLED'];
const LIMIT = 20;
type StatusFilter = SaleStatus | '__all';

export function SalesHistoryTab() {
  const { t } = useTranslation();

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('__all');
  const [pendingStatus, setPendingStatus] = useState<StatusFilter>('__all');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [cancelTarget, setCancelTarget] = useState<Sale | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Sale | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [cancelSale, { isLoading: isCancelling }] = useCancelSaleMutation();
  const [deleteSale, { isLoading: isDeleting }] = useDeleteSaleMutation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => { setPage(1); }, [statusFilter]);

  const { data, isLoading, isFetching } = useGetSalesQuery({
    search: search || undefined,
    status: statusFilter === '__all' ? undefined : statusFilter,
    page,
    limit: LIMIT,
  });

  const sales = data?.data ?? [];
  const meta = data?.meta;
  const activeFilterCount = statusFilter !== '__all' ? 1 : 0;

  const handleSheetOpen = (open: boolean) => {
    if (open) setPendingStatus(statusFilter);
    setFilterSheetOpen(open);
  };

  const handleApplyFilters = () => {
    setStatusFilter(pendingStatus);
    setFilterSheetOpen(false);
  };

  const handleResetFilters = () => {
    setPendingStatus('__all');
    setStatusFilter('__all');
    setFilterSheetOpen(false);
  };

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;
    try {
      await cancelSale({ id: cancelTarget.id }).unwrap();
      toast.success(t('sales.cancelSuccess'));
      setCancelDialogOpen(false);
      setCancelTarget(null);
    } catch {
      toast.error(t('common.error'));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSale(deleteTarget.id).unwrap();
      toast.success(t('sales.deleteSuccess'));
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    } catch {
      toast.error(t('common.error'));
    }
  };

  const openCancel = (sale: Sale) => { setCancelTarget(sale); setCancelDialogOpen(true); };
  const openDelete = (sale: Sale) => { setDeleteTarget(sale); setDeleteDialogOpen(true); };

  return (
    <div className="space-y-4">
      {/* Search + Filters */}
      <div className="flex gap-3 items-center">
        <AppSearchInput
          placeholder={t('sales.searchPlaceholder')}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onClear={() => setSearchInput('')}
        />

        {/* Desktop filter */}
        <div className="hidden md:flex gap-3">
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t('sales.allStatuses')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{t('sales.allStatuses')}</SelectItem>
              {HISTORY_STATUSES.map((s) => (
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
            <SheetHeader>
              <SheetTitle>{t('common.filters')}</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 p-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">{t('sales.status')}</p>
                <Select value={pendingStatus} onValueChange={(v) => setPendingStatus(v as StatusFilter)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('sales.allStatuses')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">{t('sales.allStatuses')}</SelectItem>
                    {HISTORY_STATUSES.map((s) => (
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
          <SalesTable sales={sales} onCancel={openCancel} onDelete={openDelete} />
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
                onCancel={openCancel}
                onDelete={openDelete}
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isFetching}
            >
              {t('common.back')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page >= meta.totalPages || isFetching}
            >
              {t('common.next')}
            </Button>
          </div>
        </div>
      )}

      <CancelSaleDialog
        sale={cancelTarget}
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onConfirm={handleCancelConfirm}
        isLoading={isCancelling}
      />
      <DeleteSaleDialog
        sale={deleteTarget}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
}
