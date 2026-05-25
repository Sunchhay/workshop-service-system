'use client';

import { ArrowLeft, FileText, Pencil, Printer, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useCreateInvoiceFromServiceJobMutation } from '@/features/invoices/api';

import {
  useDeleteServiceJobMutation,
  useGetServiceJobQuery,
  useUpdateServiceJobStatusMutation,
} from '../api';
import type { JobStatus, Priority, ServiceJob } from '../types';
import { DeleteServiceJobDialog } from './dialogs/DeleteServiceJobDialog';
import { UpdateServiceJobStatusDialog } from './dialogs/UpdateServiceJobStatusDialog';

const statusClass: Record<JobStatus, string> = {
  PENDING: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
  IN_PROGRESS: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
  COMPLETED: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
  DELIVERED: 'bg-teal-500/10 text-teal-700 border-teal-500/20 dark:text-teal-400',
  CANCELLED: 'bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400',
};

const priorityClass: Record<Priority, string> = {
  LOW: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
  NORMAL: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
  HIGH: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
  URGENT: 'bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400',
};

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatDecimal(v: string) {
  const n = parseFloat(v);
  return isNaN(n) ? '0.00' : n.toFixed(2);
}

export function ServiceJobDetailPage({ id }: { id: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading } = useGetServiceJobQuery(id);
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateServiceJobStatusMutation();
  const [deleteJob, { isLoading: isDeleting }] = useDeleteServiceJobMutation();
  const [createInvoiceFromJob, { isLoading: isCreatingInvoice }] = useCreateInvoiceFromServiceJobMutation();

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const job = data?.data;

  const handleStatusConfirm = async (status: JobStatus) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success(t('serviceJobs.statusUpdated'));
      setStatusDialogOpen(false);
    } catch { toast.error(t('common.error')); }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteJob(id).unwrap();
      toast.success(t('serviceJobs.deleteSuccess'));
      router.replace('/admin/service-jobs');
    } catch { toast.error(t('common.error')); }
  };

  const handleCreateInvoice = async () => {
    try {
      const result = await createInvoiceFromJob(id).unwrap();
      toast.success(t('invoices.fromJobSuccess'));
      router.push(`/admin/invoices/${result.data.id}`);
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string } })?.data?.message ?? t('common.error');
      toast.error(message);
    }
  };

  const jobTotal = job?.items.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0) ?? 0;

  return (
    <div className="space-y-4">
      <div className="hidden md:flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{t('serviceJobs.jobDetail')}</h2>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-5 w-32" />
          </CardContent>
        </Card>
      ) : job ? (
        <>
          {/* Main info card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <CardTitle className="font-mono">{job.jobCode}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{job.partDescription}</p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/service-jobs/${id}/edit`}>
                    <Pencil className="h-3.5 w-3.5 mr-1.5" />{t('common.edit')}
                  </Link>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <Separator />

              {/* Status + Priority badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={statusClass[job.status]}>
                  {t(`jobStatuses.${job.status}`)}
                </Badge>
                <Badge variant="outline" className={priorityClass[job.priority]}>
                  {t(`priorities.${job.priority}`)}
                </Badge>
              </div>

              <Separator />

              {/* Customer + Machine model */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">{t('serviceJobs.customer')}</p>
                  <p className="font-medium">{job.customer.name}</p>
                  <p className="text-muted-foreground text-xs">{job.customer.phone}</p>
                </div>
                {job.machineModel && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">{t('serviceJobs.machineModel')}</p>
                    <p className="font-medium">{job.machineModel.brand} {job.machineModel.model}</p>
                    {job.machineModel.category && (
                      <p className="text-muted-foreground text-xs">{job.machineModel.category}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">{t('serviceJobs.estimatedCompletionDate')}</p>
                  <p>{formatDate(job.estimatedCompletionDate)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">{t('serviceJobs.completedAt')}</p>
                  <p>{formatDate(job.completedAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">{t('serviceJobs.deliveredAt')}</p>
                  <p>{formatDate(job.deliveredAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">{t('serviceJobs.assignedTo')}</p>
                  <p>{job.assignedTo?.name ?? t('serviceJobs.unassigned')}</p>
                </div>
              </div>

              {/* Notes */}
              {(job.notes || job.technicianNotes) && (
                <>
                  <Separator />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
                    {job.notes && (
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">{t('serviceJobs.notes')}</p>
                        <p className="whitespace-pre-line text-muted-foreground">{job.notes}</p>
                      </div>
                    )}
                    {job.technicianNotes && (
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">{t('serviceJobs.technicianNotes')}</p>
                        <p className="whitespace-pre-line text-muted-foreground">{job.technicianNotes}</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              <Separator />

              {/* Timestamps + created by */}
              <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">{t('serviceJobs.createdBy')}</p>
                  <p>{job.createdBy.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">{t('serviceJobs.createdAt')}</p>
                  <p>{formatDate(job.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">{t('serviceJobs.updatedAt')}</p>
                  <p>{formatDate(job.updatedAt)}</p>
                </div>
              </div>

              <Separator />

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => setStatusDialogOpen(true)}>
                  {t('serviceJobs.updateStatusTitle')}
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/print/service-jobs/${id}`} target="_blank" rel="noopener noreferrer">
                    <Printer className="h-3.5 w-3.5 mr-1.5" />{t('serviceJobs.printWorkSheet')}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />{t('common.delete')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Items card */}
          {job.items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('serviceJobs.items')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {job.items.map((item, i) => (
                  <div key={item.id}>
                    {i > 0 && <Separator className="my-3" />}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-sm">{item.description}</p>
                        <p className="font-mono text-sm font-medium">${formatDecimal(item.totalPrice)}</p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{t('serviceJobs.quantity')}: {formatDecimal(item.quantity)}</span>
                        <span>×</span>
                        <span>${formatDecimal(item.unitPrice)}</span>
                        {item.service && <span>· {item.service.nameEn}</span>}
                      </div>
                      {item.measurement && (
                        <p className="text-xs text-muted-foreground">{t('serviceJobs.measurement')}: {item.measurement}</p>
                      )}
                      {item.notes && (
                        <p className="text-xs text-muted-foreground">{item.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
                <Separator />
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>{t('serviceJobs.jobTotal')}</span>
                  <span className="font-mono text-base">${jobTotal.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Create Invoice */}
          <Card>
            <CardContent className="pt-6 flex flex-col items-center gap-3 py-6">
              <p className="text-sm text-muted-foreground text-center">
                {t('serviceJobs.invoicePlaceholder')}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCreateInvoice}
                disabled={isCreatingInvoice}
              >
                <FileText className="h-3.5 w-3.5 mr-1.5" />
                {t('invoices.createFromJob')}
              </Button>
            </CardContent>
          </Card>

          <UpdateServiceJobStatusDialog
            job={job as ServiceJob}
            open={statusDialogOpen}
            onOpenChange={setStatusDialogOpen}
            onConfirm={handleStatusConfirm}
            isLoading={isUpdatingStatus}
          />
          <DeleteServiceJobDialog
            job={job as ServiceJob}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={handleDeleteConfirm}
            isLoading={isDeleting}
          />
        </>
      ) : (
        <p className="text-muted-foreground">{t('common.error')}</p>
      )}
    </div>
  );
}
