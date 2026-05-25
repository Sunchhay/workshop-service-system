'use client';

import { useTranslation } from '@/lib/i18n/TranslationContext';
import { Button } from '@/components/ui/button';

type Period = 'today' | 'week' | 'month' | 'all' | 'custom';

interface ReportFilterProps {
  fromDate: string;
  toDate: string;
  onFromDateChange: (v: string) => void;
  onToDateChange: (v: string) => void;
}

function fmt(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getRange(period: Period): { from: string; to: string } {
  const now = new Date();
  const today = fmt(now);
  if (period === 'today') return { from: today, to: today };
  if (period === 'week') {
    const day = now.getDay() === 0 ? 7 : now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - day + 1);
    return { from: fmt(monday), to: today };
  }
  if (period === 'month') {
    return { from: fmt(new Date(now.getFullYear(), now.getMonth(), 1)), to: today };
  }
  return { from: '', to: '' };
}

export function ReportFilter({ fromDate, toDate, onFromDateChange, onToDateChange }: ReportFilterProps) {
  const { t } = useTranslation();

  const activePeriod: Period = (() => {
    if (!fromDate && !toDate) return 'all';
    const now = new Date();
    const today = fmt(now);
    const { from: todayFrom } = getRange('today');
    const { from: weekFrom } = getRange('week');
    const { from: monthFrom } = getRange('month');
    if (fromDate === todayFrom && toDate === today) return 'today';
    if (fromDate === weekFrom && toDate === today) return 'week';
    if (fromDate === monthFrom && toDate === today) return 'month';
    return 'custom';
  })();

  const handlePeriod = (period: Period) => {
    const { from, to } = getRange(period);
    onFromDateChange(from);
    onToDateChange(to);
  };

  const inputClass =
    'flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

  const periods: { key: Period; label: string }[] = [
    { key: 'today', label: t('reports.periodToday') },
    { key: 'week', label: t('reports.periodWeek') },
    { key: 'month', label: t('reports.periodMonth') },
    { key: 'all', label: t('reports.periodAll') },
    { key: 'custom', label: t('reports.periodCustom') },
  ];

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <div className="flex flex-wrap gap-1.5">
        {periods.map(({ key, label }) => (
          <Button
            key={key}
            variant={activePeriod === key ? 'default' : 'outline'}
            size="sm"
            className="h-8 text-xs"
            onClick={() => handlePeriod(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      {activePeriod === 'custom' && (
        <div className="flex gap-2 items-center">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => onFromDateChange(e.target.value)}
            className={inputClass}
          />
          <span className="text-muted-foreground text-sm">–</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => onToDateChange(e.target.value)}
            className={inputClass}
          />
        </div>
      )}

      {fromDate && toDate && activePeriod !== 'custom' && (
        <span className="text-xs text-muted-foreground">
          {fromDate} – {toDate}
        </span>
      )}
    </div>
  );
}
