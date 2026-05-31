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

import type { ReferenceBook } from '../types';

interface ReferenceBookMobileCardProps {
  record: ReferenceBook;
  onToggleStatus: (record: ReferenceBook) => void;
  onDelete: (record: ReferenceBook) => void;
}

export function ReferenceBookMobileCard({
  record,
  onToggleStatus,
  onDelete,
}: ReferenceBookMobileCardProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div
      className="flex items-start gap-3 rounded-xl border bg-card p-4 cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => router.push(`/admin/reference-book/${record.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ')
          router.push(`/admin/reference-book/${record.id}`);
      }}
    >
      <div className="min-w-0 flex-1">
        <p className="font-medium text-sm">{record.title}</p>
        {record.machineModel && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {record.machineModel.modelName}
            {record.machineModel.brand ? ` · ${record.machineModel.brand}` : ''}
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {record.category && (
            <Badge
              variant="outline"
              className="bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400 text-xs"
            >
              {record.category}
            </Badge>
          )}
          <Badge
            variant={record.status === 'ACTIVE' ? 'default' : 'outline'}
            className={
              record.status === 'ACTIVE'
                ? 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400'
                : 'text-muted-foreground'
            }
          >
            {t(record.status === 'ACTIVE' ? 'common.active' : 'common.inactive')}
          </Badge>
        </div>
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/reference-book/${record.id}`}>
                {t('referenceBook.recordDetail')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/reference-book/${record.id}/edit`}>
                {t('common.edit')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onToggleStatus(record)}
              className={
                record.status === 'ACTIVE'
                  ? 'text-destructive focus:text-destructive'
                  : 'text-green-600 focus:text-green-600'
              }
            >
              {record.status === 'ACTIVE'
                ? t('referenceBook.confirmDisableTitle')
                : t('referenceBook.confirmEnableTitle')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(record)}
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
