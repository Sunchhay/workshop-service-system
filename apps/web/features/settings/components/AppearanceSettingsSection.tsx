'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Monitor, Moon, Sun } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod/v4';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetSettingsGroupQuery, useUpdateSettingsGroupMutation } from '../api';

const THEMES = [
  { value: 'light', label: 'settings.themeLight', icon: Sun },
  { value: 'dark', label: 'settings.themeDark', icon: Moon },
  { value: 'system', label: 'settings.themeSystem', icon: Monitor },
] as const;

const schema = z.object({
  defaultTheme: z.enum(['light', 'dark', 'system']),
});
type FormValues = z.infer<typeof schema>;

export function AppearanceSettingsSection() {
  const { t } = useTranslation();
  const { data, isLoading } = useGetSettingsGroupQuery('appearance');
  const [updateGroup, { isLoading: isSaving }] = useUpdateSettingsGroupMutation();
  const map = data?.data;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { defaultTheme: 'system' },
  });

  useEffect(() => {
    const raw = map?.['appearance.defaultTheme'];
    if (raw === 'light' || raw === 'dark' || raw === 'system') {
      form.reset({ defaultTheme: raw });
    }
  }, [map, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      await updateGroup({
        group: 'appearance',
        settings: { 'appearance.defaultTheme': values.defaultTheme },
      }).unwrap();
      toast.success(t('settings.saveSuccess'));
    } catch {
      toast.error(t('common.error'));
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>{t('settings.appearanceSettings')}</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-24 rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.appearanceSettings')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="defaultTheme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.defaultTheme')}</FormLabel>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {THEMES.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => field.onChange(value)}
                        className={cn(
                          'flex flex-col items-center gap-2 rounded-xl border-2 px-5 py-3 text-sm transition-colors',
                          field.value === value
                            ? 'border-primary bg-primary/5 text-primary font-medium'
                            : 'border-border text-muted-foreground hover:bg-muted/50',
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {t(label)}
                      </button>
                    ))}
                  </div>
                  <FormMessage />
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
