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

import { getServiceDisplayName } from '@/lib/display-name';

import type { Service } from '../types';

interface ServiceTableProps {
  services: Service[];
  onToggleStatus: (service: Service) => void;
  onDelete: (service: Service) => void;
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
            <TableHead>{t('services.imageUrl')}</TableHead>
            <TableHead>{t('services.code')}</TableHead>
            <TableHead>{t('services.nameKh')}</TableHead>
            <TableHead>{t('services.nameEn')}</TableHead>
            <TableHead>{t('services.category')}</TableHead>
            <TableHead>{t('services.relatedComponent')}</TableHead>
            <TableHead>{t('services.statusLabel')}</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
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
                <TableCell>
                  {service.imageUrl ? (
                    <img
                      src={service.imageUrl}
                      alt={getServiceDisplayName(service)}
                      className="h-10 w-10 rounded object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-muted-foreground/40 text-sm">
                      ⚙
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-mono text-sm">{service.code}</TableCell>
                <TableCell className="font-medium">
                  {service.nameKh || '—'}
                </TableCell>
                <TableCell>{service.nameEn}</TableCell>
                <TableCell>
                  {service.category || '—'}
                </TableCell>
                <TableCell>
                  {service.relatedComponent || '—'}
                </TableCell>
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
