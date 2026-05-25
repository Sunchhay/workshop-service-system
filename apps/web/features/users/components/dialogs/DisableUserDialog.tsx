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

import type { User } from '../../types';

interface DisableUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DisableUserDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DisableUserDialogProps) {
  const { t } = useTranslation();

  if (!user) return null;

  const isDisabling = user.isActive;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isDisabling
              ? t('users.confirmDisableTitle')
              : t('users.confirmEnableTitle')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-medium text-foreground">{user.name}</span>
            {' — '}
            {isDisabling
              ? t('users.confirmDisableDesc')
              : t('users.confirmEnableDesc')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {t('common.cancel')}
          </AlertDialogCancel>
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
              ? t('users.confirmDisableTitle')
              : t('users.confirmEnableTitle')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
