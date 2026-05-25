'use client';

import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { JobStatus, Priority, ServiceJob } from '../types';

const statusClass: Record<JobStatus, string> = {
  PENDING: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
  IN_PROGRESS: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
  COMPLETED: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
  DELIVERED: 'bg-teal-500/10 text-teal-700 border-teal-500/20 dark:text-teal-400',
  CANCELLED: 'bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400',
};

const priorityClass: Record<Priority, string> = {
  LOW: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
  NORMAL: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
  HIGH: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
  URGENT: 'bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400',
};

interface ServiceJobMobileCardProps {
  job: ServiceJob;
  onUpdateStatus: (job: ServiceJob) => void;
  onDelete: (job: ServiceJob) => void;
}

export function ServiceJobMobileCard({ job, onUpdateStatus, onDelete }: ServiceJobMobileCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Link href={`/admin/service-jobs/${job.id}`} className="block p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-medium text-muted-foreground">
                  {job.jobCode}
                </span>
              </div>
              <p className="font-semibold text-sm truncate">{job.customer.name}</p>
              <p className="text-xs text-muted-foreground">{job.customer.phone}</p>
              <p className="text-sm text-muted-foreground mt-1 truncate">{job.partDescription}</p>
            </div>
            <div
              className="shrink-0"
              onClick={(e) => e.preventDefault()}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/service-jobs/${job.id}/edit`}>
                      {t('common.edit')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onUpdateStatus(job)}>
                    {t('serviceJobs.updateStatusTitle')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => onDelete(job)}
                  >
                    {t('common.delete')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="outline" className={statusClass[job.status]}>
              {t(`jobStatuses.${job.status}`)}
            </Badge>
            <Badge variant="outline" className={priorityClass[job.priority]}>
              {t(`priorities.${job.priority}`)}
            </Badge>
            {job.machineModel && (
              <Badge variant="outline" className="text-muted-foreground">
                {job.machineModel.brand} {job.machineModel.model}
              </Badge>
            )}
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
