'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';

import { AppPasswordInput } from '@/components/app/AppPasswordInput';
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
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useTranslation } from '@/lib/i18n/TranslationContext';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';

import { useLoginMutation } from '../api';
import { setCredentials } from '../authSlice';
import Image from 'next/image';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
  const { isAuthenticated, isHydrated } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace('/admin');
    }
  }, [isHydrated, isAuthenticated, router]);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: process.env.NODE_ENV == "development" ? 'admin@workshop.local' : '',
      password: process.env.NODE_ENV == "development" ? 'Admin@123' : '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const result = await login(data).unwrap();
      dispatch(setCredentials(result.data));
      router.replace('/admin');
    } catch {
      form.setError('root', { message: t('auth.loginError') });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-3">
          <div className="relative mx-auto h-40 w-40">
            <Image
              src="/icons/vertical-black.png"
              alt="Workshop System"
              fill
              sizes="224px"
              className="object-contain dark:hidden"
              priority
            />

            <Image
              src="/icons/vertical-white.png"
              alt="Workshop System"
              fill
              sizes="224px"
              className="hidden object-contain dark:block"
              priority
            />
          </div>

        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.email')}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder={t('auth.emailPlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.password')}</FormLabel>
                  <FormControl>
                    <AppPasswordInput
                      autoComplete="current-password"
                      placeholder={t('auth.passwordPlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <p className="text-sm text-destructive text-center">
                {form.formState.errors.root.message}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full mt-4" disabled={isLoading}>
              {isLoading ? t('common.loading') : t('auth.loginButton')}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
