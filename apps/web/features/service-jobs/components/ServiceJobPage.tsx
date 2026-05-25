'use client';

import { Briefcase, Plus, SlidersHorizontal } from 'lucide-react';
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

import {
  useDeleteServiceJobMutation,
  useGetServiceJobsQuery,
  useUpdateServiceJobStatusMutation,
} from '../api';
import type { JobStatus, Priority, ServiceJob } from '../types';
import { DeleteServiceJobDialog } from './dialogs/DeleteServiceJobDialog';
import { UpdateServiceJobStatusDialog } from './dialogs/UpdateServiceJobStatusDialog';
import { ServiceJobMobileCard } from './ServiceJobMobileCard';
import { ServiceJobTable } from './ServiceJobTable';

const JOB_STATUSES: JobStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELIVERED', 'CANCELLED'];
const PRIORITIES: Priority[] = ['LOW', 'NORMAL', 'HIGH', 'URGENT'];
const LIMIT = 20;
type StatusFilter = JobStatus | '__all';
type PriorityFilter = Priority | '__all';

export function ServiceJobPage() {
  const { t } = useTranslation();

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('__all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('__all');
  const [pendingStatus, setPendingStatus] = useState<StatusFilter>('__all');
  const [pendingPriority, setPendingPriority] = useState<PriorityFilter>('__all');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [statusTarget, setStatusTarget] = useState<ServiceJob | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ServiceJob | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateServiceJobStatusMutation();
  const [deleteJob, { isLoading: isDeleting }] = useDeleteServiceJobMutation();

  useEffect(() => {
    const timer = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => { setPage(1); }, [statusFilter, priorityFilter]);

  const { data, isLoading, isFetching } = useGetServiceJobsQuery({
    search: search || undefined,
    status: statusFilter === '__all' ? undefined : statusFilter,
    priority: priorityFilter === '__all' ? undefined : priorityFilter,
    page,
    limit: LIMIT,
  });

  const jobs = data?.data ?? [];
  const meta = data?.meta;

  const activeFilterCount =
    (statusFilter !== '__all' ? 1 : 0) + (priorityFilter !== '__all' ? 1 : 0);

  const handleSheetOpen = (open: boolean) => {
    if (open) { setPendingStatus(statusFilter); setPendingPriority(priorityFilter); }
    setFilterSheetOpen(open);
  };

  const handleApplyFilters = () => {
    setStatusFilter(pendingStatus); setPriorityFilter(pendingPriority);
    setFilterSheetOpen(false);
  };

  const handleResetFilters = () => {
    setPendingStatus('__all'); setPendingPriority('__all');
    setStatusFilter('__all'); setPriorityFilter('__all');
    setFilterSheetOpen(false);
  };

  const handleStatusConfirm = async (status: JobStatus) => {
    if (!statusTarget) return;
    try {
      await updateStatus({ id: statusTarget.id, status }).unwrap();
      toast.success(t('serviceJobs.statusUpdated'));
      setStatusDialogOpen(false); setStatusTarget(null);
    } catch { toast.error(t('common.error')); }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteJob(deleteTarget.id).unwrap();
      toast.success(t('serviceJobs.deleteSuccess'));
      setDeleteDialogOpen(false); setDeleteTarget(null);
    } catch { toast.error(t('common.error')); }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-end md:justify-between gap-3">
        <h2 className="hidden md:block text-xl font-semibold">{t('serviceJobs.title')}</h2>
        <Button asChild size="sm">
          <Link href="/admin/service-jobs/create">
            <Plus className="h-4 w-4 mr-1" />
            {t('serviceJobs.createJob')}
          </Link>
        </Button>
      </div>

      {/* Search + Filters */}
      <div className="flex gap-3 items-center">
        <AppSearchInput
          placeholder={t('serviceJobs.searchPlaceholder')}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onClear={() => setSearchInput('')}
        />

        {/* Desktop filters */}
        <div className="hidden md:flex gap-3">
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder={t('serviceJobs.allStatuses')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{t('serviceJobs.allStatuses')}</SelectItem>
              {JOB_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{t(`jobStatuses.${s}`)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as PriorityFilter)}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder={t('serviceJobs.allPriorities')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{t('serviceJobs.allPriorities')}</SelectItem>
              {PRIORITIES.map((p) => (
                <SelectItem key={p} value={p}>{t(`priorities.${p}`)}</SelectItem>
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
                <p className="text-sm font-medium">{t('serviceJobs.status')}</p>
                <Select value={pendingStatus} onValueChange={(v) => setPendingStatus(v as StatusFilter)}>
                  <SelectTrigger><SelectValue placeholder={t('serviceJobs.allStatuses')} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">{t('serviceJobs.allStatuses')}</SelectItem>
                    {JOB_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{t(`jobStatuses.${s}`)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">{t('serviceJobs.priority')}</p>
                <Select value={pendingPriority} onValueChange={(v) => setPendingPriority(v as PriorityFilter)}>
                  <SelectTrigger><SelectValue placeholder={t('serviceJobs.allPriorities')} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">{t('serviceJobs.allPriorities')}</SelectItem>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p}>{t(`priorities.${p}`)}</SelectItem>
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
          <ServiceJobTable
            jobs={jobs}
            onUpdateStatus={(job) => { setStatusTarget(job); setStatusDialogOpen(true); }}
            onDelete={(job) => { setDeleteTarget(job); setDeleteDialogOpen(true); }}
          />
        </div>
      )}

      {/* Mobile cards */}
      {!isLoading && (
        <div className={`md:hidden space-y-3 ${isFetching ? 'opacity-60' : ''}`}>
          {jobs.length === 0 ? (
            <AppEmptyState
              icon={Briefcase}
              title={t('serviceJobs.noJobs')}
              description={t('serviceJobs.noJobsDesc')}
            />
          ) : (
            jobs.map((job) => (
              <ServiceJobMobileCard
                key={job.id}
                job={job}
                onUpdateStatus={(j) => { setStatusTarget(j); setStatusDialogOpen(true); }}
                onDelete={(j) => { setDeleteTarget(j); setDeleteDialogOpen(true); }}
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
      <UpdateServiceJobStatusDialog
        job={statusTarget}
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        onConfirm={handleStatusConfirm}
        isLoading={isUpdatingStatus}
      />
      <DeleteServiceJobDialog
        job={deleteTarget}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
}
