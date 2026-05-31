'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { CreateUserRequest, UpdateUserRequest, UserRole, UserStatus } from '../types';

const ROLES: UserRole[] = ['ADMIN', 'STAFF', 'VIEWER'];
const STATUSES: UserStatus[] = ['ACTIVE', 'INACTIVE'];

const createSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  imageUrl: z.string().optional(),
  role: z.enum(['ADMIN', 'STAFF', 'VIEWER']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

const editSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  imageUrl: z.string().optional(),
  role: z.enum(['ADMIN', 'STAFF', 'VIEWER']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

type CreateFormValues = z.infer<typeof createSchema>;
type EditFormValues = z.infer<typeof editSchema>;
type FormValues = CreateFormValues & { password?: string };

interface UserFormProps {
  mode: 'create' | 'edit';
  defaultValues?: Partial<FormValues>;
  onSubmit: (data: CreateUserRequest | UpdateUserRequest) => Promise<void>;
  isLoading?: boolean;
}

export function UserForm({ mode, defaultValues, onSubmit, isLoading }: UserFormProps) {
  const { t } = useTranslation();

  const form = useForm<FormValues>({
    resolver: zodResolver(mode === 'create' ? createSchema : editSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      email: defaultValues?.email ?? '',
      password: '',
      imageUrl: defaultValues?.imageUrl ?? '',
      role: defaultValues?.role ?? 'STAFF',
      status: defaultValues?.status ?? 'ACTIVE',
    },
  });

  const handleSubmit = async (data: FormValues) => {
    if (mode === 'create') {
      await onSubmit({
        name: data.name,
        email: data.email,
        password: data.password!,
        imageUrl: data.imageUrl || undefined,
        role: data.role,
        status: data.status,
      } as CreateUserRequest);
    } else {
      await onSubmit({
        name: data.name,
        email: data.email,
        imageUrl: data.imageUrl || null,
        role: data.role,
        status: data.status,
      } as UpdateUserRequest);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('users.name')}</FormLabel>
              <FormControl>
                <Input placeholder={t('users.namePlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('users.email')}</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="off" placeholder={t('users.emailPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {mode === 'create' && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('users.password')}</FormLabel>
                <FormControl>
                  <AppPasswordInput
                    autoComplete="new-password"
                    placeholder={t('users.passwordPlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('users.imageUrl')}</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('users.role')}</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {t(`roles.${role}`)}
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
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('users.statusLabel')}</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {t(s === 'ACTIVE' ? 'common.active' : 'common.inactive')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
        )}

        <div className="pt-2">
          <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'create' ? t('users.createUser') : t('common.save')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
