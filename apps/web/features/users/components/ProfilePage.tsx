'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod/v4';

import { Badge } from '@/components/ui/badge';
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
import { Separator } from '@/components/ui/separator';
import { useUpdateProfileMutation } from '@/features/auth/api';
import { setAuthenticatedUser } from '@/features/auth/authSlice';
import type { TranslationKey } from '@/lib/i18n/TranslationContext';
import { useTranslation } from '@/lib/i18n/TranslationContext';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';

const roleClass: Record<string, string> = {
  ADMIN: '',
  STAFF: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
  TECHNICIAN:
    'bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400',
  CASHIER:
    'bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400',
};

const profileSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});
type ProfileForm = z.infer<typeof profileSchema>;

const MAX_AVATAR_BYTES = 500 * 1024;

export function ProfilePage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.avatarUrl ?? null,
  );
  const [avatarData, setAvatarData] = useState<string | null | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name, email: user.email },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_AVATAR_BYTES) {
      toast.error(t('users.avatarSizeError'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setAvatarPreview(result);
      setAvatarData(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setAvatarData(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = async (data: ProfileForm) => {
    try {
      const payload: { name: string; email: string; avatarUrl?: string | null } = {
        name: data.name,
        email: data.email,
      };
      if (avatarData !== undefined) payload.avatarUrl = avatarData;

      const result = await updateProfile(payload).unwrap();
      dispatch(setAuthenticatedUser(result.data));
      toast.success(t('auth.profileUpdated'));
    } catch {
      toast.error(t('common.error'));
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="hidden md:block text-xl font-semibold">
        {t('users.myProfile')}
      </h2>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt={user.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                  {initials}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <CardTitle className="truncate">{user.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5 truncate">
                {user.email}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge
                  variant={user.role === 'ADMIN' ? 'default' : 'outline'}
                  className={roleClass[user.role] ?? ''}
                >
                  {t(`roles.${user.role}` as TranslationKey)}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <Separator />

          {/* Avatar upload controls */}
          <div className="space-y-1.5">
            <p className="text-sm font-medium">{t('users.avatar')}</p>
            <div className="flex gap-2 flex-wrap">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                {avatarPreview ? t('common.edit') : t('users.avatar')}
              </Button>
              {avatarPreview && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={handleRemoveAvatar}
                >
                  {t('common.delete')}
                </Button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <p className="text-xs text-muted-foreground">{t('users.avatarHint')}</p>
          </div>

          <Separator />

          {/* Edit form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

              <div className="flex flex-wrap gap-3 pt-1">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full md:w-auto"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('common.save')}
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full md:w-auto">
                  <Link href="/admin/profile/change-password">
                    <KeyRound className="h-4 w-4 mr-2" />
                    {t('auth.changePassword')}
                  </Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
