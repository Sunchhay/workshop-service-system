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

interface DisableMachineModelDialogProps {
  model: MachineModel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DisableMachineModelDialog({
  model,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DisableMachineModelDialogProps) {
  const { t } = useTranslation();

  if (!model) return null;

  const isDisabling = model.isActive;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isDisabling
              ? t('machineModels.confirmDisableTitle')
              : t('machineModels.confirmEnableTitle')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-medium text-foreground">
              {model.brand} {model.model}
            </span>{' '}
            —{' '}
            {isDisabling
              ? t('machineModels.confirmDisableDesc')
              : t('machineModels.confirmEnableDesc')}
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
              ? t('machineModels.confirmDisableTitle')
              : t('machineModels.confirmEnableTitle')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
