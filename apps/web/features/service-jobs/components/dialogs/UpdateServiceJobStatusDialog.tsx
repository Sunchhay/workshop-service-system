'use client';

import { useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { JobStatus, ServiceJob } from '../../types';

const JOB_STATUSES: JobStatus[] = [
  'PENDING',
  'IN_PROGRESS',
  'COMPLETED',
  'DELIVERED',
  'CANCELLED',
];

interface UpdateServiceJobStatusDialogProps {
  job: ServiceJob | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (status: JobStatus) => void;
  isLoading?: boolean;
}

export function UpdateServiceJobStatusDialog({
  job,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: UpdateServiceJobStatusDialogProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<JobStatus>(job?.status ?? 'PENDING');

  if (!job) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('serviceJobs.updateStatusTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-medium text-foreground">{job.jobCode}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="px-1 py-2">
          <Select
            value={selected}
            onValueChange={(v) => setSelected(v as JobStatus)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {JOB_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {t(`jobStatuses.${s}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{t('common.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(selected)}
            disabled={isLoading}
          >
            {t('common.save')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
