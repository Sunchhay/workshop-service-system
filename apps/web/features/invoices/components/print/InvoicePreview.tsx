'use client';

import { ArrowLeft, Printer } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetInvoiceQuery } from '../../api';
import { InvoicePrint } from './InvoicePrint';

export function InvoicePreview({ id }: { id: string }) {
  const { t } = useTranslation();
  const { data, isLoading } = useGetInvoiceQuery(id);
  const invoice = data?.data;

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white">
      {/* Toolbar — hidden during print */}
      <div className="print:hidden sticky top-0 z-10 bg-white border-b px-4 py-2 flex items-center gap-3 shadow-sm">
        <Button variant="ghost" size="icon-sm" asChild>
          <Link href={`/admin/invoices/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <span className="flex-1 text-sm font-medium truncate">
          {invoice ? invoice.invoiceNumber : t('invoices.invoicePreviewTitle')}
        </span>
        <Button
          size="sm"
          onClick={() => window.print()}
          disabled={isLoading || !invoice}
        >
          <Printer className="h-3.5 w-3.5 mr-1.5" />
          {t('invoices.printInvoice')}
        </Button>
      </div>

      {/* Paper container */}
      <div className="print:p-0 py-6 px-4 flex justify-center">
        <div
          className="bg-white w-full max-w-[794px] print:max-w-none print:shadow-none shadow-md"
          style={{ padding: '24px' }}
        >
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : invoice ? (
            <InvoicePrint invoice={invoice} />
          ) : (
            <p className="text-center text-muted-foreground py-12">{t('common.error')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
