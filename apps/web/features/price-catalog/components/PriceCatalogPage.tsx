'use client';

import { BookOpen, Plus, SlidersHorizontal } from 'lucide-react';
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
import { useGetServicesQuery } from '@/features/services/api';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import {
  useDeletePriceCatalogMutation,
  useGetPriceCatalogsQuery,
  useUpdatePriceCatalogStatusMutation,
} from '../api';
import type { CustomerType, DifficultyLevel, PriceCatalog } from '../types';
import { DeletePriceCatalogDialog } from './dialogs/DeletePriceCatalogDialog';
import { DisablePriceCatalogDialog } from './dialogs/DisablePriceCatalogDialog';
import { PriceCatalogMobileCard } from './PriceCatalogMobileCard';
import { PriceCatalogTable } from './PriceCatalogTable';

const DIFFICULTY_LEVELS: DifficultyLevel[] = ['NORMAL', 'DIFFICULT', 'SPECIAL'];
const CUSTOMER_TYPES: CustomerType[] = ['NORMAL', 'VIP', 'WHOLESALE', 'PARTNER'];
const LIMIT = 20;

type DifficultyFilter = DifficultyLevel | '__all';
type CustomerTypeFilter = CustomerType | '__all';
type StatusFilter = 'true' | 'false' | '__all';

export function PriceCatalogPage() {
  const { t } = useTranslation();

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [serviceFilter, setServiceFilter] = useState('__all');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('__all');
  const [customerTypeFilter, setCustomerTypeFilter] = useState<CustomerTypeFilter>('__all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('__all');

  const [pendingService, setPendingService] = useState('__all');
  const [pendingDifficulty, setPendingDifficulty] = useState<DifficultyFilter>('__all');
  const [pendingCustomerType, setPendingCustomerType] = useState<CustomerTypeFilter>('__all');
  const [pendingStatus, setPendingStatus] = useState<StatusFilter>('__all');

  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [statusTarget, setStatusTarget] = useState<PriceCatalog | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PriceCatalog | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [updateStatus, { isLoading: isToggling }] = useUpdatePriceCatalogStatusMutation();
  const [deletePriceCatalog, { isLoading: isDeleting }] = useDeletePriceCatalogMutation();

  const { data: servicesData } = useGetServicesQuery({ isActive: true, limit: 100 });
  const services = servicesData?.data ?? [];

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [serviceFilter, difficultyFilter, customerTypeFilter, statusFilter]);

  const { data, isLoading, isFetching } = useGetPriceCatalogsQuery({
    search: search || undefined,
    serviceId: serviceFilter === '__all' ? undefined : serviceFilter,
    difficultyLevel: difficultyFilter === '__all' ? undefined : (difficultyFilter as DifficultyLevel),
    customerType: customerTypeFilter === '__all' ? undefined : (customerTypeFilter as CustomerType),
    isActive: statusFilter === '__all' ? undefined : statusFilter === 'true',
    page,
    limit: LIMIT,
  });

  const entries = data?.data ?? [];
  const meta = data?.meta;

  const activeFilterCount =
    (serviceFilter !== '__all' ? 1 : 0) +
    (difficultyFilter !== '__all' ? 1 : 0) +
    (customerTypeFilter !== '__all' ? 1 : 0) +
    (statusFilter !== '__all' ? 1 : 0);

  const handleSheetOpen = (open: boolean) => {
    if (open) {
      setPendingService(serviceFilter);
      setPendingDifficulty(difficultyFilter);
      setPendingCustomerType(customerTypeFilter);
      setPendingStatus(statusFilter);
    }
    setFilterSheetOpen(open);
  };

  const handleApplyFilters = () => {
    setServiceFilter(pendingService);
    setDifficultyFilter(pendingDifficulty);
    setCustomerTypeFilter(pendingCustomerType);
    setStatusFilter(pendingStatus);
    setFilterSheetOpen(false);
  };

  const handleResetFilters = () => {
    setPendingService('__all');
    setPendingDifficulty('__all');
    setPendingCustomerType('__all');
    setPendingStatus('__all');
    setServiceFilter('__all');
    setDifficultyFilter('__all');
    setCustomerTypeFilter('__all');
    setStatusFilter('__all');
    setFilterSheetOpen(false);
  };

  const handleToggleStatus = (entry: PriceCatalog) => {
    setStatusTarget(entry);
    setStatusDialogOpen(true);
  };

  const handleDelete = (entry: PriceCatalog) => {
    setDeleteTarget(entry);
    setDeleteDialogOpen(true);
  };

  const handleStatusConfirm = async () => {
    if (!statusTarget) return;
    try {
      await updateStatus({ id: statusTarget.id, isActive: !statusTarget.isActive }).unwrap();
      toast.success(
        statusTarget.isActive
          ? t('priceCatalog.disabledSuccess')
          : t('priceCatalog.enabledSuccess'),
      );
      setStatusDialogOpen(false);
      setStatusTarget(null);
    } catch {
      toast.error(t('common.error'));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deletePriceCatalog(deleteTarget.id).unwrap();
      toast.success(t('priceCatalog.deleteSuccess'));
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    } catch {
      toast.error(t('common.error'));
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-end md:justify-between gap-3">
        <h2 className="hidden md:block text-xl font-semibold">
          {t('priceCatalog.title')}
        </h2>
        <Button asChild size="sm">
          <Link href="/admin/price-catalog/create">
            <Plus className="h-4 w-4 mr-1" />
            {t('priceCatalog.createEntry')}
          </Link>
        </Button>
      </div>

      {/* Search + Filters */}
      <div className="flex gap-3 items-center">
        <AppSearchInput
          placeholder={t('priceCatalog.searchPlaceholder')}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onClear={() => setSearchInput('')}
        />

        {/* Desktop filters */}
        <div className="hidden md:flex gap-3">
          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t('priceCatalog.allServices')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{t('priceCatalog.allServices')}</SelectItem>
              {services.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.nameEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={difficultyFilter}
            onValueChange={(v) => setDifficultyFilter(v as DifficultyFilter)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t('priceCatalog.allDifficulties')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{t('priceCatalog.allDifficulties')}</SelectItem>
              {DIFFICULTY_LEVELS.map((d) => (
                <SelectItem key={d} value={d}>
                  {t(`difficultyLevels.${d}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={customerTypeFilter}
            onValueChange={(v) => setCustomerTypeFilter(v as CustomerTypeFilter)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t('priceCatalog.allCustomerTypes')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{t('priceCatalog.allCustomerTypes')}</SelectItem>
              {CUSTOMER_TYPES.map((ct) => (
                <SelectItem key={ct} value={ct}>
                  {t(`customerTypes.${ct}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as StatusFilter)}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder={t('priceCatalog.allStatuses')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{t('priceCatalog.allStatuses')}</SelectItem>
              <SelectItem value="true">{t('common.active')}</SelectItem>
              <SelectItem value="false">{t('common.inactive')}</SelectItem>
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
                <p className="text-sm font-medium">{t('priceCatalog.service')}</p>
                <Select value={pendingService} onValueChange={setPendingService}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('priceCatalog.allServices')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">{t('priceCatalog.allServices')}</SelectItem>
                    {services.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.nameEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">{t('priceCatalog.difficultyLevel')}</p>
                <Select
                  value={pendingDifficulty}
                  onValueChange={(v) => setPendingDifficulty(v as DifficultyFilter)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('priceCatalog.allDifficulties')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">{t('priceCatalog.allDifficulties')}</SelectItem>
                    {DIFFICULTY_LEVELS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {t(`difficultyLevels.${d}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">{t('priceCatalog.customerType')}</p>
                <Select
                  value={pendingCustomerType}
                  onValueChange={(v) => setPendingCustomerType(v as CustomerTypeFilter)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('priceCatalog.allCustomerTypes')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">{t('priceCatalog.allCustomerTypes')}</SelectItem>
                    {CUSTOMER_TYPES.map((ct) => (
                      <SelectItem key={ct} value={ct}>
                        {t(`customerTypes.${ct}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">{t('priceCatalog.statusLabel')}</p>
                <Select
                  value={pendingStatus}
                  onValueChange={(v) => setPendingStatus(v as StatusFilter)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('priceCatalog.allStatuses')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">{t('priceCatalog.allStatuses')}</SelectItem>
                    <SelectItem value="true">{t('common.active')}</SelectItem>
                    <SelectItem value="false">{t('common.inactive')}</SelectItem>
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
          <PriceCatalogTable
            entries={entries}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
          />
        </div>
      )}

      {/* Mobile cards */}
      {!isLoading && (
        <div className={`md:hidden space-y-3 ${isFetching ? 'opacity-60' : ''}`}>
          {entries.length === 0 ? (
            <AppEmptyState
              icon={BookOpen}
              title={t('priceCatalog.noEntries')}
              description={t('priceCatalog.noEntriesDesc')}
            />
          ) : (
            entries.map((entry) => (
              <PriceCatalogMobileCard
                key={entry.id}
                entry={entry}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
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

      {/* Dialogs */}
      <DisablePriceCatalogDialog
        entry={statusTarget}
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        onConfirm={handleStatusConfirm}
        isLoading={isToggling}
      />
      <DeletePriceCatalogDialog
        entry={deleteTarget}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
}
