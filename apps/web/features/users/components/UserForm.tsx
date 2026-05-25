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
  FormDescription,
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

import type { CreateUserRequest, UpdateUserRequest, UserRole } from '../types';

const ROLES: UserRole[] = ['ADMIN', 'STAFF', 'TECHNICIAN', 'CASHIER'];

function getSchema(mode: 'create' | 'edit') {
  return z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password:
      mode === 'create'
        ? z.string().min(8)
        : z.union([z.string().min(8), z.literal('')]),
    role: z.enum(['ADMIN', 'STAFF', 'TECHNICIAN', 'CASHIER']),
  });
}

type FormValues = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

interface UserFormProps {
  mode: 'create' | 'edit';
  defaultValues?: Partial<FormValues>;
  onSubmit: (data: CreateUserRequest | UpdateUserRequest) => Promise<void>;
  isLoading?: boolean;
}

export function UserForm({
  mode,
  defaultValues,
  onSubmit,
  isLoading,
}: UserFormProps) {
  const { t } = useTranslation();
  const schema = getSchema(mode);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      email: defaultValues?.email ?? '',
      password: '',
      role: defaultValues?.role ?? 'STAFF',
    },
  });

  const handleSubmit = async (data: FormValues) => {
    if (mode === 'create') {
      await onSubmit({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      } as CreateUserRequest);
    } else {
      const payload: UpdateUserRequest = {
        name: data.name,
        email: data.email,
        role: data.role,
      };
      if (data.password) payload.password = data.password;
      await onSubmit(payload);
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
                <Input
                  type="email"
                  autoComplete="off"
                  placeholder={t('users.emailPlaceholder')}
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
              <FormLabel>{t('users.password')}</FormLabel>
              <FormControl>
                <AppPasswordInput
                  autoComplete="new-password"
                  placeholder={t('users.passwordPlaceholder')}
                  {...field}
                />
              </FormControl>
              {mode === 'edit' && (
                <FormDescription>{t('users.passwordHint')}</FormDescription>
              )}
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

        {form.formState.errors.root && (
          <p className="text-sm text-destructive">
            {form.formState.errors.root.message}
          </p>
        )}

        <div className="pt-2">
          <Button
            type="submit"
            size="lg"
            className="w-full md:w-auto"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'create' ? t('users.createUser') : t('common.save')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
