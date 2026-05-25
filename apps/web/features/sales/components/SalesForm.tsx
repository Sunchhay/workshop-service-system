'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod/v4';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Textarea } from '@/components/ui/textarea';
import { useGetCustomersQuery } from '@/features/customers/api';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { CreateSaleRequest, UpdateSaleRequest } from '../types';
import { SalesItemSection } from './SalesItemSection';
import { SalesSummary } from './SalesSummary';

const saleItemSchema = z.object({
  productId: z.string().min(1),
  description: z.string(),
  quantity: z.string(),
  unitPrice: z.string(),
  discountAmount: z.string(),
});

const saleSchema = z
  .object({
    customerId: z.string(),
    soldAt: z.string(),
    discountAmount: z.string(),
    notes: z.string(),
    items: z.array(saleItemSchema).min(1),
  })
  .superRefine((data, ctx) => {
    data.items.forEach((item, i) => {
      if (!item.productId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'productRequired',
          path: ['items', i, 'productId'],
        });
      }
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unitPrice) || 0;
      const disc = parseFloat(item.discountAmount) || 0;
      if (qty <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'quantityInvalid',
          path: ['items', i, 'quantity'],
        });
      }
      if (price < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'unitPriceInvalid',
          path: ['items', i, 'unitPrice'],
        });
      }
      if (disc > qty * price) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'itemDiscountInvalid',
          path: ['items', i, 'discountAmount'],
        });
      }
    });

    const subtotal = data.items.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unitPrice) || 0;
      const disc = parseFloat(item.discountAmount) || 0;
      return sum + Math.max(0, qty * price - disc);
    }, 0);

    const saleDiscount = parseFloat(data.discountAmount) || 0;
    if (saleDiscount > subtotal) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'saleDiscountInvalid',
        path: ['discountAmount'],
      });
    }
  });

export type SalesFormValues = z.infer<typeof saleSchema>;

interface SalesFormProps {
  mode: 'create' | 'edit';
  defaultValues?: Partial<SalesFormValues>;
  onSubmitDraft?: (data: CreateSaleRequest | UpdateSaleRequest) => Promise<void>;
  onSubmitComplete: (data: CreateSaleRequest | UpdateSaleRequest) => Promise<void>;
  isLoading?: boolean;
}

export function SalesForm({
  mode,
  defaultValues,
  onSubmitDraft,
  onSubmitComplete,
  isLoading,
}: SalesFormProps) {
  const { t } = useTranslation();
  const { data: customersData } = useGetCustomersQuery({ isActive: true, limit: 200 });
  const customers = customersData?.data ?? [];

  const form = useForm<SalesFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      customerId: defaultValues?.customerId ?? '',
      soldAt: defaultValues?.soldAt ?? new Date().toISOString().slice(0, 10),
      discountAmount: defaultValues?.discountAmount ?? '0',
      notes: defaultValues?.notes ?? '',
      items: defaultValues?.items ?? [
        {
          productId: '',
          description: '',
          quantity: '1',
          unitPrice: '0',
          discountAmount: '0',
        },
      ],
    },
  });

  const buildPayload = (data: SalesFormValues): CreateSaleRequest | UpdateSaleRequest => ({
    customerId: data.customerId || undefined,
    discountAmount: parseFloat(data.discountAmount) || 0,
    notes: data.notes || undefined,
    soldAt: data.soldAt || undefined,
    items: data.items.map((item) => ({
      productId: item.productId,
      description: item.description || undefined,
      quantity: parseFloat(item.quantity) || 1,
      unitPrice: parseFloat(item.unitPrice) || 0,
      discountAmount: parseFloat(item.discountAmount) || 0,
    })),
  });

  const handleDraft = form.handleSubmit(async (data) => {
    if (onSubmitDraft) await onSubmitDraft({ ...buildPayload(data), status: 'DRAFT' } as CreateSaleRequest);
  });

  const handleComplete = form.handleSubmit(async (data) => {
    await onSubmitComplete({ ...buildPayload(data), status: 'COMPLETED' } as CreateSaleRequest);
  });

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form className="space-y-5">
          {/* Customer + Date */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('sales.customer')}</FormLabel>
                  <FormControl>
                    <Select value={field.value || '__walkin'} onValueChange={(v) => field.onChange(v === '__walkin' ? '' : v)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('sales.walkIn')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__walkin">{t('sales.walkIn')}</SelectItem>
                        {customers.map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="soldAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('sales.soldAt')}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Discount */}
          <FormField
            control={form.control}
            name="discountAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sales.discountAmount')}</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sales.notes')}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t('sales.notesPlaceholder')}
                    className="min-h-[70px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">{t('sales.items')}</CardTitle>
            </CardHeader>
            <CardContent>
              <SalesItemSection />
              {form.formState.errors.items?.root && (
                <p className="text-sm text-destructive mt-2">{t('sales.itemsRequired')}</p>
              )}
            </CardContent>
          </Card>

          {/* Summary */}
          <SalesSummary />

          {/* Action buttons — sticky on mobile */}
          <div className="sticky bottom-16 md:static z-10 bg-background/95 backdrop-blur-sm md:bg-transparent pt-4 pb-2 md:py-0 border-t md:border-t-0">
            <div className="flex gap-3">
              {mode === 'create' && onSubmitDraft && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="flex-1 md:flex-none"
                  onClick={handleDraft}
                  disabled={isLoading}
                >
                  {t('sales.saveAsDraft')}
                </Button>
              )}
              <Button
                type="button"
                size="lg"
                className="flex-1 md:flex-none"
                onClick={handleComplete}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === 'create' ? t('sales.completeSale') : t('common.save')}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}
