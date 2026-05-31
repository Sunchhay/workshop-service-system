'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';

import { Button } from '@/components/ui/button';
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
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { CreateExpenseRequest, PaymentMethod, UpdateExpenseRequest } from '../types';

const PAYMENT_METHODS: PaymentMethod[] = ['CASH', 'ACLEDA', 'ABA', 'BAKONG', 'OTHER'];

const expenseSchema = z.object({
  title: z.string().min(1),
  amount: z.string().refine((v) => parseFloat(v) > 0, 'amountInvalid'),
  expenseDate: z.string().min(1),
  category: z.string().optional(),
  paymentMethod: z.enum(['CASH', 'ACLEDA', 'ABA', 'BAKONG', 'OTHER']).optional(),
  expenseStatus: z.enum(['PAID', 'UNPAID', 'VOIDED']).optional(),
  supplierId: z.string().optional(),
  mechanicId: z.string().optional(),
  referenceNo: z.string().optional(),
  imageUrl: z.string().optional(),
  note: z.string().optional(),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;

interface Props {
  mode: 'create' | 'edit';
  defaultValues?: Partial<ExpenseFormValues>;
  onSubmit: (data: CreateExpenseRequest | UpdateExpenseRequest) => Promise<void>;
  isLoading?: boolean;
}

export function ExpenseForm({ mode, defaultValues, onSubmit, isLoading }: Props) {
  const { t } = useTranslation();

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      amount: defaultValues?.amount ?? '',
      expenseDate: defaultValues?.expenseDate ?? new Date().toISOString().slice(0, 10),
      category: defaultValues?.category ?? '',
      paymentMethod: defaultValues?.paymentMethod ?? 'CASH',
      expenseStatus: defaultValues?.expenseStatus ?? 'PAID',
      supplierId: defaultValues?.supplierId ?? '',
      mechanicId: defaultValues?.mechanicId ?? '',
      referenceNo: defaultValues?.referenceNo ?? '',
      imageUrl: defaultValues?.imageUrl ?? '',
      note: defaultValues?.note ?? '',
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit({
      title: values.title,
      amount: parseFloat(values.amount),
      expenseDate: values.expenseDate,
      category: values.category || undefined,
      paymentMethod: values.paymentMethod || undefined,
      expenseStatus: values.expenseStatus || undefined,
      supplierId: values.supplierId || undefined,
      mechanicId: values.mechanicId || undefined,
      referenceNo: values.referenceNo || undefined,
      imageUrl: values.imageUrl || undefined,
      note: values.note || undefined,
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title — full width */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('expenses.title')} <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder={t('expenses.titlePlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Amount + Date */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('expenses.amount')} <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expenseDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('expenses.expenseDate')} <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Category + Payment Method */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('expenses.category')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('expenses.categoryPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('expenses.paymentMethod')}</FormLabel>
                <FormControl>
                  <Select value={field.value ?? ''} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('expenses.allPaymentMethods')} />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHODS.map((m) => (
                        <SelectItem key={m} value={m}>{t(`paymentMethods.${m}`)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Status + Reference No */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="expenseStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('expenses.expenseStatus')}</FormLabel>
                <FormControl>
                  <Select value={field.value ?? 'PAID'} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PAID">{t('expenses.statusPaid')}</SelectItem>
                      <SelectItem value="UNPAID">{t('expenses.statusUnpaid')}</SelectItem>
                    </SelectContent>
                  </Select>
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
                <FormLabel>{t('expenses.referenceNo')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('expenses.referenceNoPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Image URL */}
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('expenses.imageUrl')}</FormLabel>
              <FormControl>
                <Input placeholder={t('expenses.imageUrlPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Note */}
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('expenses.note')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('expenses.notePlaceholder')}
                  className="min-h-[70px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="sticky bottom-16 md:static z-10 bg-background/95 backdrop-blur-sm md:bg-transparent pt-4 pb-2 md:py-0 border-t md:border-t-0">
          <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'create' ? t('expenses.createExpense') : t('common.save')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
