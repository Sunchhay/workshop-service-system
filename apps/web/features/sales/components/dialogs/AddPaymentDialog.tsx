'use client';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { AddSalePaymentRequest, SalePaymentMethod } from '../../types';

const METHODS: SalePaymentMethod[] = ['CASH', 'ACLEDA', 'ABA', 'BAKONG', 'OTHER'];

interface AddPaymentDialogProps {
  saleId: string;
  balanceAmount: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: AddSalePaymentRequest) => Promise<void>;
  isLoading?: boolean;
}

export function AddPaymentDialog({
  balanceAmount,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: AddPaymentDialogProps) {
  const { t } = useTranslation();

  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<SalePaymentMethod>('CASH');
  const [referenceNo, setReferenceNo] = useState('');
  const [note, setNote] = useState('');
  const [paidAt, setPaidAt] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');

  const resetForm = () => {
    setAmount('');
    setPaymentMethod('CASH');
    setReferenceNo('');
    setNote('');
    setPaidAt(new Date().toISOString().slice(0, 10));
    setError('');
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) resetForm();
    onOpenChange(val);
  };

  const handleSubmit = async () => {
    const amt = parseFloat(amount);
    if (!amount || isNaN(amt) || amt <= 0) {
      setError(t('payments.amountInvalid'));
      return;
    }
    if (amt > balanceAmount) {
      setError(t('payments.amountExceedsDue'));
      return;
    }
    setError('');
    await onConfirm({
      paymentMethod,
      amount: amt,
      referenceNo: referenceNo.trim() || undefined,
      note: note.trim() || undefined,
      paidAt: paidAt || undefined,
    });
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('sales.addPayment')}</DialogTitle>
        </DialogHeader>

        <div className="rounded-lg bg-muted/50 px-4 py-3 text-sm flex justify-between">
          <span className="text-muted-foreground">{t('sales.balanceAmount')}</span>
          <span className="font-mono font-semibold text-amber-700 dark:text-amber-400">
            ${balanceAmount.toFixed(2)}
          </span>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>
                {t('payments.amount')} <span className="text-destructive">*</span>
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => { setAmount(balanceAmount.toFixed(2)); setError(''); }}
              >
                {t('payments.payRemaining')}
              </Button>
            </div>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              max={balanceAmount}
              placeholder={t('payments.amountPlaceholder')}
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setError(''); }}
              disabled={isLoading}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>
              {t('payments.paymentMethod')} <span className="text-destructive">*</span>
            </Label>
            <Select
              value={paymentMethod}
              onValueChange={(v) => setPaymentMethod(v as SalePaymentMethod)}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {METHODS.map((m) => (
                  <SelectItem key={m} value={m}>{t(`paymentMethods.${m}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>{t('payments.paidAt')}</Label>
            <Input
              type="date"
              value={paidAt}
              onChange={(e) => setPaidAt(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1.5">
            <Label>{t('payments.referenceNo')}</Label>
            <Input
              placeholder={t('payments.referenceNoPlaceholder')}
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1.5">
            <Label>{t('payments.note')}</Label>
            <Input
              placeholder={t('payments.notePlaceholder')}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('sales.addPayment')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
