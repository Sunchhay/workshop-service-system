'use client';

import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { User, UserRole } from '../types';

const roleClass: Record<UserRole, string> = {
  ADMIN: '',
  STAFF:
    'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
  TECHNICIAN:
    'bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400',
  CASHIER:
    'bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400',
};

interface UserMobileCardProps {
  user: User;
  onToggleStatus: (user: User) => void;
}

export function UserMobileCard({ user, onToggleStatus }: UserMobileCardProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className="flex items-start gap-3 rounded-xl border bg-card p-4  cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => router.push(`/admin/users/${user.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ')
          router.push(`/admin/users/${user.id}`);
      }}
    >
      {/* Avatar */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
        {initials}
      </div>

      {/* Main info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm truncate">{user.name}</span>
          <Badge
            variant={user.role === 'ADMIN' ? 'default' : 'outline'}
            className={roleClass[user.role]}
          >
            {t(`roles.${user.role}`)}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          {user.email}
        </p>
        <div className="mt-2">
          <Badge
            variant={user.isActive ? 'default' : 'outline'}
            className={
              !user.isActive
                ? 'text-muted-foreground'
                : 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400'
            }
          >
            {t(user.isActive ? 'common.active' : 'common.inactive')}
          </Badge>
        </div>
      </div>

      {/* Actions */}
      <div onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/users/${user.id}`}>
                {t('users.userDetail')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/users/${user.id}/edit`}>
                {t('common.edit')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onToggleStatus(user)}
              className={
                user.isActive
                  ? 'text-destructive focus:text-destructive'
                  : 'text-green-600 focus:text-green-600'
              }
            >
              {user.isActive
                ? t('users.confirmDisableTitle')
                : t('users.confirmEnableTitle')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
