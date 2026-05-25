'use client';

import { useTranslation } from '@/lib/i18n/TranslationContext';

import { AppearanceSettingsSection } from './AppearanceSettingsSection';
import { BusinessSettingsSection } from './BusinessSettingsSection';
import { InvoiceSettingsSection } from './InvoiceSettingsSection';
import { LocalizationSettingsSection } from './LocalizationSettingsSection';
import { SystemSettingsSection } from './SystemSettingsSection';

export function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h2 className="hidden md:block text-xl font-semibold">{t('settings.title')}</h2>
      <BusinessSettingsSection />
      <InvoiceSettingsSection />
      <SystemSettingsSection />
      <LocalizationSettingsSection />
      <AppearanceSettingsSection />
    </div>
  );
}
