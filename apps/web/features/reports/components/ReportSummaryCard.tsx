'use client';

import type { LucideIcon } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ReportSummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconClass?: string;
  highlight?: 'warn' | 'danger' | 'success';
  isLoading?: boolean;
}

export function ReportSummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass = 'bg-muted text-muted-foreground',
  highlight,
  isLoading,
}: ReportSummaryCardProps) {
  const borderClass =
    highlight === 'danger'
      ? 'border-red-500/30'
      : highlight === 'warn'
        ? 'border-amber-500/30'
        : highlight === 'success'
          ? 'border-green-500/30'
          : '';

  return (
    <Card className={borderClass}>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-7 w-32" />
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg shrink-0 ${iconClass}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground truncate">{title}</p>
              <p className="font-mono text-lg font-bold leading-tight">{value}</p>
              {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
