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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { CreateServiceRequest, UpdateServiceRequest } from '../types';

const serviceSchema = z.object({
  code: z.string(),
  nameEn: z.string().min(1),
  nameKh: z.string(),
  imageUrl: z.string(),
  category: z.string(),
  relatedComponent: z.string(),
  description: z.string(),
  isActive: z.boolean(),
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
      code: defaultValues?.code ?? '',
      nameKh: defaultValues?.nameKh ?? '',
      imageUrl: defaultValues?.imageUrl ?? '',
      category: defaultValues?.category ?? '',
      relatedComponent: defaultValues?.relatedComponent ?? '',
      description: defaultValues?.description ?? '',
      isActive: defaultValues?.isActive ?? true,
    },
  });

  const handleSubmit = async (data: FormValues) => {
    const payload: CreateServiceRequest | UpdateServiceRequest = {
      code: data.code || undefined,
      nameEn: data.nameEn,
      nameKh: data.nameKh || undefined,
      imageUrl: data.imageUrl || undefined,
      category: data.category || undefined,
      relatedComponent: data.relatedComponent || undefined,
      description: data.description || undefined,
      isActive: data.isActive,
    };
    await onSubmit(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('services.code')}</FormLabel>
              <FormControl>
                <Input placeholder="SRV-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        {/* Image URL */}
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('services.imageUrl')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('services.imageUrlPlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <FormLabel>{t('services.statusLabel')}</FormLabel>
                <p className="text-sm text-muted-foreground">
                  {field.value ? t('common.active') : t('common.inactive')}
                </p>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
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
