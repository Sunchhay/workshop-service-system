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

import type { ReferenceBook } from '../types';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

interface ReferenceBookTableProps {
  records: ReferenceBook[];
  onToggleStatus: (record: ReferenceBook) => void;
  onDelete: (record: ReferenceBook) => void;
}

export function ReferenceBookTable({ records, onToggleStatus, onDelete }: ReferenceBookTableProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('referenceBook.title_field')}</TableHead>
            <TableHead>{t('referenceBook.machineModel')}</TableHead>
            <TableHead>{t('referenceBook.category')}</TableHead>
            <TableHead>{t('referenceBook.statusLabel')}</TableHead>
            <TableHead>{t('referenceBook.updatedAt')}</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
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
                <TableCell>
                  <p className="font-medium text-sm">{record.title}</p>
                </TableCell>
                <TableCell>
                  {record.machineModel ? (
                    <div>
                      <p className="text-sm font-medium">{record.machineModel.modelName}</p>
                      {record.machineModel.brand && (
                        <p className="text-xs text-muted-foreground">{record.machineModel.brand}</p>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {record.category ? (
                    <Badge
                      variant="outline"
                      className="bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400"
                    >
                      {record.category}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(record.updatedAt)}
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
