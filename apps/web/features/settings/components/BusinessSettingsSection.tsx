'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod/v4';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetSettingsGroupQuery, useUpdateSettingsGroupMutation } from '../api';

const schema = z.object({
  name: z.string().min(1),
  nameKh: z.string(),
  phone: z.string(),
  address: z.string(),
  addressKh: z.string(),
  logoUrl: z.string(),
});
type FormValues = z.infer<typeof schema>;

export function BusinessSettingsSection() {
  const { t } = useTranslation();
  const { data, isLoading } = useGetSettingsGroupQuery('business');
  const [updateGroup, { isLoading: isSaving }] = useUpdateSettingsGroupMutation();
  const map = data?.data;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', nameKh: '', phone: '', address: '', addressKh: '', logoUrl: '' },
  });

  useEffect(() => {
    if (map) {
      form.reset({
        name: map['business.name'] ?? '',
        nameKh: map['business.nameKh'] ?? '',
        phone: map['business.phone'] ?? '',
        address: map['business.address'] ?? '',
        addressKh: map['business.addressKh'] ?? '',
        logoUrl: map['business.logoUrl'] ?? '',
      });
    }
  }, [map, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      await updateGroup({
        group: 'business',
        settings: {
          'business.name': values.name,
          'business.nameKh': values.nameKh,
          'business.phone': values.phone,
          'business.address': values.address,
          'business.addressKh': values.addressKh,
          'business.logoUrl': values.logoUrl,
        },
      }).unwrap();
      toast.success(t('settings.saveSuccess'));
    } catch {
      toast.error(t('common.error'));
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>{t('settings.businessInfo')}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.businessInfo')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('settings.businessName')} <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder={t('settings.businessNamePlaceholder')} {...field} />
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
                    <FormLabel>{t('settings.businessNameKh')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('settings.businessNameKhPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.businessPhone')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('settings.businessPhonePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('settings.businessAddress')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('settings.businessAddressPlaceholder')}
                        className="min-h-[72px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="addressKh"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('settings.businessAddressKh')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('settings.businessAddressKhPlaceholder')}
                        className="min-h-[72px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.logoUrl')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('settings.logoUrlPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                  {field.value && (
                    <img
                      src={field.value}
                      alt="logo preview"
                      className="mt-2 h-16 w-auto rounded border object-contain"
                      onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                    />
                  )}
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('common.save')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
