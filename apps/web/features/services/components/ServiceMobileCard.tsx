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

import type { PriceType, Service } from '../types';

const priceTypeClass: Record<PriceType, string> = {
  FIXED: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
  CATALOG_BASED:
    'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
  CUSTOM:
    'bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400',
};

function formatPrice(price: string | null): string {
  if (!price) return '—';
  const num = parseFloat(price);
  return isNaN(num) ? '—' : num.toFixed(2);
}

interface ServiceMobileCardProps {
  service: Service;
  onToggleStatus: (service: Service) => void;
  onDelete: (service: Service) => void;
}

export function ServiceMobileCard({
  service,
  onToggleStatus,
  onDelete,
}: ServiceMobileCardProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div
      className="flex items-start gap-3 rounded-xl border bg-card p-4  cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => router.push(`/admin/services/${service.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ')
          router.push(`/admin/services/${service.id}`);
      }}
    >
      {/* Main info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2 flex-wrap">
          <span className="font-medium text-sm">{service.nameEn}</span>
          <Badge variant="outline" className="font-mono text-xs px-1.5">
            {service.code}
          </Badge>
        </div>
        {service.nameKh && (
          <p className="text-xs text-muted-foreground mt-0.5">{service.nameKh}</p>
        )}
        {(service.category || service.relatedComponent) && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {[service.category, service.relatedComponent]
              .filter(Boolean)
              .join(' · ')}
          </p>
        )}
        {service.priceType === 'FIXED' && service.defaultPrice && (
          <p className="text-xs font-mono text-foreground mt-0.5">
            {formatPrice(service.defaultPrice)}
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Badge
            variant="outline"
            className={priceTypeClass[service.priceType]}
          >
            {t(`priceTypes.${service.priceType}`)}
          </Badge>
          <Badge
            variant={service.isActive ? 'default' : 'outline'}
            className={
              service.isActive
                ? 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400'
                : 'text-muted-foreground'
            }
          >
            {t(service.isActive ? 'common.active' : 'common.inactive')}
          </Badge>
        </div>
      </div>

      {/* Actions */}
      <div onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/services/${service.id}`}>
                {t('services.serviceDetail')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/services/${service.id}/edit`}>
                {t('common.edit')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onToggleStatus(service)}
              className={
                service.isActive
                  ? 'text-destructive focus:text-destructive'
                  : 'text-green-600 focus:text-green-600'
              }
            >
              {service.isActive
                ? t('services.confirmDisableTitle')
                : t('services.confirmEnableTitle')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(service)}
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
