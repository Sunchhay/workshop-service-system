'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod/v4';

import { AppPasswordInput } from '@/components/app/AppPasswordInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useChangePasswordMutation } from '@/features/auth/api';
import { useTranslation } from '@/lib/i18n/TranslationContext';

const baseSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(1),
});

type ChangePasswordForm = z.infer<typeof baseSchema>;

export function ChangePasswordPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const changePasswordSchema = baseSchema.refine(
    (d) => d.newPassword === d.confirmPassword,
    { message: t('auth.passwordMismatch'), path: ['confirmPassword'] },
  );

  const form = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ChangePasswordForm) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();
      toast.success(t('auth.changePasswordSuccess'));
      router.replace('/admin/profile');
    } catch {
      form.setError('currentPassword', { message: t('common.error') });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="hidden md:block text-xl font-semibold">
        {t('auth.changePassword')}
      </h2>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 max-w-sm">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.currentPassword')}</FormLabel>
                    <FormControl>
                      <AppPasswordInput
                        autoComplete="current-password"
                        placeholder={t('auth.currentPasswordPlaceholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.newPassword')}</FormLabel>
                    <FormControl>
                      <AppPasswordInput
                        autoComplete="new-password"
                        placeholder={t('auth.newPasswordPlaceholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.confirmPassword')}</FormLabel>
                    <FormControl>
                      <AppPasswordInput
                        autoComplete="new-password"
                        placeholder={t('auth.confirmPasswordPlaceholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-1">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full md:w-auto"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('auth.changePassword')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full md:w-auto"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  {t('common.cancel')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
