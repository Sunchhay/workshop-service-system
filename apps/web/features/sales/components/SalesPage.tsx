'use client';

import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { SalesDraftsTab } from './SalesDraftsTab';
import { SalesHistoryTab } from './SalesHistoryTab';
import { SalesNewSaleTab } from './SalesNewSaleTab';

export function SalesPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('new-sale');

  return (
    <div className="space-y-4">
      {/* Page title — desktop only */}
      <div className="hidden md:flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t('sales.title')}</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full md:w-auto overflow-x-auto">
          <TabsTrigger value="new-sale" className="flex-1 md:flex-none">
            {t('sales.tabNewSale')}
          </TabsTrigger>
          <TabsTrigger value="drafts" className="flex-1 md:flex-none">
            {t('sales.tabDrafts')}
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1 md:flex-none">
            {t('sales.tabHistory')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new-sale" className="mt-4">
          <SalesNewSaleTab onDraftSaved={() => setActiveTab('drafts')} />
        </TabsContent>

        <TabsContent value="drafts" className="mt-4">
          <SalesDraftsTab />
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <SalesHistoryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
