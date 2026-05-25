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

import type { Customer } from '../../types';

interface DisableCustomerDialogProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DisableCustomerDialog({
  customer,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DisableCustomerDialogProps) {
  const { t } = useTranslation();

  if (!customer) return null;

  const isDisabling = customer.isActive;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isDisabling
              ? t('customers.confirmDisableTitle')
              : t('customers.confirmEnableTitle')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-medium text-foreground">{customer.name}</span>{' '}
            ({customer.code}) —{' '}
            {isDisabling
              ? t('customers.confirmDisableDesc')
              : t('customers.confirmEnableDesc')}
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
              ? t('customers.confirmDisableTitle')
              : t('customers.confirmEnableTitle')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
