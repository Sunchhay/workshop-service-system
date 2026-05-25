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

import type { Invoice, InvoiceStatus } from '../types';

const statusClass: Record<InvoiceStatus, string> = {
  DRAFT: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
  ISSUED: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
  PARTIAL: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
  PAID: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
  CANCELLED: 'bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400',
};

interface InvoiceMobileCardProps {
  invoice: Invoice;
  onCancel: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
}

export function InvoiceMobileCard({ invoice, onCancel, onDelete }: InvoiceMobileCardProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div
      className="flex items-start gap-3 rounded-xl border bg-card p-4 shadow-sm cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => router.push(`/admin/invoices/${invoice.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') router.push(`/admin/invoices/${invoice.id}`);
      }}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2 flex-wrap">
          <span className="font-mono font-medium text-sm">{invoice.invoiceNumber}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">{invoice.customer.name}</p>
        {invoice.serviceJob && (
          <p className="text-xs text-muted-foreground">{invoice.serviceJob.jobCode}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <span className="font-mono text-sm font-medium">
            ${parseFloat(invoice.totalAmount).toFixed(2)}
          </span>
          {parseFloat(invoice.dueAmount) > 0 && (
            <span className="text-xs text-amber-600 dark:text-amber-400 font-mono">
              due ${parseFloat(invoice.dueAmount).toFixed(2)}
            </span>
          )}
        </div>
        <div className="mt-2">
          <Badge variant="outline" className={statusClass[invoice.status]}>
            {t(`invoiceStatuses.${invoice.status}`)}
          </Badge>
        </div>
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/invoices/${invoice.id}`}>{t('invoices.invoiceDetail')}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/invoices/${invoice.id}/edit`}>{t('common.edit')}</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {invoice.status !== 'CANCELLED' && (
              <DropdownMenuItem
                onClick={() => onCancel(invoice)}
                className="text-destructive focus:text-destructive"
              >
                {t('invoices.confirmCancelTitle')}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => onDelete(invoice)}
              className="text-destructive focus:text-destructive"
            >
              {t('common.delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
