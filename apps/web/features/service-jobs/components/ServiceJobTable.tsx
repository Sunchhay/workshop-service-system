'use client';

import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

interface ServiceJobTableProps {
  jobs: ServiceJob[];
  onUpdateStatus: (job: ServiceJob) => void;
  onDelete: (job: ServiceJob) => void;
}

export function ServiceJobTable({ jobs, onUpdateStatus, onDelete }: ServiceJobTableProps) {
  const { t } = useTranslation();
  const router = useRouter();

  if (jobs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground text-sm">
        {t('serviceJobs.noJobs')}
      </div>
    );
  }

  return (
    <div className="rounded-xl border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('serviceJobs.jobCode')}</TableHead>
            <TableHead>{t('serviceJobs.customer')}</TableHead>
            <TableHead>{t('serviceJobs.partDescription')}</TableHead>
            <TableHead>{t('serviceJobs.status')}</TableHead>
            <TableHead>{t('serviceJobs.priority')}</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow
              key={job.id}
              className="cursor-pointer"
              onClick={() => router.push(`/admin/service-jobs/${job.id}`)}
            >
              <TableCell className="font-mono text-xs font-medium">{job.jobCode}</TableCell>
              <TableCell>
                <p className="font-medium text-sm">{job.customer.name}</p>
                <p className="text-xs text-muted-foreground">{job.customer.phone}</p>
              </TableCell>
              <TableCell className="text-sm max-w-[200px] truncate">{job.partDescription}</TableCell>
              <TableCell>
                <Badge variant="outline" className={statusClass[job.status]}>
                  {t(`jobStatuses.${job.status}`)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={priorityClass[job.priority]}>
                  {t(`priorities.${job.priority}`)}
                </Badge>
              </TableCell>
              <TableCell
                onClick={(e) => e.stopPropagation()}
                className="text-right"
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => router.push(`/admin/service-jobs/${job.id}/edit`)}
                    >
                      {t('common.edit')}
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
