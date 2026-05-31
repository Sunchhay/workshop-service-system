'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { CheckoutRequest, PaymentMethod } from '../../types';

const PAYMENT_METHODS: PaymentMethod[] = ['CASH', 'ACLEDA', 'ABA', 'BAKONG', 'OTHER'];

const schema = z.object({
  paymentMethod: z.string().optional(),
  paidAmount: z.string().optional(),
  referenceNo: z.string().optional(),
  paymentNote: z.string().optional(),
  saleNote: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface CheckoutDialogProps {
  cartId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: CheckoutRequest) => Promise<void>;
  isLoading?: boolean;
}

export function CheckoutDialog({
  cartId,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: CheckoutDialogProps) {
  const { t } = useTranslation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      paymentMethod: '__none',
      paidAmount: '',
      referenceNo: '',
      paymentNote: '',
      saleNote: '',
    },
  });

  const handleSubmit = async (data: FormValues) => {
    await onConfirm({
      cartId,
      paymentMethod: data.paymentMethod === '__none' ? undefined : (data.paymentMethod as PaymentMethod),
      paidAmount: data.paidAmount?.trim() ? parseFloat(data.paidAmount) : undefined,
      referenceNo: data.referenceNo?.trim() || undefined,
      paymentNote: data.paymentNote?.trim() || undefined,
      saleNote: data.saleNote?.trim() || undefined,
    });
    form.reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) form.reset();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('cart.checkoutTitle')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('cart.paymentMethod')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('cart.selectPaymentMethod')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="__none">—</SelectItem>
                      {PAYMENT_METHODS.map((m) => (
                        <SelectItem key={m} value={m}>
                          {t(`paymentMethods.${m}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="paidAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('cart.paidAmount')}</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="referenceNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('cart.referenceNo')}</FormLabel>
                    <FormControl>
                      <Input placeholder="REF-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="paymentNote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('cart.paymentNote')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('cart.paymentNotePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="saleNote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('cart.saleNote')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('cart.saleNotePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('cart.checkout')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
