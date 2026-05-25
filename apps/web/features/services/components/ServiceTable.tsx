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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { PriceType, Service } from '../types';

const priceTypeClass: Record<PriceType, string> = {
  FIXED: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
  CATALOG_BASED:
    'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
  CUSTOM:
    'bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400',
};

interface ServiceTableProps {
  services: Service[];
  onToggleStatus: (service: Service) => void;
  onDelete: (service: Service) => void;
}

function formatPrice(price: string | null): string {
  if (!price) return '—';
  const num = parseFloat(price);
  return isNaN(num) ? '—' : num.toFixed(2);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function ServiceTable({
  services,
  onToggleStatus,
  onDelete,
}: ServiceTableProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('services.nameEn')}</TableHead>
            <TableHead>{t('services.category')}</TableHead>
            <TableHead>{t('services.priceType')}</TableHead>
            <TableHead>{t('services.defaultPrice')}</TableHead>
            <TableHead>{t('services.statusLabel')}</TableHead>
            <TableHead>{t('services.createdAt')}</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground py-10"
              >
                {t('services.noServices')}
              </TableCell>
            </TableRow>
          ) : (
            services.map((service) => (
              <TableRow
                key={service.id}
                className="cursor-pointer"
                onClick={() => router.push(`/admin/services/${service.id}`)}
              >
                {/* Name column */}
                <TableCell>
                  <div>
                    <p className="font-medium">{service.nameEn}</p>
                    {service.nameKh && (
                      <p className="text-xs text-muted-foreground">
                        {service.nameKh}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                      {service.code}
                    </p>
                  </div>
                </TableCell>
                {/* Category */}
                <TableCell>
                  <div>
                    {service.category ? (
                      <p className="text-sm">{service.category}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">—</p>
                    )}
                    {service.relatedComponent && (
                      <p className="text-xs text-muted-foreground">
                        {service.relatedComponent}
                      </p>
                    )}
                  </div>
                </TableCell>
                {/* Price type */}
                <TableCell>
                  <Badge
                    variant="outline"
                    className={priceTypeClass[service.priceType]}
                  >
                    {t(`priceTypes.${service.priceType}`)}
                  </Badge>
                </TableCell>
                {/* Default price */}
                <TableCell className="text-sm font-mono">
                  {service.priceType === 'FIXED'
                    ? formatPrice(service.defaultPrice)
                    : '—'}
                </TableCell>
                {/* Status */}
                <TableCell>
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
                </TableCell>
                {/* Created at */}
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(service.createdAt)}
                </TableCell>
                {/* Actions */}
                <TableCell onClick={(e) => e.stopPropagation()}>
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
