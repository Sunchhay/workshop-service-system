'use client';

import { KeyRound, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { logout } from '@/features/auth/authSlice';
import { useTranslation } from '@/lib/i18n/TranslationContext';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';

function getInitials(name?: string): string {
  if (!name) return 'U';

  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function formatRole(role?: string): string {
  if (!role) return '';

  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

export function UserMenu() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);

  if (!user) return null;

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 gap-2 px-2"
          aria-label="Open user menu"
        >
          <Avatar className="h-7 w-7">
            {user.avatarUrl && (
              <img
                src={user.avatarUrl}
                alt={user.name || 'User'}
                className="h-full w-full rounded-full object-cover"
              />
            )}

            <AvatarFallback className="bg-primary/10 text-xs text-primary">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>

          <span className="hidden max-w-32 truncate text-sm font-medium lg:block">
            {user.name}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="z-[100] w-56"
      >
        <DropdownMenuLabel className="py-2 font-normal">
          <div className="flex flex-col gap-0.5">
            <span className="truncate text-sm font-medium">
              {user.name}
            </span>

            <span className="truncate text-xs text-muted-foreground">
              {user.email}
            </span>

            {user.role && (
              <span className="text-xs text-muted-foreground">
                {formatRole(user.role)}
              </span>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/admin/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            {t('users.myProfile')}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/admin/profile/change-password" className="cursor-pointer">
            <KeyRound className="mr-2 h-4 w-4" />
            {t('auth.changePassword')}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t('auth.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}