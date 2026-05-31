import type { ReportListResult } from './types';

export function getReportItems<T>(
  payload: ReportListResult<T> | T[] | undefined,
): T[] {
  if (Array.isArray(payload)) return payload;
  return Array.isArray(payload?.items) ? payload.items : [];
}

export function getReportSummary<T, TSummary>(
  payload: ReportListResult<T, TSummary> | T[] | undefined,
): TSummary | undefined {
  if (Array.isArray(payload)) return undefined;
  return payload?.summary;
}
