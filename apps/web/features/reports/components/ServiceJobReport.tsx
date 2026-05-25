'use client';

import { ClipboardList } from 'lucide-react';
import { useState } from 'react';

import { AppEmptyState } from '@/components/app/AppEmptyState';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetReportServiceJobsQuery } from '../api';

const STATUS_CLASS: Record<string, string> = {
  PENDING: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
  IN_PROGRESS: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
  COMPLETED: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
  DELIVERED: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400',
  CANCELLED: 'bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400',
};

const PRIORITY_CLASS: Record<string, string> = {
  LOW: 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
  NORMAL: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
  HIGH: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400',
  URGENT: 'bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400',
};

const JOB_STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELIVERED', 'CANCELLED'];
const PRIORITIES = ['LOW', 'NORMAL', 'HIGH', 'URGENT'];

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

interface Props { fromDate: string; toDate: string; }

export function ServiceJobReport({ fromDate, toDate }: Props) {
  const { t } = useTranslation();
  const [status, setStatus] = useState('__all');
  const [priority, setPriority] = useState('__all');

  const { data, isLoading } = useGetReportServiceJobsQuery({
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    status: status === '__all' ? undefined : status,
    priority: priority === '__all' ? undefined : priority,
  });
  const jobs = data?.data ?? [];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40 h-8 text-xs">
            <SelectValue placeholder={t('reports.allStatuses')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">{t('reports.allStatuses')}</SelectItem>
            {JOB_STATUSES.map(s => <SelectItem key={s} value={s}>{t(`jobStatuses.${s}` as any)}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-40 h-8 text-xs">
            <SelectValue placeholder={t('reports.allPriorities')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">{t('reports.allPriorities')}</SelectItem>
            {PRIORITIES.map(p => <SelectItem key={p} value={p}>{t(`priorities.${p}` as any)}</SelectItem>)}
          </SelectContent>
        </Select>
        {!isLoading && <p className="text-xs text-muted-foreground self-center">{jobs.length} {t('reports.totalRecords')}</p>}
      </div>

      {/* Loading */}
      {isLoading && <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}</div>}

      {/* Empty */}
      {!isLoading && jobs.length === 0 && (
        <AppEmptyState icon={ClipboardList} title={t('reports.noData')} description={t('reports.noDataDesc')} />
      )}

      {/* Desktop table */}
      {!isLoading && jobs.length > 0 && (
        <div className="hidden md:block rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.jobCode')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.customer')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.partDescription')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.status')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.priority')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{t('reports.technician')}</th>
                <th className="text-right px-4 py-3 font-medium text-xs text-muted-foreground">{t('common.dateFrom')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {jobs.map(job => (
                <tr key={job.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-semibold">{job.jobCode}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-sm">{job.customer.name}</p>
                    <p className="text-xs text-muted-foreground">{job.customer.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground max-w-[200px] truncate">{job.partDescription}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`text-[10px] py-0 ${STATUS_CLASS[job.status] ?? ''}`}>
                      {t(`jobStatuses.${job.status}` as any)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`text-[10px] py-0 ${PRIORITY_CLASS[job.priority] ?? ''}`}>
                      {t(`priorities.${job.priority}` as any)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{job.assignedTo?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground text-right">{fmtDate(job.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile cards */}
      {!isLoading && jobs.length > 0 && (
        <div className="md:hidden space-y-3">
          {jobs.map(job => (
            <Card key={job.id}>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs font-semibold">{job.jobCode}</p>
                    <p className="text-sm font-medium mt-0.5 truncate">{job.customer.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{job.partDescription}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge variant="outline" className={`text-[10px] py-0 ${STATUS_CLASS[job.status] ?? ''}`}>
                      {t(`jobStatuses.${job.status}` as any)}
                    </Badge>
                    <Badge variant="outline" className={`text-[10px] py-0 ${PRIORITY_CLASS[job.priority] ?? ''}`}>
                      {t(`priorities.${job.priority}` as any)}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">{fmtDate(job.createdAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
