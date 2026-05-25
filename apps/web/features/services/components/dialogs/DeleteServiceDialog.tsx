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

import type { Service } from '../../types';

interface DeleteServiceDialogProps {
  service: Service | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteServiceDialog({
  service,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeleteServiceDialogProps) {
  const { t } = useTranslation();

  if (!service) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('services.confirmDeleteTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-medium text-foreground">
              {service.nameEn}
            </span>{' '}
            ({service.code}) — {t('services.confirmDeleteDesc')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {t('common.cancel')}
          </AlertDialogCancel>
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
