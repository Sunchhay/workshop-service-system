'use client';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

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
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useCreatePaymentMutation } from '../../api';
import type { Invoice } from '@/features/invoices/types';
import type { PaymentMethod } from '../../types';

const METHODS: PaymentMethod[] = ['CASH', 'ABA', 'BANK_TRANSFER', 'CARD', 'OTHER'];

interface RecordPaymentDialogProps {
  invoice: Invoice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecordPaymentDialog({
  invoice,
  open,
  onOpenChange,
}: RecordPaymentDialogProps) {
  const { t } = useTranslation();
  const [createPayment, { isLoading }] = useCreatePaymentMutation();

  const dueAmount = parseFloat(invoice.dueAmount);
  const totalAmount = parseFloat(invoice.totalAmount);
  const paidAmount = parseFloat(invoice.paidAmount);

  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('CASH');
  const [referenceNo, setReferenceNo] = useState('');
  const [notes, setNotes] = useState('');
  const [paidAt, setPaidAt] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');

  const resetForm = () => {
    setAmount('');
    setMethod('CASH');
    setReferenceNo('');
    setNotes('');
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
    if (amt > dueAmount) {
      setError(t('payments.amountExceedsDue'));
      return;
    }

    setError('');

    try {
      await createPayment({
        invoiceId: invoice.id,
        customerId: invoice.customerId,
        amount: amt,
        method,
        referenceNo: referenceNo || undefined,
        notes: notes || undefined,
        paidAt: paidAt || undefined,
      }).unwrap();
      toast.success(t('payments.createSuccess'));
      handleOpenChange(false);
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ?? t('common.error');
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('payments.recordPayment')}</DialogTitle>
        </DialogHeader>

        {/* Invoice summary */}
        <div className="rounded-lg bg-muted/50 px-4 py-3 text-sm space-y-1.5">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('payments.invoiceTotal')}</span>
            <span className="font-mono font-medium">${totalAmount.toFixed(2)}</span>
          </div>
          {paidAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('payments.invoicePaid')}</span>
              <span className="font-mono text-green-700 dark:text-green-400">
                ${paidAmount.toFixed(2)}
              </span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>{t('payments.invoiceDue')}</span>
            <span className="font-mono text-amber-700 dark:text-amber-400">
              ${dueAmount.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {/* Amount */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>{t('payments.amount')} <span className="text-destructive">*</span></Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setAmount(dueAmount.toFixed(2))}
              >
                {t('payments.payRemaining')}
              </Button>
            </div>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              max={dueAmount}
              placeholder={t('payments.amountPlaceholder')}
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setError(''); }}
              disabled={isLoading}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          {/* Method */}
          <div className="space-y-1.5">
            <Label>{t('payments.method')} <span className="text-destructive">*</span></Label>
            <Select value={method} onValueChange={(v) => setMethod(v as PaymentMethod)} disabled={isLoading}>
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

          {/* Paid At */}
          <div className="space-y-1.5">
            <Label>{t('payments.paidAt')}</Label>
            <Input
              type="date"
              value={paidAt}
              onChange={(e) => setPaidAt(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Reference No */}
          <div className="space-y-1.5">
            <Label>{t('payments.referenceNo')}</Label>
            <Input
              placeholder={t('payments.referenceNoPlaceholder')}
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label>{t('payments.notes')}</Label>
            <Textarea
              placeholder={t('payments.notesPlaceholder')}
              className="min-h-[60px] resize-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
            {t('payments.recordPayment')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
