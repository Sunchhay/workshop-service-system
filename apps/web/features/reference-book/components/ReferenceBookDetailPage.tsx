'use client';

import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
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

import {
  useDeleteReferenceBookMutation,
  useGetReferenceBookQuery,
  useUpdateReferenceBookStatusMutation,
  useUpdateReferenceBookVerificationMutation,
} from '../api';
import type { ReferenceBook, ReferenceSourceType, VerificationStatus } from '../types';
import { DeleteReferenceBookDialog } from './dialogs/DeleteReferenceBookDialog';
import { DisableReferenceBookDialog } from './dialogs/DisableReferenceBookDialog';
import { VerifyReferenceBookDialog } from './dialogs/VerifyReferenceBookDialog';

const sourceTypeClass: Record<ReferenceSourceType, string> = {
  MOM_NOTEBOOK: 'bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400',
  SUPPLIER_INFO: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
  REAL_MEASUREMENT: 'bg-teal-500/10 text-teal-700 border-teal-500/20 dark:text-teal-400',
  SERVICE_HISTORY: 'bg-orange-500/10 text-orange-700 border-orange-500/20 dark:text-orange-400',
  SERVICE_MANUAL: 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20 dark:text-indigo-400',
  OTHER: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
};

const verificationClass: Record<VerificationStatus, string> = {
  DRAFT: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
  PENDING_REVIEW: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
  VERIFIED: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
  OLD_DATA: 'bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400',
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatDecimal(v: string | null): string {
  if (!v) return '—';
  const n = parseFloat(v);
  return isNaN(n) ? '—' : n.toFixed(3);
}

export function ReferenceBookDetailPage({ id }: { id: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading } = useGetReferenceBookQuery(id);
  const [updateStatus, { isLoading: isToggling }] = useUpdateReferenceBookStatusMutation();
  const [deleteRecord, { isLoading: isDeleting }] = useDeleteReferenceBookMutation();
  const [updateVerification, { isLoading: isVerifying }] = useUpdateReferenceBookVerificationMutation();

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);

  const record = data?.data;

  const handleStatusConfirm = async () => {
    if (!record) return;
    try {
      await updateStatus({ id, isActive: !record.isActive }).unwrap();
      toast.success(record.isActive ? t('referenceBook.disabledSuccess') : t('referenceBook.enabledSuccess'));
      setStatusDialogOpen(false);
    } catch { toast.error(t('common.error')); }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteRecord(id).unwrap();
      toast.success(t('referenceBook.deleteSuccess'));
      router.replace('/admin/reference-book');
    } catch { toast.error(t('common.error')); }
  };

  const handleVerifyConfirm = async (status: VerificationStatus) => {
    try {
      await updateVerification({ id, verificationStatus: status }).unwrap();
      toast.success(t('referenceBook.verificationUpdated'));
      setVerifyDialogOpen(false);
    } catch { toast.error(t('common.error')); }
  };

  return (
    <div className="space-y-4">
      <div className="hidden md:flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{t('referenceBook.recordDetail')}</h2>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Skeleton className="h-6 w-48" /><Skeleton className="h-5 w-64" /><Skeleton className="h-5 w-32" />
          </CardContent>
        </Card>
      ) : record ? (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <CardTitle>{record.partName}</CardTitle>
                  {record.partCode && (
                    <p className="text-xs text-muted-foreground font-mono mt-1">{record.partCode}</p>
                  )}
                  {record.machineModel && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {record.machineModel.brand} {record.machineModel.model}
                      {record.machineModel.category && ` · ${record.machineModel.category}`}
                    </p>
                  )}
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/reference-book/${id}/edit`}>
                    <Pencil className="h-3.5 w-3.5 mr-1.5" />{t('common.edit')}
                  </Link>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <Separator />

              {/* Classification badges */}
              <div className="flex flex-wrap gap-2">
                {record.componentType && (
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400">
                    {record.componentType}
                  </Badge>
                )}
                <Badge variant="outline" className={sourceTypeClass[record.sourceType]}>
                  {t(`sourceTypes.${record.sourceType}`)}
                </Badge>
                <Badge variant="outline" className={verificationClass[record.verificationStatus]}>
                  {t(`verificationStatuses.${record.verificationStatus}`)}
                </Badge>
                <Badge
                  variant={record.isActive ? 'default' : 'outline'}
                  className={record.isActive ? 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400' : 'text-muted-foreground'}
                >
                  {t(record.isActive ? 'common.active' : 'common.inactive')}
                </Badge>
              </div>

              <Separator />

              {/* Size measurements */}
              <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">{t('referenceBook.standardSize')}</p>
                  <p className="font-mono">{formatDecimal(record.standardSize)} <span className="text-muted-foreground text-xs">{record.unit}</span></p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">{t('referenceBook.wearLimit')}</p>
                  <p className="font-mono">{formatDecimal(record.wearLimit)} <span className="text-muted-foreground text-xs">{record.unit}</span></p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">{t('referenceBook.serviceLimit')}</p>
                  <p className="font-mono">{formatDecimal(record.serviceLimit)} <span className="text-muted-foreground text-xs">{record.unit}</span></p>
                </div>
              </div>

              {/* Dynamic measurements */}
              {record.measurementDetails && record.measurementDetails.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium mb-3">{t('referenceBook.measurementDetails')}</p>
                    <div className="space-y-1">
                      {record.measurementDetails.map((m, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          <span className="text-muted-foreground min-w-[120px]">{m.label}</span>
                          <span className="font-mono font-medium">{m.value}</span>
                          <span className="text-muted-foreground text-xs">{m.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Notes */}
              {record.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">{t('referenceBook.notes')}</p>
                    <p className="text-sm whitespace-pre-line text-muted-foreground">{record.notes}</p>
                  </div>
                </>
              )}

              <Separator />

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">{t('referenceBook.createdAt')}</p>
                  <p>{formatDate(record.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">{t('referenceBook.updatedAt')}</p>
                  <p>{formatDate(record.updatedAt)}</p>
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => setVerifyDialogOpen(true)}>
                  {t('referenceBook.confirmVerifyTitle')}
                </Button>
                <Button
                  variant="outline" size="sm"
                  onClick={() => setStatusDialogOpen(true)}
                  className={record.isActive ? 'border-destructive/30 text-destructive hover:bg-destructive/10' : 'border-green-500/30 text-green-700 hover:bg-green-500/10 dark:text-green-400'}
                >
                  {record.isActive ? t('referenceBook.confirmDisableTitle') : t('referenceBook.confirmEnableTitle')}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setDeleteDialogOpen(true)} className="border-destructive/30 text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />{t('common.delete')}
                </Button>
              </div>
            </CardContent>
          </Card>

          <DisableReferenceBookDialog record={record as ReferenceBook} open={statusDialogOpen} onOpenChange={setStatusDialogOpen} onConfirm={handleStatusConfirm} isLoading={isToggling} />
          <DeleteReferenceBookDialog record={record as ReferenceBook} open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} onConfirm={handleDeleteConfirm} isLoading={isDeleting} />
          <VerifyReferenceBookDialog record={record as ReferenceBook} open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen} onConfirm={handleVerifyConfirm} isLoading={isVerifying} />
        </>
      ) : (
        <p className="text-muted-foreground">{t('common.error')}</p>
      )}
    </div>
  );
}
