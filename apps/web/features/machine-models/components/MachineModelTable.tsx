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

import type { MachineModel } from '../types';

interface MachineModelTableProps {
  models: MachineModel[];
  onToggleStatus: (model: MachineModel) => void;
  onDelete: (model: MachineModel) => void;
}

export function MachineModelTable({
  models,
  onToggleStatus,
  onDelete,
}: MachineModelTableProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10" />
            <TableHead>{t('machineModels.code')}</TableHead>
            <TableHead>{t('machineModels.brand')}</TableHead>
            <TableHead>{t('machineModels.modelName')}</TableHead>
            <TableHead>{t('machineModels.machineType')}</TableHead>
            <TableHead>{t('machineModels.year')}</TableHead>
            <TableHead>{t('machineModels.statusLabel')}</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {models.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center text-muted-foreground py-10"
              >
                {t('machineModels.noModels')}
              </TableCell>
            </TableRow>
          ) : (
            models.map((model) => (
              <TableRow
                key={model.id}
                className="cursor-pointer"
                onClick={() => router.push(`/admin/machine-models/${model.id}`)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  {model.imageUrl ? (
                    <img
                      src={model.imageUrl}
                      alt={model.modelName}
                      className="h-8 w-8 rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
                      {model.code.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{model.code}</TableCell>
                <TableCell>{model.brand ?? '—'}</TableCell>
                <TableCell>{model.modelName}</TableCell>
                <TableCell>
                  {model.machineType ? (
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400">
                      {model.machineType}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {model.year ?? '—'}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={model.status === 'ACTIVE' ? 'default' : 'outline'}
                    className={
                      model.status === 'ACTIVE'
                        ? 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400'
                        : 'text-muted-foreground'
                    }
                  >
                    {t(model.status === 'ACTIVE' ? 'common.active' : 'common.inactive')}
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
                        <Link href={`/admin/machine-models/${model.id}`}>
                          {t('machineModels.modelDetail')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/machine-models/${model.id}/edit`}>
                          {t('common.edit')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onToggleStatus(model)}
                        className={
                          model.status === 'ACTIVE'
                            ? 'text-destructive focus:text-destructive'
                            : 'text-green-600 focus:text-green-600'
                        }
                      >
                        {model.status === 'ACTIVE'
                          ? t('machineModels.confirmDisableTitle')
                          : t('machineModels.confirmEnableTitle')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(model)}
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
