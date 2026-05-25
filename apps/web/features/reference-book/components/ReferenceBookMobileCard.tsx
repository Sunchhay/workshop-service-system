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

import type { ReferenceBook, ReferenceSourceType, VerificationStatus } from '../types';

const sourceTypeClass: Record<ReferenceSourceType, string> = {
  MOM_NOTEBOOK: 'bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400',
  SUPPLIER_INFO: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
  REAL_MEASUREMENT: 'bg-teal-500/10 text-teal-700 border-teal-500/20 dark:text-teal-400',
  SERVICE_HISTORY: 'bg-orange-500/10 text-orange-700 border-orange-500/20 dark:text-orange-400',
  SERVICE_MANUAL: 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20 dark:text-indigo-400',
  OTHER: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
};

const verificationClass: Record<VerificationStatus, string> = {
  DRAFT: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
  PENDING_REVIEW: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
  VERIFIED: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
  OLD_DATA: 'bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400',
};

interface ReferenceBookMobileCardProps {
  record: ReferenceBook;
  onToggleStatus: (record: ReferenceBook) => void;
  onDelete: (record: ReferenceBook) => void;
  onUpdateVerification: (record: ReferenceBook) => void;
}

export function ReferenceBookMobileCard({
  record,
  onToggleStatus,
  onDelete,
  onUpdateVerification,
}: ReferenceBookMobileCardProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div
      className="flex items-start gap-3 rounded-xl border bg-card p-4 shadow-sm cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => router.push(`/admin/reference-book/${record.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ')
          router.push(`/admin/reference-book/${record.id}`);
      }}
    >
      <div className="min-w-0 flex-1">
        <p className="font-medium text-sm">{record.partName}</p>
        {record.partCode && (
          <p className="text-xs text-muted-foreground font-mono">{record.partCode}</p>
        )}
        {record.machineModel && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {record.machineModel.brand} {record.machineModel.model}
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {record.componentType && (
            <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400 text-xs">
              {record.componentType}
            </Badge>
          )}
          <Badge variant="outline" className={sourceTypeClass[record.sourceType]}>
            {t(`sourceTypes.${record.sourceType}`)}
          </Badge>
          <Badge variant="outline" className={verificationClass[record.verificationStatus]}>
            {t(`verificationStatuses.${record.verificationStatus}`)}
          </Badge>
          <Badge
            variant={record.isActive ? 'default' : 'outline'}
            className={
              record.isActive
                ? 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400'
                : 'text-muted-foreground'
            }
          >
            {t(record.isActive ? 'common.active' : 'common.inactive')}
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
            <DropdownMenuItem onClick={() => onUpdateVerification(record)}>
              {t('referenceBook.confirmVerifyTitle')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onToggleStatus(record)}
              className={
                record.isActive
                  ? 'text-destructive focus:text-destructive'
                  : 'text-green-600 focus:text-green-600'
              }
            >
              {record.isActive
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
