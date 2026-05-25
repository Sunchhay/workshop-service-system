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

import type { Customer, CustomerType } from '../types';

const typeClass: Record<CustomerType, string> = {
  NORMAL: 'text-muted-foreground',
  VIP: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
  WHOLESALE:
    'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
  PARTNER:
    'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
};

interface CustomerTableProps {
  customers: Customer[];
  onToggleStatus: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function CustomerTable({
  customers,
  onToggleStatus,
  onDelete,
}: CustomerTableProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('customers.name')}</TableHead>
            <TableHead>{t('customers.phone')}</TableHead>
            <TableHead>{t('customers.customerType')}</TableHead>
            <TableHead>{t('customers.statusLabel')}</TableHead>
            <TableHead>{t('customers.createdAt')}</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground py-10"
              >
                {t('customers.noCustomers')}
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => (
              <TableRow
                key={customer.id}
                className="cursor-pointer"
                onClick={() => router.push(`/admin/customers/${customer.id}`)}
              >
                <TableCell>
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {customer.code}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p>{customer.phone}</p>
                    {customer.email && (
                      <p className="text-xs text-muted-foreground">
                        {customer.email}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={typeClass[customer.customerType]}
                  >
                    {t(`customerTypes.${customer.customerType}`)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={customer.isActive ? 'default' : 'outline'}
                    className={
                      customer.isActive
                        ? 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400'
                        : 'text-muted-foreground'
                    }
                  >
                    {t(customer.isActive ? 'common.active' : 'common.inactive')}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(customer.createdAt)}
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
                        <Link href={`/admin/customers/${customer.id}`}>
                          {t('customers.customerDetail')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/customers/${customer.id}/edit`}>
                          {t('common.edit')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onToggleStatus(customer)}
                        className={
                          customer.isActive
                            ? 'text-destructive focus:text-destructive'
                            : 'text-green-600 focus:text-green-600'
                        }
                      >
                        {customer.isActive
                          ? t('customers.confirmDisableTitle')
                          : t('customers.confirmEnableTitle')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(customer)}
                        className="text-destructive focus:text-destructive"
                      >
                        {t('common.delete')}
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
