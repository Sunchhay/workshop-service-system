'use client';

import { Plus, SlidersHorizontal, Truck } from 'lucide-react';
import Link from 'next/link';
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

import { useGetSuppliersQuery, useUpdateSupplierStatusMutation } from '../api';
import type { Supplier, SupplierStatus } from '../types';
import { DisableSupplierDialog } from './dialogs/DisableSupplierDialog';
import { SupplierMobileCard } from './SupplierMobileCard';
import { SupplierTable } from './SupplierTable';

const LIMIT = 20;

type StatusFilter = SupplierStatus | '__all';

export function SupplierPage() {
  const { t } = useTranslation();

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('__all');
  const [pendingStatus, setPendingStatus] = useState<StatusFilter>('__all');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [statusTarget, setStatusTarget] = useState<Supplier | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [updateStatus, { isLoading: isToggling }] = useUpdateSupplierStatusMutation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isFetching } = useGetSuppliersQuery({
    search: search || undefined,
    status: statusFilter === '__all' ? undefined : (statusFilter as SupplierStatus),
    page,
    limit: LIMIT,
  });

  const suppliers = data?.data ?? [];
  const meta = data?.meta;
  const activeFilterCount = statusFilter !== '__all' ? 1 : 0;

  const handleSheetOpen = (open: boolean) => {
    if (open) setPendingStatus(statusFilter);
    setFilterSheetOpen(open);
  };

  const handleApplyFilters = () => {
    setStatusFilter(pendingStatus);
    setPage(1);
    setFilterSheetOpen(false);
  };

  const handleResetFilters = () => {
    setPendingStatus('__all');
    setStatusFilter('__all');
    setPage(1);
    setFilterSheetOpen(false);
  };

  const handleToggleStatus = (supplier: Supplier) => {
    setStatusTarget(supplier);
    setDialogOpen(true);
  };

  const handleStatusConfirm = async () => {
    if (!statusTarget) return;
    try {
      const isActive = statusTarget.status === 'ACTIVE';
      await updateStatus({
        id: statusTarget.id,
        data: { status: isActive ? 'INACTIVE' : 'ACTIVE' },
      }).unwrap();
      toast.success(
        isActive ? t('suppliers.disabledSuccess') : t('suppliers.enabledSuccess'),
      );
      setDialogOpen(false);
      setStatusTarget(null);
    } catch {
      toast.error(t('common.error'));
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-end md:justify-between gap-3">
        <h2 className="hidden md:block text-xl font-semibold">
          {t('suppliers.title')}
        </h2>
        <Button asChild size="sm">
          <Link href="/admin/suppliers/create">
            <Plus className="h-4 w-4 mr-1" />
            {t('suppliers.createSupplier')}
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <AppSearchInput
          placeholder={t('suppliers.searchPlaceholder')}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onClear={() => setSearchInput('')}
        />

        {/* Desktop filter */}
        <div className="hidden md:flex gap-3">
          <Select
            value={statusFilter}
            onValueChange={(v) => { setStatusFilter(v as StatusFilter); setPage(1); }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t('suppliers.allStatuses')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{t('suppliers.allStatuses')}</SelectItem>
              <SelectItem value="ACTIVE">{t('common.active')}</SelectItem>
              <SelectItem value="INACTIVE">{t('common.inactive')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mobile filter sheet */}
        <Sheet open={filterSheetOpen} onOpenChange={handleSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="flex md:hidden relative shrink-0"
            >
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
                <p className="text-sm font-medium">{t('suppliers.statusLabel')}</p>
                <Select
                  value={pendingStatus}
                  onValueChange={(v) => setPendingStatus(v as StatusFilter)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('suppliers.allStatuses')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">{t('suppliers.allStatuses')}</SelectItem>
                    <SelectItem value="ACTIVE">{t('common.active')}</SelectItem>
                    <SelectItem value="INACTIVE">{t('common.inactive')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 p-4 pt-0">
              <Button variant="outline" onClick={handleResetFilters} className="flex-1">
                {t('common.reset')}
              </Button>
              <Button onClick={handleApplyFilters} className="flex-1">
                {t('common.apply')}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Loading skeleton */}
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
          <SupplierTable suppliers={suppliers} onToggleStatus={handleToggleStatus} />
        </div>
      )}

      {/* Mobile cards */}
      {!isLoading && (
        <div className={`md:hidden space-y-3 ${isFetching ? 'opacity-60' : ''}`}>
          {suppliers.length === 0 ? (
            <AppEmptyState
              icon={Truck}
              title={t('suppliers.noSuppliers')}
              description={t('suppliers.noSuppliersDesc')}
            />
          ) : (
            suppliers.map((supplier) => (
              <SupplierMobileCard
                key={supplier.id}
                supplier={supplier}
                onToggleStatus={handleToggleStatus}
              />
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 pt-2">
          <p className="text-sm text-muted-foreground">
            {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, meta.total)} /{' '}
            {meta.total}
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

      <DisableSupplierDialog
        supplier={statusTarget}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleStatusConfirm}
        isLoading={isToggling}
      />
    </div>
  );
}
