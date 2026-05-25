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

import type { CreateInvoiceRequest, UpdateInvoiceRequest } from '../types';
import { InvoiceItemSection } from './InvoiceItemSection';
import { InvoiceSummary } from './InvoiceSummary';

const invoiceItemSchema = z.object({
  type: z.enum(['SERVICE', 'PRODUCT', 'CUSTOM']),
  serviceId: z.string(),
  productId: z.string(),
  description: z.string().min(1),
  quantity: z.string(),
  unitPrice: z.string(),
  discountAmount: z.string(),
});

const invoiceSchema = z
  .object({
    customerId: z.string().min(1),
    serviceJobId: z.string(),
    dueDate: z.string(),
    notes: z.string(),
    discountAmount: z.string(),
    taxAmount: z.string(),
    items: z.array(invoiceItemSchema).min(1),
  })
  .superRefine((data, ctx) => {
    data.items.forEach((item, i) => {
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

    const invoiceDiscount = parseFloat(data.discountAmount) || 0;
    if (invoiceDiscount > subtotal) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'invoiceDiscountInvalid',
        path: ['discountAmount'],
      });
    }
  });

export type InvoiceFormValues = z.infer<typeof invoiceSchema>;

interface InvoiceFormProps {
  mode: 'create' | 'edit';
  defaultValues?: Partial<InvoiceFormValues>;
  onSubmit: (data: CreateInvoiceRequest | UpdateInvoiceRequest) => Promise<void>;
  isLoading?: boolean;
}

export function InvoiceForm({
  mode,
  defaultValues,
  onSubmit,
  isLoading,
}: InvoiceFormProps) {
  const { t } = useTranslation();
  const { data: customersData } = useGetCustomersQuery({ isActive: true, limit: 50 });
  const customers = customersData?.data ?? [];

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      customerId: defaultValues?.customerId ?? '',
      serviceJobId: defaultValues?.serviceJobId ?? '',
      dueDate: defaultValues?.dueDate ?? '',
      notes: defaultValues?.notes ?? '',
      discountAmount: defaultValues?.discountAmount ?? '0',
      taxAmount: defaultValues?.taxAmount ?? '0',
      items: defaultValues?.items ?? [
        {
          type: 'SERVICE',
          serviceId: '',
          productId: '',
          description: '',
          quantity: '1',
          unitPrice: '0',
          discountAmount: '0',
        },
      ],
    },
  });

  const handleSubmit = async (data: InvoiceFormValues) => {
    const payload: CreateInvoiceRequest | UpdateInvoiceRequest = {
      customerId: data.customerId,
      serviceJobId: data.serviceJobId || undefined,
      discountAmount: parseFloat(data.discountAmount) || 0,
      taxAmount: parseFloat(data.taxAmount) || 0,
      notes: data.notes || undefined,
      dueDate: data.dueDate || undefined,
      items: data.items.map((item) => ({
        type: item.type as 'SERVICE' | 'PRODUCT' | 'CUSTOM',
        serviceId: item.serviceId || undefined,
        productId: item.productId || undefined,
        description: item.description,
        quantity: parseFloat(item.quantity) || 1,
        unitPrice: parseFloat(item.unitPrice) || 0,
        discountAmount: parseFloat(item.discountAmount) || 0,
      })),
    };
    await onSubmit(payload);
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          {/* Customer + Service Job */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('invoices.customer')}{' '}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('serviceJobs.selectCustomer')} />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
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
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('invoices.dueDate')}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Discount + Tax */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="discountAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('invoices.discountAmount')}</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="taxAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('invoices.taxAmount')}</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('invoices.notes')}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t('invoices.notesPlaceholder')}
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
              <CardTitle className="text-sm font-medium">{t('invoices.items')}</CardTitle>
            </CardHeader>
            <CardContent>
              <InvoiceItemSection />
              {form.formState.errors.items?.root && (
                <p className="text-sm text-destructive mt-2">
                  {t('invoices.itemsRequired')}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Live summary */}
          <InvoiceSummary />

          {/* Save button — sticky on mobile */}
          <div className="sticky bottom-16 md:static z-10 bg-background/95 backdrop-blur-sm md:bg-transparent pt-4 pb-2 md:py-0 border-t md:border-t-0">
            <Button
              type="submit"
              size="lg"
              className="w-full md:w-auto"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'create' ? t('invoices.createInvoice') : t('common.save')}
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}
