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

import type { ProductPrice } from '../../types';

interface DisableProductPriceDialogProps {
  productPrice: ProductPrice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DisableProductPriceDialog({
  productPrice,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DisableProductPriceDialogProps) {
  const { t } = useTranslation();

  if (!productPrice) return null;

  const isDisabling = productPrice.status === 'ACTIVE';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isDisabling
              ? t('productPrices.confirmDisableTitle')
              : t('productPrices.confirmEnableTitle')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-medium text-foreground">
              {productPrice.product.name} — {productPrice.machineModel.modelName}
            </span>{' '}
            —{' '}
            {isDisabling
              ? t('productPrices.confirmDisableDesc')
              : t('productPrices.confirmEnableDesc')}
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
              ? t('productPrices.confirmDisableTitle')
              : t('productPrices.confirmEnableTitle')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
