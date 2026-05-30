'use client';

import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { SalesHistoryTab } from './SalesHistoryTab';

export function SalesHistoryPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="hidden md:flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t('sales.salesHistory')}</h2>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/carts">
            <ShoppingCart className="h-4 w-4 mr-1.5" />
            {t('sales.switchToPos')}
          </Link>
        </Button>
      </div>
      <SalesHistoryTab />
    </div>
  );
}
