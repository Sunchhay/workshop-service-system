'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetSettingsQuery } from '../api';
import type { Setting } from '../types';
import { SettingsSection, type SettingField } from './SettingsSection';

const BUSINESS_FIELDS: SettingField[] = [
  { key: 'business_name', group: 'business', type: 'text', labelKey: 'settings.businessName', isPublic: true },
  { key: 'business_phone', group: 'business', type: 'text', labelKey: 'settings.businessPhone', isPublic: true },
  { key: 'business_address', group: 'business', type: 'text', labelKey: 'settings.businessAddress', isPublic: true },
  { key: 'business_logo', group: 'business', type: 'text', labelKey: 'settings.businessLogo', optional: true, isPublic: true },
];

const INVOICE_FIELDS: SettingField[] = [
  { key: 'invoice_prefix', group: 'invoice', type: 'text', labelKey: 'settings.invoicePrefix', defaultValue: 'INV' },
  { key: 'invoice_footer', group: 'invoice', type: 'text', labelKey: 'settings.invoiceFooter' },
];

const PAYMENT_FIELDS: SettingField[] = [
  { key: 'enable_cash_payment', group: 'payment', type: 'boolean', labelKey: 'settings.enableCashPayment', optional: true },
  { key: 'enable_acleda_payment', group: 'payment', type: 'boolean', labelKey: 'settings.enableAcledaPayment', optional: true },
  { key: 'enable_aba_payment', group: 'payment', type: 'boolean', labelKey: 'settings.enableAbaPayment', optional: true },
  { key: 'enable_bakong_payment', group: 'payment', type: 'boolean', labelKey: 'settings.enableBakongPayment', optional: true },
];

const CART_FIELDS: SettingField[] = [
  { key: 'customer_required_checkout', group: 'cart', type: 'boolean', labelKey: 'settings.customerRequiredCheckout', defaultValue: 'true' },
  { key: 'allow_edit_service_price', group: 'cart', type: 'boolean', labelKey: 'settings.allowEditServicePrice', defaultValue: 'false' },
  { key: 'allow_edit_product_price', group: 'cart', type: 'boolean', labelKey: 'settings.allowEditProductPrice', defaultValue: 'false' },
];

const SYSTEM_FIELDS: SettingField[] = [
  { key: 'default_currency', group: 'system', type: 'text', labelKey: 'settings.defaultCurrency', defaultValue: 'USD', isPublic: true },
  { key: 'timezone', group: 'system', type: 'text', labelKey: 'settings.timezone', optional: true },
  { key: 'language', group: 'system', type: 'text', labelKey: 'settings.language', optional: true },
];

const GENERAL_FIELDS: SettingField[] = [
  { key: 'appearance_theme', group: 'appearance', type: 'text', labelKey: 'settings.defaultTheme', optional: true },
];

function settingsForGroups(settings: Setting[], groups: string[]) {
  return settings.filter((setting) => groups.includes(setting.group));
}

export function SettingsPage() {
  const { t } = useTranslation();
  const { data, isLoading } = useGetSettingsQuery();
  const settings = data?.data ?? [];

  return (
    <div className="space-y-6">
      <h2 className="hidden md:block text-xl font-semibold">{t('settings.title')}</h2>

      <Tabs defaultValue="business" className="space-y-4">
        <TabsList className="flex h-auto flex-wrap justify-start">
          <TabsTrigger value="business">{t('settings.businessProfile')}</TabsTrigger>
          <TabsTrigger value="invoice">{t('settings.invoiceSettings')}</TabsTrigger>
          <TabsTrigger value="payment">{t('settings.paymentSettings')}</TabsTrigger>
          <TabsTrigger value="cart">{t('settings.cartSettings')}</TabsTrigger>
          <TabsTrigger value="system">{t('settings.systemSettings')}</TabsTrigger>
          <TabsTrigger value="general">{t('settings.generalSettings')}</TabsTrigger>
        </TabsList>

        <TabsContent value="business">
          <SettingsSection
            titleKey="settings.businessProfile"
            fields={BUSINESS_FIELDS}
            settings={settingsForGroups(settings, ['business'])}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="invoice">
          <SettingsSection
            titleKey="settings.invoiceSettings"
            fields={INVOICE_FIELDS}
            settings={settingsForGroups(settings, ['invoice'])}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="payment">
          <SettingsSection
            titleKey="settings.paymentSettings"
            fields={PAYMENT_FIELDS}
            settings={settingsForGroups(settings, ['payment'])}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="cart">
          <SettingsSection
            titleKey="settings.cartSettings"
            fields={CART_FIELDS}
            settings={settingsForGroups(settings, ['cart'])}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="system">
          <SettingsSection
            titleKey="settings.systemSettings"
            fields={SYSTEM_FIELDS}
            settings={settingsForGroups(settings, ['system'])}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="general">
          <SettingsSection
            titleKey="settings.generalSettings"
            fields={GENERAL_FIELDS}
            settings={settingsForGroups(settings, ['appearance'])}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
