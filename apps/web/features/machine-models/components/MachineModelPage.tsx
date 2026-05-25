'use client';

import { Cpu, Plus, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { AppEmptyState } from '@/components/app/AppEmptyState';
import { AppSearchInput } from '@/components/app/AppSearchInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

import {
  useDeleteMachineModelMutation,
  useGetMachineModelsQuery,
  useUpdateMachineModelStatusMutation,
} from '../api';
import type { MachineModel } from '../types';
import { DeleteMachineModelDialog } from './dialogs/DeleteMachineModelDialog';
import { DisableMachineModelDialog } from './dialogs/DisableMachineModelDialog';
import { MachineModelMobileCard } from './MachineModelMobileCard';
import { MachineModelTable } from './MachineModelTable';

const LIMIT = 20;
type StatusFilter = 'true' | 'false' | '__all';

export function MachineModelPage() {
  const { t } = useTranslation();

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('__all');

  const [pendingCategory, setPendingCategory] = useState('');
  const [pendingStatus, setPendingStatus] = useState<StatusFilter>('__all');

  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [statusTarget, setStatusTarget] = useState<MachineModel | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MachineModel | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [updateStatus, { isLoading: isToggling }] = useUpdateMachineModelStatusMutation();
  const [deleteMachineModel, { isLoading: isDeleting }] = useDeleteMachineModelMutation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [categoryFilter, statusFilter]);

  const { data, isLoading, isFetching } = useGetMachineModelsQuery({
    search: search || undefined,
    category: categoryFilter || undefined,
    isActive: statusFilter === '__all' ? undefined : statusFilter === 'true',
    page,
    limit: LIMIT,
  });

  const models = data?.data ?? [];
  const meta = data?.meta;

  const activeFilterCount =
    (categoryFilter ? 1 : 0) + (statusFilter !== '__all' ? 1 : 0);

  const handleSheetOpen = (open: boolean) => {
    if (open) {
      setPendingCategory(categoryFilter);
      setPendingStatus(statusFilter);
    }
    setFilterSheetOpen(open);
  };

  const handleApplyFilters = () => {
    setCategoryFilter(pendingCategory);
    setStatusFilter(pendingStatus);
    setFilterSheetOpen(false);
  };

  const handleResetFilters = () => {
    setPendingCategory('');
    setPendingStatus('__all');
    setCategoryFilter('');
    setStatusFilter('__all');
    setFilterSheetOpen(false);
  };

  const handleToggleStatus = (model: MachineModel) => {
    setStatusTarget(model);
    setStatusDialogOpen(true);
  };

  const handleDelete = (model: MachineModel) => {
    setDeleteTarget(model);
    setDeleteDialogOpen(true);
  };

  const handleStatusConfirm = async () => {
    if (!statusTarget) return;
    try {
      await updateStatus({
        id: statusTarget.id,
        isActive: !statusTarget.isActive,
      }).unwrap();
      toast.success(
        statusTarget.isActive
          ? t('machineModels.disabledSuccess')
          : t('machineModels.enabledSuccess'),
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
      await deleteMachineModel(deleteTarget.id).unwrap();
      toast.success(t('machineModels.deleteSuccess'));
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
          {t('machineModels.title')}
        </h2>
        <Button asChild size="sm">
          <Link href="/admin/machine-models/create">
            <Plus className="h-4 w-4 mr-1" />
            {t('machineModels.createModel')}
          </Link>
        </Button>
      </div>

      {/* Search + Filters */}
      <div className="flex gap-3 items-center">
        <AppSearchInput
          placeholder={t('machineModels.searchPlaceholder')}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onClear={() => setSearchInput('')}
        />

        {/* Desktop filters */}
        <div className="hidden md:flex gap-3">
          <Input
            placeholder={t('machineModels.allCategories')}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-44"
          />
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as StatusFilter)}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder={t('machineModels.allStatuses')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{t('machineModels.allStatuses')}</SelectItem>
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
                <p className="text-sm font-medium">{t('machineModels.category')}</p>
                <Input
                  placeholder={t('machineModels.categoryPlaceholder')}
                  value={pendingCategory}
                  onChange={(e) => setPendingCategory(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">{t('machineModels.statusLabel')}</p>
                <Select
                  value={pendingStatus}
                  onValueChange={(v) => setPendingStatus(v as StatusFilter)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('machineModels.allStatuses')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">{t('machineModels.allStatuses')}</SelectItem>
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
          <MachineModelTable
            models={models}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
          />
        </div>
      )}

      {/* Mobile cards */}
      {!isLoading && (
        <div className={`md:hidden space-y-3 ${isFetching ? 'opacity-60' : ''}`}>
          {models.length === 0 ? (
            <AppEmptyState
              icon={Cpu}
              title={t('machineModels.noModels')}
              description={t('machineModels.noModelsDesc')}
            />
          ) : (
            models.map((model) => (
              <MachineModelMobileCard
                key={model.id}
                model={model}
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

      {/* Dialogs */}
      <DisableMachineModelDialog
        model={statusTarget}
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        onConfirm={handleStatusConfirm}
        isLoading={isToggling}
      />
      <DeleteMachineModelDialog
        model={deleteTarget}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
}
