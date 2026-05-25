import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconClass?: string;
  href?: string;
  highlight?: 'warn' | 'danger';
  isLoading?: boolean;
}

const highlightClass = {
  warn: 'border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10',
  danger: 'border-red-500/30 bg-red-500/5 dark:bg-red-500/10',
};

export function DashboardSummaryCard({
  title, value, subtitle, icon: Icon, iconClass, href, highlight, isLoading,
}: Props) {
  const content = (
    <Card className={`h-full transition-colors ${highlight ? highlightClass[highlight] : ''} ${href ? 'hover:bg-accent/50 cursor-pointer' : ''}`}>
      <CardContent className="px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground leading-tight">{title}</p>
            {isLoading ? (
              <Skeleton className="h-7 w-20 mt-1.5" />
            ) : (
              <p className="text-xl font-bold mt-1 font-mono leading-tight">{value}</p>
            )}
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
          <div className={`p-2 rounded-lg shrink-0 ${iconClass ?? 'bg-primary/10 text-primary'}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (href) return <Link href={href} className="block h-full">{content}</Link>;
  return content;
}
