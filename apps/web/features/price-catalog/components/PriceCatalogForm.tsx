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
import { useGetServicesQuery } from '@/features/services/api';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type {
  CreatePriceCatalogRequest,
  CustomerType,
  DifficultyLevel,
  UpdatePriceCatalogRequest,
} from '../types';

const DIFFICULTY_LEVELS: DifficultyLevel[] = ['NORMAL', 'DIFFICULT', 'SPECIAL'];
const CUSTOMER_TYPES: CustomerType[] = ['NORMAL', 'VIP', 'WHOLESALE', 'PARTNER'];

const schema = z
  .object({
    serviceId: z.string().min(1),
    label: z.string().min(1),
    sizeFrom: z.string(),
    sizeTo: z.string(),
    unit: z.string(),
    difficultyLevel: z.enum(['NORMAL', 'DIFFICULT', 'SPECIAL']),
    customerType: z.string(), // '__all' sentinel or CustomerType
    unitPrice: z.string().min(1),
    currency: z.string().min(1),
    notes: z.string(),
    effectiveDate: z.string(),
    expiredDate: z.string(),
  })
  .superRefine((data, ctx) => {
    // Validate unitPrice is a valid non-negative number
    if (data.unitPrice.trim()) {
      const num = parseFloat(data.unitPrice);
      if (isNaN(num) || num < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '__unitPriceInvalid__',
          path: ['unitPrice'],
        });
      }
    }
    // Validate size range
    if (data.sizeFrom.trim() && data.sizeTo.trim()) {
      const from = parseFloat(data.sizeFrom);
      const to = parseFloat(data.sizeTo);
      if (!isNaN(from) && !isNaN(to) && to < from) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '__sizeMustBeLess__',
          path: ['sizeTo'],
        });
      }
    }
    // Validate date range
    if (data.effectiveDate && data.expiredDate) {
      if (data.expiredDate <= data.effectiveDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '__expiredAfterEffective__',
          path: ['expiredDate'],
        });
      }
    }
  });

type FormValues = z.infer<typeof schema>;

interface PriceCatalogFormProps {
  mode: 'create' | 'edit';
  defaultValues?: Partial<FormValues>;
  onSubmit: (data: CreatePriceCatalogRequest | UpdatePriceCatalogRequest) => Promise<void>;
  isLoading?: boolean;
}

export function PriceCatalogForm({
  mode,
  defaultValues,
  onSubmit,
  isLoading,
}: PriceCatalogFormProps) {
  const { t } = useTranslation();

  const { data: servicesData } = useGetServicesQuery({ isActive: true, limit: 100 });
  const services = servicesData?.data ?? [];

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceId: defaultValues?.serviceId ?? '',
      label: defaultValues?.label ?? '',
      sizeFrom: defaultValues?.sizeFrom ?? '',
      sizeTo: defaultValues?.sizeTo ?? '',
      unit: defaultValues?.unit ?? '',
      difficultyLevel: defaultValues?.difficultyLevel ?? 'NORMAL',
      customerType: defaultValues?.customerType ?? '__all',
      unitPrice: defaultValues?.unitPrice ?? '',
      currency: defaultValues?.currency ?? 'USD',
      notes: defaultValues?.notes ?? '',
      effectiveDate: defaultValues?.effectiveDate ?? '',
      expiredDate: defaultValues?.expiredDate ?? '',
    },
  });

  const handleSubmit = async (data: FormValues) => {
    const payload: CreatePriceCatalogRequest | UpdatePriceCatalogRequest = {
      serviceId: data.serviceId,
      label: data.label,
      sizeFrom: data.sizeFrom.trim() ? parseFloat(data.sizeFrom) : undefined,
      sizeTo: data.sizeTo.trim() ? parseFloat(data.sizeTo) : undefined,
      unit: data.unit.trim() || undefined,
      difficultyLevel: data.difficultyLevel,
      customerType: data.customerType === '__all' ? null : (data.customerType as CustomerType),
      unitPrice: parseFloat(data.unitPrice),
      currency: data.currency,
      notes: data.notes.trim() || undefined,
      effectiveDate: data.effectiveDate || undefined,
      expiredDate: data.expiredDate || undefined,
    };
    await onSubmit(payload);
  };

  const translateError = (message: string | undefined) => {
    if (!message) return message;
    if (message === '__unitPriceInvalid__') return t('priceCatalog.unitPriceInvalid');
    if (message === '__sizeMustBeLess__') return t('priceCatalog.sizeMustBeLess');
    if (message === '__expiredAfterEffective__') return t('priceCatalog.expiredAfterEffective');
    return message;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        {/* Service select */}
        <FormField
          control={form.control}
          name="serviceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('priceCatalog.service')} <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('priceCatalog.selectService')} />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.nameEn} ({s.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Label */}
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('priceCatalog.label')} <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder={t('priceCatalog.labelPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Size range */}
        <div className="grid grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="sizeFrom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('priceCatalog.sizeFrom')}</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sizeTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('priceCatalog.sizeTo')}</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" {...field} />
                </FormControl>
                <FormMessage>
                  {translateError(form.formState.errors.sizeTo?.message)}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>

        {/* Unit + Currency */}
        <div className="grid grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('priceCatalog.unit')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('priceCatalog.unitPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('priceCatalog.currency')} <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Difficulty + Customer type */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="difficultyLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('priceCatalog.difficultyLevel')}</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DIFFICULTY_LEVELS.map((d) => (
                        <SelectItem key={d} value={d}>
                          {t(`difficultyLevels.${d}`)}
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
            name="customerType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('priceCatalog.customerType')}</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all">
                        {t('priceCatalog.allCustomerTypes')}
                      </SelectItem>
                      {CUSTOMER_TYPES.map((ct) => (
                        <SelectItem key={ct} value={ct}>
                          {t(`customerTypes.${ct}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Unit price */}
        <FormField
          control={form.control}
          name="unitPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('priceCatalog.unitPrice')} <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder={t('priceCatalog.unitPricePlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage>
                {translateError(form.formState.errors.unitPrice?.message)}
              </FormMessage>
            </FormItem>
          )}
        />

        {/* Effective date + Expiry date */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="effectiveDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('priceCatalog.effectiveDate')}</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expiredDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('priceCatalog.expiredDate')}</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage>
                  {translateError(form.formState.errors.expiredDate?.message)}
                </FormMessage>
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
              <FormLabel>{t('priceCatalog.notes')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('priceCatalog.notesPlaceholder')}
                  className="min-h-[80px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <p className="text-sm text-destructive">
            {form.formState.errors.root.message}
          </p>
        )}

        {/* Sticky save button on mobile */}
        <div className="sticky bottom-16 md:static z-10 bg-background/95 backdrop-blur-sm md:bg-transparent pt-4 pb-2 md:py-0 border-t md:border-t-0">
          <Button
            type="submit"
            size="lg"
            className="w-full md:w-auto"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'create' ? t('priceCatalog.createEntry') : t('common.save')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
