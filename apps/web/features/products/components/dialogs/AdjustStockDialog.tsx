'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
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
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { AdjustStockRequest, Product } from '../../types';

const adjustSchema = z.object({
  quantityChange: z.string().min(1),
  reason: z.string(),
  note: z.string(),
}).superRefine((data, ctx) => {
  const n = parseInt(data.quantityChange, 10);
  if (isNaN(n) || n === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'quantityChangeInvalid',
      path: ['quantityChange'],
    });
  }
});

type AdjustFormValues = z.infer<typeof adjustSchema>;

interface AdjustStockDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: AdjustStockRequest) => Promise<void>;
  isLoading: boolean;
}

export function AdjustStockDialog({
  product,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: AdjustStockDialogProps) {
  const { t } = useTranslation();

  const form = useForm<AdjustFormValues>({
    resolver: zodResolver(adjustSchema),
    defaultValues: { quantityChange: '', reason: '', note: '' },
  });

  useEffect(() => {
    if (open) form.reset({ quantityChange: '', reason: '', note: '' });
  }, [open, form]);

  const quantityChange = form.watch('quantityChange');
  const preview = product
    ? product.stockQuantity + (parseInt(quantityChange, 10) || 0)
    : 0;

  const handleSubmit = async (data: AdjustFormValues) => {
    await onConfirm({
      quantityChange: parseInt(data.quantityChange, 10),
      reason: data.reason || undefined,
      note: data.note || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('products.adjustStockTitle')}</DialogTitle>
          {product && (
            <p className="text-sm text-muted-foreground">
              {product.name} ({product.code})
            </p>
          )}
        </DialogHeader>

        {product && (
          <div className="flex items-center justify-between rounded-lg bg-muted px-4 py-3 text-sm mb-2">
            <span className="text-muted-foreground">{t('products.currentStock')}</span>
            <span className="font-mono font-semibold">
              {product.stockQuantity} {product.unit}
            </span>
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="quantityChange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('products.quantityChange')}{' '}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="1"
                      placeholder={t('products.quantityChangePlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  {product && quantityChange && !isNaN(parseInt(quantityChange, 10)) && (
                    <p className="text-xs text-muted-foreground">
                      {t('products.newStock')}: {preview} {product.unit}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('products.adjustReason')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('products.adjustReasonPlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('products.adjustNote')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('products.adjustNotePlaceholder')}
                      className="resize-none min-h-[60px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('common.confirm')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
