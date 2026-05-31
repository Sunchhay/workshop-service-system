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

import type { MachineModel } from '../types';

interface MachineModelMobileCardProps {
  model: MachineModel;
  onToggleStatus: (model: MachineModel) => void;
  onDelete: (model: MachineModel) => void;
}

export function MachineModelMobileCard({
  model,
  onToggleStatus,
  onDelete,
}: MachineModelMobileCardProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div
      className="flex items-start gap-3 rounded-xl border bg-card p-4 cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => router.push(`/admin/machine-models/${model.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ')
          router.push(`/admin/machine-models/${model.id}`);
      }}
    >
      {/* Avatar */}
      {model.imageUrl ? (
        <img
          src={model.imageUrl}
          alt={model.modelName}
          className="h-10 w-10 rounded-md object-cover shrink-0"
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary shrink-0">
          {model.code.slice(0, 2).toUpperCase()}
        </div>
      )}

      {/* Main info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm">{model.modelName}</span>
          {model.brand && (
            <span className="text-muted-foreground text-sm">{model.brand}</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{model.code}</p>
        {model.description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {model.description}
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {model.machineType && (
            <Badge
              variant="outline"
              className="bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400 text-xs"
            >
              {model.machineType}
            </Badge>
          )}
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
      </div>
    </div>
  );
}
