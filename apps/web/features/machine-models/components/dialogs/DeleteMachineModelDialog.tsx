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

import type { MachineModel } from '../../types';

interface DeleteMachineModelDialogProps {
  model: MachineModel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteMachineModelDialog({
  model,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeleteMachineModelDialogProps) {
  const { t } = useTranslation();

  if (!model) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('machineModels.confirmDeleteTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-medium text-foreground">
              {model.brand} {model.model}
            </span>{' '}
            — {t('machineModels.confirmDeleteDesc')}
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
