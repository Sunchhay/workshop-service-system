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

import { getServiceDisplayName } from '@/lib/display-name';

import type { Service } from '../types';

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
      {/* Thumbnail */}
      {service.imageUrl && (
        <img
          src={service.imageUrl}
          alt={getServiceDisplayName(service)}
          className="h-12 w-12 rounded-lg object-cover shrink-0"
          loading="lazy"
        />
      )}

      {/* Main info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2 flex-wrap">
          <span className="font-medium text-sm">{getServiceDisplayName(service)}</span>
          <Badge variant="outline" className="font-mono text-xs px-1.5">
            {service.code}
          </Badge>
        </div>
        {service.nameKh && (
          <p className="text-xs text-muted-foreground mt-0.5">{service.nameEn}</p>
        )}
        {(service.category || service.relatedComponent) && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {[service.category, service.relatedComponent]
              .filter(Boolean)
              .join(' · ')}
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-1.5">
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
