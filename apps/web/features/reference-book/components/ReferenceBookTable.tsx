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

interface ReferenceBookTableProps {
  records: ReferenceBook[];
  onToggleStatus: (record: ReferenceBook) => void;
  onDelete: (record: ReferenceBook) => void;
  onUpdateVerification: (record: ReferenceBook) => void;
}

export function ReferenceBookTable({
  records,
  onToggleStatus,
  onDelete,
  onUpdateVerification,
}: ReferenceBookTableProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('referenceBook.partName')}</TableHead>
            <TableHead>{t('referenceBook.machineModel')}</TableHead>
            <TableHead>{t('referenceBook.componentType')}</TableHead>
            <TableHead>{t('referenceBook.sourceType')}</TableHead>
            <TableHead>{t('referenceBook.verificationStatus')}</TableHead>
            <TableHead>{t('referenceBook.statusLabel')}</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                {t('referenceBook.noRecords')}
              </TableCell>
            </TableRow>
          ) : (
            records.map((record) => (
              <TableRow
                key={record.id}
                className="cursor-pointer"
                onClick={() => router.push(`/admin/reference-book/${record.id}`)}
              >
                {/* Part name */}
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{record.partName}</p>
                    {record.partCode && (
                      <p className="text-xs text-muted-foreground font-mono">
                        {record.partCode}
                      </p>
                    )}
                  </div>
                </TableCell>
                {/* Machine model */}
                <TableCell>
                  {record.machineModel ? (
                    <div>
                      <p className="text-sm font-medium">{record.machineModel.brand}</p>
                      <p className="text-xs text-muted-foreground">{record.machineModel.model}</p>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                {/* Component type */}
                <TableCell>
                  {record.componentType ? (
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400">
                      {record.componentType}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                {/* Source type */}
                <TableCell>
                  <Badge variant="outline" className={sourceTypeClass[record.sourceType]}>
                    {t(`sourceTypes.${record.sourceType}`)}
                  </Badge>
                </TableCell>
                {/* Verification status */}
                <TableCell>
                  <Badge variant="outline" className={verificationClass[record.verificationStatus]}>
                    {t(`verificationStatuses.${record.verificationStatus}`)}
                  </Badge>
                </TableCell>
                {/* Status */}
                <TableCell>
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
