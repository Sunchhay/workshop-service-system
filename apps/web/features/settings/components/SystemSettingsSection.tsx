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

const TIMEZONES = [
  'Asia/Phnom_Penh',
  'Asia/Bangkok',
  'Asia/Ho_Chi_Minh',
  'Asia/Singapore',
  'Asia/Kuala_Lumpur',
  'UTC',
];

const CURRENCIES = ['USD', 'KHR', 'THB', 'VND', 'SGD'];

const schema = z.object({
  defaultCurrency: z.string().min(1),
  secondaryCurrency: z.string(),
  timezone: z.string().min(1),
});
type FormValues = z.infer<typeof schema>;

export function SystemSettingsSection() {
  const { t } = useTranslation();
  const { data, isLoading } = useGetSettingsGroupQuery('system');
  const [updateGroup, { isLoading: isSaving }] = useUpdateSettingsGroupMutation();
  const map = data?.data;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { defaultCurrency: 'USD', secondaryCurrency: 'KHR', timezone: 'Asia/Phnom_Penh' },
  });

  useEffect(() => {
    if (map) {
      form.reset({
        defaultCurrency: map['system.defaultCurrency'] ?? 'USD',
        secondaryCurrency: map['system.secondaryCurrency'] || 'none',
        timezone: map['system.timezone'] ?? 'Asia/Phnom_Penh',
      });
    }
  }, [map, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      await updateGroup({
        group: 'system',
        settings: {
          'system.defaultCurrency': values.defaultCurrency,
          'system.secondaryCurrency': values.secondaryCurrency === 'none' ? '' : values.secondaryCurrency,
          'system.timezone': values.timezone,
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
        <CardHeader><CardTitle>{t('settings.systemSettings')}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
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
        <CardTitle>{t('settings.systemSettings')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="defaultCurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('settings.defaultCurrency')} <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CURRENCIES.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
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
                name="secondaryCurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('settings.secondaryCurrency')}</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">{t('settings.none')}</SelectItem>
                          {CURRENCIES.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('settings.timezone')} <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIMEZONES.map((tz) => (
                          <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
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
