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
import { useGetMachineModelsQuery } from '@/features/machine-models/api';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import {
  useDeleteReferenceBookMutation,
  useGetReferenceBooksQuery,
  useUpdateReferenceBookMutation,
} from '../api';
import type { ReferenceBook, RecordStatus } from '../types';
import { DeleteReferenceBookDialog } from './dialogs/DeleteReferenceBookDialog';
import { DisableReferenceBookDialog } from './dialogs/DisableReferenceBookDialog';
import { ReferenceBookMobileCard } from './ReferenceBookMobileCard';
import { ReferenceBookTable } from './ReferenceBookTable';

const LIMIT = 20;
type StatusFilter = RecordStatus | '__all';

export function ReferenceBookPage() {
  const { t } = useTranslation();

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [modelFilter, setModelFilter] = useState('__all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('__all');
  const [pendingModel, setPendingModel] = useState('__all');
  const [pendingStatus, setPendingStatus] = useState<StatusFilter>('__all');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [statusTarget, setStatusTarget] = useState<ReferenceBook | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ReferenceBook | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [updateBook, { isLoading: isToggling }] = useUpdateReferenceBookMutation();
  const [deleteRecord, { isLoading: isDeleting }] = useDeleteReferenceBookMutation();

  const { data: machineModelsData } = useGetMachineModelsQuery({ status: 'ACTIVE', limit: 200 });
  const machineModels = machineModelsData?.data ?? [];

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [modelFilter, statusFilter]);

  const { data, isLoading, isFetching } = useGetReferenceBooksQuery({
    search: search || undefined,
    machineModelId: modelFilter === '__all' ? undefined : modelFilter,
    status: statusFilter === '__all' ? undefined : (statusFilter as RecordStatus),
    page,
    limit: LIMIT,
  });

  const records = data?.data ?? [];
  const meta = data?.meta;
  const activeFilterCount = (modelFilter !== '__all' ? 1 : 0) + (statusFilter !== '__all' ? 1 : 0);

  const handleSheetOpen = (open: boolean) => {
    if (open) {
      setPendingModel(modelFilter);
      setPendingStatus(statusFilter);
    }
    setFilterSheetOpen(open);
  };

  const handleApplyFilters = () => {
    setModelFilter(pendingModel);
    setStatusFilter(pendingStatus);
    setFilterSheetOpen(false);
  };

  const handleResetFilters = () => {
    setPendingModel('__all');
    setPendingStatus('__all');
    setModelFilter('__all');
    setStatusFilter('__all');
    setFilterSheetOpen(false);
  };

  const handleStatusConfirm = async () => {
    if (!statusTarget) return;
    const newStatus = statusTarget.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await updateBook({ id: statusTarget.id, data: { status: newStatus } }).unwrap();
      toast.success(
        statusTarget.status === 'ACTIVE'
          ? t('referenceBook.disabledSuccess')
          : t('referenceBook.enabledSuccess'),
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
      await deleteRecord(deleteTarget.id).unwrap();
      toast.success(t('referenceBook.deleteSuccess'));
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    } catch {
      toast.error(t('common.error'));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end md:justify-between gap-3">
        <h2 className="hidden md:block text-xl font-semibold">{t('referenceBook.title')}</h2>
        <Button asChild size="sm">
          <Link href="/admin/reference-book/create">
            <Plus className="h-4 w-4 mr-1" />
            {t('referenceBook.createRecord')}
          </Link>
        </Button>
      </div>

      <div className="flex gap-3 items-center">
        <AppSearchInput
          placeholder={t('referenceBook.searchPlaceholder')}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onClear={() => setSearchInput('')}
        />

        {/* Desktop filters */}
        <div className="hidden md:flex gap-3">
          <Select value={modelFilter} onValueChange={setModelFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder={t('referenceBook.allMachineModels')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{t('referenceBook.allMachineModels')}</SelectItem>
              {machineModels.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.modelName}
                  {m.brand ? ` · ${m.brand}` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as StatusFilter)}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder={t('referenceBook.allStatuses')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{t('referenceBook.allStatuses')}</SelectItem>
              <SelectItem value="ACTIVE">{t('common.active')}</SelectItem>
              <SelectItem value="INACTIVE">{t('common.inactive')}</SelectItem>
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
                <p className="text-sm font-medium">{t('referenceBook.machineModel')}</p>
                <Select value={pendingModel} onValueChange={setPendingModel}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('referenceBook.allMachineModels')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">{t('referenceBook.allMachineModels')}</SelectItem>
                    {machineModels.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.modelName}
                        {m.brand ? ` · ${m.brand}` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">{t('referenceBook.statusLabel')}</p>
                <Select
                  value={pendingStatus}
                  onValueChange={(v) => setPendingStatus(v as StatusFilter)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('referenceBook.allStatuses')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">{t('referenceBook.allStatuses')}</SelectItem>
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

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && (
        <div className={`hidden md:block ${isFetching ? 'opacity-60' : ''}`}>
          <ReferenceBookTable
            records={records}
            onToggleStatus={(r) => {
              setStatusTarget(r);
              setStatusDialogOpen(true);
            }}
            onDelete={(r) => {
              setDeleteTarget(r);
              setDeleteDialogOpen(true);
            }}
          />
        </div>
      )}

      {!isLoading && (
        <div className={`md:hidden space-y-3 ${isFetching ? 'opacity-60' : ''}`}>
          {records.length === 0 ? (
            <AppEmptyState
              icon={BookOpen}
              title={t('referenceBook.noRecords')}
              description={t('referenceBook.noRecordsDesc')}
            />
          ) : (
            records.map((record) => (
              <ReferenceBookMobileCard
                key={record.id}
                record={record}
                onToggleStatus={(r) => {
                  setStatusTarget(r);
                  setStatusDialogOpen(true);
                }}
                onDelete={(r) => {
                  setDeleteTarget(r);
                  setDeleteDialogOpen(true);
                }}
              />
            ))
          )}
        </div>
      )}

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

      <DisableReferenceBookDialog
        record={statusTarget}
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        onConfirm={handleStatusConfirm}
        isLoading={isToggling}
      />
      <DeleteReferenceBookDialog
        record={deleteTarget}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
}
