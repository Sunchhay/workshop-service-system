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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetSettingsGroupQuery, useUpdateSettingsGroupMutation } from '../api';

const schema = z.object({
  prefix: z.string().min(1),
  footerNote: z.string(),
  footerNoteKh: z.string(),
  showLogo: z.boolean(),
  showSignature: z.boolean(),
});
type FormValues = z.infer<typeof schema>;

export function InvoiceSettingsSection() {
  const { t } = useTranslation();
  const { data, isLoading } = useGetSettingsGroupQuery('invoice');
  const [updateGroup, { isLoading: isSaving }] = useUpdateSettingsGroupMutation();
  const map = data?.data;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { prefix: 'INV', footerNote: '', footerNoteKh: '', showLogo: true, showSignature: true },
  });

  useEffect(() => {
    if (map) {
      form.reset({
        prefix: map['invoice.prefix'] ?? 'INV',
        footerNote: map['invoice.footerNote'] ?? '',
        footerNoteKh: map['invoice.footerNoteKh'] ?? '',
        showLogo: map['invoice.showLogo'] !== 'false',
        showSignature: map['invoice.showSignature'] !== 'false',
      });
    }
  }, [map, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      await updateGroup({
        group: 'invoice',
        settings: {
          'invoice.prefix': values.prefix,
          'invoice.footerNote': values.footerNote,
          'invoice.footerNoteKh': values.footerNoteKh,
          'invoice.showLogo': String(values.showLogo),
          'invoice.showSignature': String(values.showSignature),
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
        <CardHeader><CardTitle>{t('settings.invoiceSettings')}</CardTitle></CardHeader>
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
        <CardTitle>{t('settings.invoiceSettings')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="prefix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('settings.invoicePrefix')} <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="INV" className="max-w-[160px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="footerNote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('settings.footerNote')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('settings.footerNotePlaceholder')}
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
                name="footerNoteKh"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('settings.footerNoteKh')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('settings.footerNoteKhPlaceholder')}
                        className="min-h-[80px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-3">
              <FormField
                control={form.control}
                name="showLogo"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <FormLabel className="text-sm font-medium">
                        {t('settings.showLogo')}
                      </FormLabel>
                      <FormDescription className="text-xs">
                        {t('settings.showLogoDesc')}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="showSignature"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <FormLabel className="text-sm font-medium">
                        {t('settings.showSignature')}
                      </FormLabel>
                      <FormDescription className="text-xs">
                        {t('settings.showSignatureDesc')}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
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
