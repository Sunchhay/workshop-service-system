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

interface DisableReferenceBookDialogProps {
  record: ReferenceBook | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DisableReferenceBookDialog({
  record,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DisableReferenceBookDialogProps) {
  const { t } = useTranslation();

  if (!record) return null;

  const isDisabling = record.isActive;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isDisabling
              ? t('referenceBook.confirmDisableTitle')
              : t('referenceBook.confirmEnableTitle')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-medium text-foreground">{record.partName}</span> —{' '}
            {isDisabling
              ? t('referenceBook.confirmDisableDesc')
              : t('referenceBook.confirmEnableDesc')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{t('common.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={
              isDisabling
                ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                : ''
            }
          >
            {isDisabling
              ? t('referenceBook.confirmDisableTitle')
              : t('referenceBook.confirmEnableTitle')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
