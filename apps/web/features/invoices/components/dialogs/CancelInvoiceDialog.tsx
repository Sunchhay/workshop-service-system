'use client';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';

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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { Invoice } from '../../types';

interface CancelInvoiceDialogProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason?: string) => Promise<void>;
  isLoading: boolean;
}

export function CancelInvoiceDialog({
  invoice,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: CancelInvoiceDialogProps) {
  const { t } = useTranslation();
  const [reason, setReason] = useState('');

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('invoices.confirmCancelTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('invoices.confirmCancelDesc')}
            {invoice && (
              <span className="block mt-1 font-medium text-foreground">
                {invoice.invoiceNumber}
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2 px-1">
          <Label className="text-sm">{t('invoices.cancelReason')}</Label>
          <Input
            placeholder={t('invoices.cancelReasonPlaceholder')}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{t('common.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(reason || undefined)}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('invoices.confirmCancelTitle')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
