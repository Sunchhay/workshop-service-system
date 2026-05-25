'use client';

import { Loader2 } from 'lucide-react';

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

import type { Product } from '../../types';

interface DisableProductDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

export function DisableProductDialog({
  product,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DisableProductDialogProps) {
  const { t } = useTranslation();

  const isDisabling = product?.isActive ?? true;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isDisabling
              ? t('products.confirmDisableTitle')
              : t('products.confirmEnableTitle')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isDisabling
              ? t('products.confirmDisableDesc')
              : t('products.confirmEnableDesc')}
            {product && (
              <span className="block mt-1 font-medium text-foreground">
                {product.name} ({product.code})
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {t('common.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('common.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
