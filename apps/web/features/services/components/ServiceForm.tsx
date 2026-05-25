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

import type {
  CreateServiceRequest,
  PriceType,
  UpdateServiceRequest,
} from '../types';

const PRICE_TYPES: PriceType[] = ['FIXED', 'CATALOG_BASED', 'CUSTOM'];

const serviceSchema = z
  .object({
    nameEn: z.string().min(1),
    nameKh: z.string(),
    category: z.string(),
    relatedComponent: z.string(),
    priceType: z.enum(['FIXED', 'CATALOG_BASED', 'CUSTOM']),
    defaultPrice: z.string(),
    description: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.priceType === 'FIXED') {
      if (!data.defaultPrice.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Default price is required for fixed price services',
          path: ['defaultPrice'],
        });
      } else {
        const num = parseFloat(data.defaultPrice);
        if (isNaN(num) || num < 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Must be a valid non-negative number',
            path: ['defaultPrice'],
          });
        }
      }
    }
  });

type FormValues = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  mode: 'create' | 'edit';
  defaultValues?: Partial<FormValues>;
  onSubmit: (data: CreateServiceRequest | UpdateServiceRequest) => Promise<void>;
  isLoading?: boolean;
}

export function ServiceForm({
  mode,
  defaultValues,
  onSubmit,
  isLoading,
}: ServiceFormProps) {
  const { t } = useTranslation();

  const form = useForm<FormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      nameEn: defaultValues?.nameEn ?? '',
      nameKh: defaultValues?.nameKh ?? '',
      category: defaultValues?.category ?? '',
      relatedComponent: defaultValues?.relatedComponent ?? '',
      priceType: defaultValues?.priceType ?? 'FIXED',
      defaultPrice: defaultValues?.defaultPrice ?? '',
      description: defaultValues?.description ?? '',
    },
  });

  const priceType = form.watch('priceType');

  const handleSubmit = async (data: FormValues) => {
    const payload: CreateServiceRequest | UpdateServiceRequest = {
      nameEn: data.nameEn,
      nameKh: data.nameKh || undefined,
      category: data.category || undefined,
      relatedComponent: data.relatedComponent || undefined,
      priceType: data.priceType,
      defaultPrice: data.defaultPrice ? parseFloat(data.defaultPrice) : undefined,
      description: data.description || undefined,
    };
    await onSubmit(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        {/* Row 1: English name + Khmer name */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="nameEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('services.nameEn')}{' '}
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('services.nameEnPlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nameKh"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('services.nameKh')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('services.nameKhPlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 2: Category + Related component */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('services.category')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('services.categoryPlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="relatedComponent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('services.relatedComponent')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('services.relatedComponentPlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 3: Price type + Default price (conditionally shown) */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="priceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('services.priceType')}{' '}
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRICE_TYPES.map((pt) => (
                        <SelectItem key={pt} value={pt}>
                          {t(`priceTypes.${pt}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {priceType === 'FIXED' && (
            <FormField
              control={form.control}
              name="defaultPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('services.defaultPrice')}{' '}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder={t('services.defaultPricePlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('services.description')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('services.descriptionPlaceholder')}
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

        {/* Save button — sticky on mobile, normal on desktop */}
        <div className="sticky bottom-16 md:static z-10 bg-background/95 backdrop-blur-sm md:bg-transparent pt-4 pb-2 md:py-0 border-t md:border-t-0">
          <Button
            type="submit"
            size="lg"
            className="w-full md:w-auto"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'create' ? t('services.createService') : t('common.save')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
