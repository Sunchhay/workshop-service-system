'use client';

import Link from 'next/link';
import { ArrowRight, ClipboardList } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetRecentServiceJobsQuery } from '../api';

const statusClass: Record<string, string> = {
  PENDING: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
  IN_PROGRESS: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
  COMPLETED: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
  DELIVERED: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400',
  CANCELLED: 'bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400',
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function RecentServiceJobs() {
  const { t } = useTranslation();
  const { data, isLoading } = useGetRecentServiceJobsQuery();
  const jobs = data?.data ?? [];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">{t('dashboard.recentServiceJobs')}</CardTitle>
          <Button asChild variant="ghost" size="sm" className="h-7 text-xs gap-1">
            <Link href="/admin/service-jobs">
              {t('dashboard.viewAll')}
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 gap-2 text-muted-foreground">
            <ClipboardList className="h-8 w-8 opacity-30" />
            <p className="text-sm">{t('dashboard.noRecentJobs')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/admin/service-jobs/${job.id}`}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent/50 transition-colors group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-semibold">{job.jobCode}</span>
                    <Badge variant="outline" className={`text-[10px] py-0 ${statusClass[job.status] ?? ''}`}>
                      {t(`jobStatuses.${job.status}` as any)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {job.customer.name} · {job.partDescription}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{formatDate(job.createdAt)}</span>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
