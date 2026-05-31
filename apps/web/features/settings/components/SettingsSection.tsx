'use client';

import { Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/lib/i18n/TranslationContext';
import type { TranslationKey } from '@/lib/i18n/TranslationContext';

import { useUpdateSettingMutation } from '../api';
import type { Setting } from '../types';

export interface SettingField {
  key: string;
  group: string;
  type: string;
  labelKey: TranslationKey;
  description?: string;
  defaultValue?: string;
  optional?: boolean;
  isPublic?: boolean;
}

interface SettingsSectionProps {
  titleKey: TranslationKey;
  fields: SettingField[];
  settings: Setting[];
  isLoading?: boolean;
}

function normalizeValue(setting: Setting | undefined, field: SettingField) {
  return setting?.value ?? field.defaultValue ?? '';
}

function isEnabled(value: string | null | undefined) {
  return value === 'true' || value === '1';
}

export function SettingsSection({
  titleKey,
  fields,
  settings,
  isLoading,
}: SettingsSectionProps) {
  const { t } = useTranslation();
  const [updateSetting, { isLoading: isSaving }] = useUpdateSettingMutation();

  const settingsByKey = useMemo(() => {
    return new Map(settings.map((setting) => [setting.key, setting]));
  }, [settings]);

  const visibleFields = useMemo(() => {
    return fields.filter((field) => !field.optional || settingsByKey.has(field.key));
  }, [fields, settingsByKey]);

  const initialValues = useMemo(() => {
    const nextValues: Record<string, string> = {};
    visibleFields.forEach((field) => {
      nextValues[field.key] = normalizeValue(settingsByKey.get(field.key), field);
    });
    return nextValues;
  }, [settingsByKey, visibleFields]);

  const [draftValues, setDraftValues] = useState<Record<string, string>>({});
  const values = { ...initialValues, ...draftValues };

  const handleSave = async () => {
    try {
      await Promise.all(
        visibleFields.map((field) => {
          const setting = settingsByKey.get(field.key);
          return updateSetting({
            key: field.key,
            data: {
              value: values[field.key] ?? '',
              type: setting?.type ?? field.type,
              group: setting?.group ?? field.group,
              description: setting?.description ?? field.description ?? null,
              isPublic: setting?.isPublic ?? field.isPublic ?? false,
            },
          }).unwrap();
        }),
      );
      toast.success(t('settings.saveSuccess'));
    } catch {
      toast.error(t('common.error'));
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t(titleKey)}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t(titleKey)}</CardTitle>
      </CardHeader>
      <CardContent>
        {visibleFields.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('settings.noSettings')}</p>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {visibleFields.map((field) => {
                const setting = settingsByKey.get(field.key);
                const type = setting?.type ?? field.type;
                const value = values[field.key] ?? '';
                const label = t(field.labelKey);

                if (type === 'boolean') {
                  return (
                    <div
                      key={field.key}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">{label}</Label>
                        {setting?.description && (
                          <p className="text-xs text-muted-foreground">{setting.description}</p>
                        )}
                      </div>
                      <Switch
                        checked={isEnabled(value)}
                        onCheckedChange={(checked) =>
                          setDraftValues((current) => ({ ...current, [field.key]: String(checked) }))
                        }
                      />
                    </div>
                  );
                }

                if (type === 'json') {
                  return (
                    <div key={field.key} className="space-y-1.5 sm:col-span-2">
                      <Label>{label}</Label>
                      <Textarea
                        value={value}
                        onChange={(e) =>
                          setDraftValues((current) => ({ ...current, [field.key]: e.target.value }))
                        }
                        className="min-h-[96px] resize-none font-mono text-xs"
                      />
                    </div>
                  );
                }

                return (
                  <div key={field.key} className="space-y-1.5">
                    <Label>{label}</Label>
                    <Input
                      type={type === 'number' ? 'number' : 'text'}
                      value={value}
                      onChange={(e) =>
                        setDraftValues((current) => ({ ...current, [field.key]: e.target.value }))
                      }
                    />
                  </div>
                );
              })}
            </div>

            <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('settings.save')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
