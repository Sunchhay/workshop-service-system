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

import type { ReferenceBook, VerificationStatus } from '../../types';

const VERIFICATION_STATUSES: VerificationStatus[] = [
  'DRAFT',
  'PENDING_REVIEW',
  'VERIFIED',
  'OLD_DATA',
];

interface VerifyReferenceBookDialogProps {
  record: ReferenceBook | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (status: VerificationStatus) => void;
  isLoading?: boolean;
}

export function VerifyReferenceBookDialog({
  record,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: VerifyReferenceBookDialogProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<VerificationStatus>(
    record?.verificationStatus ?? 'DRAFT',
  );

  if (!record) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('referenceBook.confirmVerifyTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-medium text-foreground">{record.partName}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="px-1 py-2">
          <Select
            value={selected}
            onValueChange={(v) => setSelected(v as VerificationStatus)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VERIFICATION_STATUSES.map((vs) => (
                <SelectItem key={vs} value={vs}>
                  {t(`verificationStatuses.${vs}`)}
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
