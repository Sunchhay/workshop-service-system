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
  useUpdateReferenceBookStatusMutation,
  useUpdateReferenceBookVerificationMutation,
} from '../api';
import type {
  ReferenceBook,
  ReferenceSourceType,
  VerificationStatus,
} from '../types';
import { DeleteReferenceBookDialog } from './dialogs/DeleteReferenceBookDialog';
import { DisableReferenceBookDialog } from './dialogs/DisableReferenceBookDialog';
import { VerifyReferenceBookDialog } from './dialogs/VerifyReferenceBookDialog';
import { ReferenceBookMobileCard } from './ReferenceBookMobileCard';
import { ReferenceBookTable } from './ReferenceBookTable';

const SOURCE_TYPES: ReferenceSourceType[] = [
  'MOM_NOTEBOOK',
  'SUPPLIER_INFO',
  'REAL_MEASUREMENT',
  'SERVICE_HISTORY',
  'SERVICE_MANUAL',
  'OTHER',
];

const VERIFICATION_STATUSES: VerificationStatus[] = [
  'DRAFT',
  'PENDING_REVIEW',
  'VERIFIED',
  'OLD_DATA',
];

const LIMIT = 20;
type StatusFilter = 'true' | 'false' | '__all';

export function ReferenceBookPage() {
  const { t } = useTranslation();

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [modelFilter, setModelFilter] = useState('__all');
  const [sourceFilter, setSourceFilter] = useState<ReferenceSourceType | '__all'>('__all');
  const [verifyFilter, setVerifyFilter] = useState<VerificationStatus | '__all'>('__all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('__all');

  const [pendingModel, setPendingModel] = useState('__all');
  const [pendingSource, setPendingSource] = useState<ReferenceSourceType | '__all'>('__all');
  const [pendingVerify, setPendingVerify] = useState<VerificationStatus | '__all'>('__all');
  const [pendingStatus, setPendingStatus] = useState<StatusFilter>('__all');

  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [statusTarget, setStatusTarget] = useState<ReferenceBook | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ReferenceBook | null>(null);
  const [verifyTarget, setVerifyTarget] = useState<ReferenceBook | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);

  const [updateStatus, { isLoading: isToggling }] = useUpdateReferenceBookStatusMutation();
  const [deleteRecord, { isLoading: isDeleting }] = useDeleteReferenceBookMutation();
  const [updateVerification, { isLoading: isVerifying }] = useUpdateReferenceBookVerificationMutation();

  const { data: machineModelsData } = useGetMachineModelsQuery({ isActive: true, limit: 100 });
  const machineModels = machineModelsData?.data ?? [];

  useEffect(() => {
    const timer = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => { setPage(1); }, [modelFilter, sourceFilter, verifyFilter, statusFilter]);

  const { data, isLoading, isFetching } = useGetReferenceBooksQuery({
    search: search || undefined,
    machineModelId: modelFilter === '__all' ? undefined : modelFilter,
    sourceType: sourceFilter === '__all' ? undefined : (sourceFilter as ReferenceSourceType),
    verificationStatus: verifyFilter === '__all' ? undefined : (verifyFilter as VerificationStatus),
    isActive: statusFilter === '__all' ? undefined : statusFilter === 'true',
    page,
    limit: LIMIT,
  });

  const records = data?.data ?? [];
  const meta = data?.meta;

  const activeFilterCount =
    (modelFilter !== '__all' ? 1 : 0) +
    (sourceFilter !== '__all' ? 1 : 0) +
    (verifyFilter !== '__all' ? 1 : 0) +
    (statusFilter !== '__all' ? 1 : 0);

  const handleSheetOpen = (open: boolean) => {
    if (open) { setPendingModel(modelFilter); setPendingSource(sourceFilter); setPendingVerify(verifyFilter); setPendingStatus(statusFilter); }
    setFilterSheetOpen(open);
  };

  const handleApplyFilters = () => {
    setModelFilter(pendingModel); setSourceFilter(pendingSource);
    setVerifyFilter(pendingVerify); setStatusFilter(pendingStatus);
    setFilterSheetOpen(false);
  };

  const handleResetFilters = () => {
    setPendingModel('__all'); setPendingSource('__all'); setPendingVerify('__all'); setPendingStatus('__all');
    setModelFilter('__all'); setSourceFilter('__all'); setVerifyFilter('__all'); setStatusFilter('__all');
    setFilterSheetOpen(false);
  };

  const handleStatusConfirm = async () => {
    if (!statusTarget) return;
    try {
      await updateStatus({ id: statusTarget.id, isActive: !statusTarget.isActive }).unwrap();
      toast.success(statusTarget.isActive ? t('referenceBook.disabledSuccess') : t('referenceBook.enabledSuccess'));
      setStatusDialogOpen(false); setStatusTarget(null);
    } catch { toast.error(t('common.error')); }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteRecord(deleteTarget.id).unwrap();
      toast.success(t('referenceBook.deleteSuccess'));
      setDeleteDialogOpen(false); setDeleteTarget(null);
    } catch { toast.error(t('common.error')); }
  };

  const handleVerifyConfirm = async (status: VerificationStatus) => {
    if (!verifyTarget) return;
    try {
      await updateVerification({ id: verifyTarget.id, verificationStatus: status }).unwrap();
      toast.success(t('referenceBook.verificationUpdated'));
      setVerifyDialogOpen(false); setVerifyTarget(null);
    } catch { toast.error(t('common.error')); }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-end md:justify-between gap-3">
        <h2 className="hidden md:block text-xl font-semibold">{t('referenceBook.title')}</h2>
        <Button asChild size="sm">
          <Link href="/admin/reference-book/create">
            <Plus className="h-4 w-4 mr-1" />
            {t('referenceBook.createRecord')}
          </Link>
        </Button>
      </div>

      {/* Search + Filters */}
      <div className="flex gap-3 items-center">
        <AppSearchInput
          placeholder={t('referenceBook.searchPlaceholder')}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onClear={() => setSearchInput('')}
        />

        {/* Desktop filters */}
        <div className="hidden md:flex gap-3 flex-wrap">
          <Select value={modelFilter} onValueChange={setModelFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder={t('referenceBook.allMachineModels')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{t('referenceBook.allMachineModels')}</SelectItem>
              {machineModels.map((m) => (
                <SelectItem key={m.id} value={m.id}>{m.brand} {m.model}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sourceFilter} onValueChange={(v) => setSourceFilter(v as ReferenceSourceType | '__all')}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder={t('referenceBook.allSourceTypes')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{t('referenceBook.allSourceTypes')}</SelectItem>
              {SOURCE_TYPES.map((st) => (
                <SelectItem key={st} value={st}>{t(`sourceTypes.${st}`)}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={verifyFilter} onValueChange={(v) => setVerifyFilter(v as VerificationStatus | '__all')}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder={t('referenceBook.allVerificationStatuses')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{t('referenceBook.allVerificationStatuses')}</SelectItem>
              {VERIFICATION_STATUSES.map((vs) => (
                <SelectItem key={vs} value={vs}>{t(`verificationStatuses.${vs}`)}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder={t('referenceBook.allStatuses')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{t('referenceBook.allStatuses')}</SelectItem>
              <SelectItem value="true">{t('common.active')}</SelectItem>
              <SelectItem value="false">{t('common.inactive')}</SelectItem>
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
                <p className="text-sm font-medium">{t('referenceBook.machineModel')}</p>
                <Select value={pendingModel} onValueChange={setPendingModel}>
                  <SelectTrigger><SelectValue placeholder={t('referenceBook.allMachineModels')} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">{t('referenceBook.allMachineModels')}</SelectItem>
                    {machineModels.map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.brand} {m.model}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">{t('referenceBook.sourceType')}</p>
                <Select value={pendingSource} onValueChange={(v) => setPendingSource(v as ReferenceSourceType | '__all')}>
                  <SelectTrigger><SelectValue placeholder={t('referenceBook.allSourceTypes')} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">{t('referenceBook.allSourceTypes')}</SelectItem>
                    {SOURCE_TYPES.map((st) => (
                      <SelectItem key={st} value={st}>{t(`sourceTypes.${st}`)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">{t('referenceBook.verificationStatus')}</p>
                <Select value={pendingVerify} onValueChange={(v) => setPendingVerify(v as VerificationStatus | '__all')}>
                  <SelectTrigger><SelectValue placeholder={t('referenceBook.allVerificationStatuses')} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">{t('referenceBook.allVerificationStatuses')}</SelectItem>
                    {VERIFICATION_STATUSES.map((vs) => (
                      <SelectItem key={vs} value={vs}>{t(`verificationStatuses.${vs}`)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">{t('referenceBook.statusLabel')}</p>
                <Select value={pendingStatus} onValueChange={(v) => setPendingStatus(v as StatusFilter)}>
                  <SelectTrigger><SelectValue placeholder={t('referenceBook.allStatuses')} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">{t('referenceBook.allStatuses')}</SelectItem>
                    <SelectItem value="true">{t('common.active')}</SelectItem>
                    <SelectItem value="false">{t('common.inactive')}</SelectItem>
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
          <ReferenceBookTable
            records={records}
            onToggleStatus={(r) => { setStatusTarget(r); setStatusDialogOpen(true); }}
            onDelete={(r) => { setDeleteTarget(r); setDeleteDialogOpen(true); }}
            onUpdateVerification={(r) => { setVerifyTarget(r); setVerifyDialogOpen(true); }}
          />
        </div>
      )}

      {/* Mobile cards */}
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
                onToggleStatus={(r) => { setStatusTarget(r); setStatusDialogOpen(true); }}
                onDelete={(r) => { setDeleteTarget(r); setDeleteDialogOpen(true); }}
                onUpdateVerification={(r) => { setVerifyTarget(r); setVerifyDialogOpen(true); }}
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

      {/* Dialogs */}
      <DisableReferenceBookDialog record={statusTarget} open={statusDialogOpen} onOpenChange={setStatusDialogOpen} onConfirm={handleStatusConfirm} isLoading={isToggling} />
      <DeleteReferenceBookDialog record={deleteTarget} open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} onConfirm={handleDeleteConfirm} isLoading={isDeleting} />
      <VerifyReferenceBookDialog record={verifyTarget} open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen} onConfirm={handleVerifyConfirm} isLoading={isVerifying} />
    </div>
  );
}
