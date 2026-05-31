'use client';

import { Wrench } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetTopServicesQuery } from '../api';

function fmt(v: string | number) {
  const n = parseFloat(String(v));
  return isNaN(n) ? '0.00' : n.toFixed(2);
}

export function TopServices() {
  const { t } = useTranslation();
  const { data, isLoading } = useGetTopServicesQuery();
  const services = data?.data ?? [];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">{t('dashboard.topServices')}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 gap-2 text-muted-foreground">
            <Wrench className="h-8 w-8 opacity-30" />
            <p className="text-sm">{t('dashboard.noData')}</p>
          </div>
        ) : (
          <div className="space-y-1">
            {services.map((svc, idx) => (
              <div key={svc.serviceId} className="flex items-center gap-3 p-2.5 rounded-lg">
                <span className="text-xs font-mono text-muted-foreground w-4 shrink-0 text-right">{idx + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{svc.name}</p>
                  <p className="text-xs text-muted-foreground">{t('dashboard.qty')}: {svc.quantity}</p>
                </div>
                <p className="font-mono text-sm font-semibold shrink-0">${fmt(svc.total)}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
