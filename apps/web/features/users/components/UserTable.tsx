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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

interface UserTableProps {
  users: User[];
  onToggleStatus: (user: User) => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function UserTable({ users, onToggleStatus }: UserTableProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('users.name')}</TableHead>
            <TableHead>{t('users.role')}</TableHead>
            <TableHead>{t('users.statusLabel')}</TableHead>
            <TableHead>{t('users.createdAt')}</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground py-10"
              >
                {t('users.noUsers')}
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow
                key={user.id}
                className="cursor-pointer"
                onClick={() => router.push(`/admin/users/${user.id}`)}
              >
                <TableCell>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.role === 'ADMIN' ? 'default' : 'outline'}
                    className={roleClass[user.role]}
                  >
                    {t(`roles.${user.role}`)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.isActive ? 'default' : 'outline'}
                    className={
                      user.isActive
                        ? 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400'
                        : 'text-muted-foreground'
                    }
                  >
                    {t(user.isActive ? 'common.active' : 'common.inactive')}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
