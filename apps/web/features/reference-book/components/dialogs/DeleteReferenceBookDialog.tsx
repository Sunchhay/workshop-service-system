'use client';

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
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { ReferenceBook } from '../../types';

interface DeleteReferenceBookDialogProps {
  record: ReferenceBook | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteReferenceBookDialog({
  record,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeleteReferenceBookDialogProps) {
  const { t } = useTranslation();

  if (!record) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('referenceBook.confirmDeleteTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-medium text-foreground">{record.partName}</span> —{' '}
            {t('referenceBook.confirmDeleteDesc')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{t('common.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive/10 text-destructive hover:bg-destructive/20"
          >
            {t('common.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
