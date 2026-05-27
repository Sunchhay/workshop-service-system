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
      className="flex items-start gap-3 rounded-xl border bg-card p-4  cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => router.push(`/admin/machine-models/${model.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ')
          router.push(`/admin/machine-models/${model.id}`);
      }}
    >
      {/* Main info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm">{model.brand}</span>
          <span className="text-muted-foreground text-sm">{model.model}</span>
        </div>
        {model.description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {model.description}
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {model.category && (
            <Badge
              variant="outline"
              className="bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400 text-xs"
            >
              {model.category}
            </Badge>
          )}
          <Badge
            variant={model.isActive ? 'default' : 'outline'}
            className={
              model.isActive
                ? 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400'
                : 'text-muted-foreground'
            }
          >
            {t(model.isActive ? 'common.active' : 'common.inactive')}
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
                model.isActive
                  ? 'text-destructive focus:text-destructive'
                  : 'text-green-600 focus:text-green-600'
              }
            >
              {model.isActive
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
