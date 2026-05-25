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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetSettingsGroupQuery, useUpdateSettingsGroupMutation } from '../api';

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'km', label: 'ខ្មែរ (Khmer)' },
];

const schema = z.object({
  defaultLanguage: z.string().min(1),
});
type FormValues = z.infer<typeof schema>;

export function LocalizationSettingsSection() {
  const { t } = useTranslation();
  const { data, isLoading } = useGetSettingsGroupQuery('localization');
  const [updateGroup, { isLoading: isSaving }] = useUpdateSettingsGroupMutation();
  const map = data?.data;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { defaultLanguage: 'en' },
  });

  useEffect(() => {
    if (map) {
      form.reset({
        defaultLanguage: map['localization.defaultLanguage'] ?? 'en',
      });
    }
  }, [map, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      const supportedLangs = LANGUAGES.map((l) => l.value).join(',');
      await updateGroup({
        group: 'localization',
        settings: {
          'localization.defaultLanguage': values.defaultLanguage,
          'localization.supportedLanguages': supportedLangs,
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
        <CardHeader><CardTitle>{t('settings.localizationSettings')}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.localizationSettings')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="defaultLanguage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('settings.defaultLanguage')} <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((l) => (
                          <SelectItem key={l.value} value={l.value}>
                            {l.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-lg border p-3">
              <p className="text-sm font-medium mb-2">{t('settings.supportedLanguages')}</p>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((l) => (
                  <span
                    key={l.value}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary"
                  >
                    {l.label}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">{t('settings.supportedLanguagesNote')}</p>
            </div>

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
