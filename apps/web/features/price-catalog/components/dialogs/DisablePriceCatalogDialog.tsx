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

import type { PriceCatalog } from '../../types';

interface DisablePriceCatalogDialogProps {
  entry: PriceCatalog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DisablePriceCatalogDialog({
  entry,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DisablePriceCatalogDialogProps) {
  const { t } = useTranslation();

  if (!entry) return null;

  const isDisabling = entry.isActive;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isDisabling
              ? t('priceCatalog.confirmDisableTitle')
              : t('priceCatalog.confirmEnableTitle')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-medium text-foreground">{entry.label}</span> —{' '}
            {isDisabling
              ? t('priceCatalog.confirmDisableDesc')
              : t('priceCatalog.confirmEnableDesc')}
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
              ? t('priceCatalog.confirmDisableTitle')
              : t('priceCatalog.confirmEnableTitle')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
