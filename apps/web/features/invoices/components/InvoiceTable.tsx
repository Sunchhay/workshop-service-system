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

import type { Invoice, InvoiceStatus } from '../types';

const statusClass: Record<InvoiceStatus, string> = {
  DRAFT: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
  ISSUED: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
  PARTIAL: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
  PAID: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
  CANCELLED: 'bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400',
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

interface InvoiceTableProps {
  invoices: Invoice[];
  onCancel: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
}

export function InvoiceTable({ invoices, onCancel, onDelete }: InvoiceTableProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('invoices.invoiceNumber')}</TableHead>
            <TableHead>{t('invoices.customer')}</TableHead>
            <TableHead>{t('invoices.status')}</TableHead>
            <TableHead>{t('invoices.totalAmount')}</TableHead>
            <TableHead>{t('invoices.dueAmount')}</TableHead>
            <TableHead>{t('invoices.issuedAt')}</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                {t('invoices.noInvoices')}
              </TableCell>
            </TableRow>
          ) : (
            invoices.map((inv) => (
              <TableRow
                key={inv.id}
                className="cursor-pointer"
                onClick={() => router.push(`/admin/invoices/${inv.id}`)}
              >
                <TableCell>
                  <div>
                    <p className="font-mono font-medium text-sm">{inv.invoiceNumber}</p>
                    {inv.serviceJob && (
                      <p className="text-xs text-muted-foreground">
                        {inv.serviceJob.jobCode}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm font-medium">{inv.customer.name}</p>
                    {inv.customer.phone && (
                      <p className="text-xs text-muted-foreground">{inv.customer.phone}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusClass[inv.status]}>
                    {t(`invoiceStatuses.${inv.status}`)}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  ${parseFloat(inv.totalAmount).toFixed(2)}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  <span className={parseFloat(inv.dueAmount) > 0 ? 'text-amber-600 dark:text-amber-400' : ''}>
                    ${parseFloat(inv.dueAmount).toFixed(2)}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(inv.issuedAt)}
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
                        <Link href={`/admin/invoices/${inv.id}`}>{t('invoices.invoiceDetail')}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/invoices/${inv.id}/edit`}>{t('common.edit')}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {inv.status !== 'CANCELLED' && (
                        <DropdownMenuItem
                          onClick={() => onCancel(inv)}
                          className="text-destructive focus:text-destructive"
                        >
                          {t('invoices.confirmCancelTitle')}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => onDelete(inv)}
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
