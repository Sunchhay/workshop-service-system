import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { ServiceJob } from '../../types';

function formatDate(d: string | null | undefined) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function formatDecimal(v: string) {
  const n = parseFloat(v);
  return isNaN(n) ? '0.00' : n.toFixed(2);
}

interface Props {
  job: ServiceJob;
}

export function ServiceWorkSheetPrint({ job }: Props) {
  const { t } = useTranslation();

  const jobTotal = job.items.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0);
  const itemsWithMeasurement = job.items.filter((item) => item.measurement);

  return (
    <div
      className="bg-white text-black font-sans"
      style={{ fontSize: '11px', lineHeight: '1.4' }}
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex justify-between items-start border-b-2 border-black pb-3 mb-3">
        <div>
          <div className="text-xl font-bold">{t('serviceJobs.businessName')}</div>
          <div className="text-xs mt-0.5">{t('serviceJobs.businessAddress')}</div>
          <div className="text-xs">{t('serviceJobs.businessPhone')}</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold uppercase tracking-wide">
            {t('serviceJobs.workSheet')}
          </div>
          <div className="font-mono font-semibold mt-1">{job.jobCode}</div>
          <div className="text-xs mt-0.5">{formatDate(job.createdAt)}</div>
        </div>
      </div>

      {/* ── Job Information ─────────────────────────────────────── */}
      <section className="mb-3">
        <div className="bg-gray-200 px-2 py-0.5 font-semibold uppercase text-xs tracking-wide mb-1">
          {t('serviceJobs.jobInformation')}
        </div>
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="border border-gray-400 px-2 py-1 w-1/4 font-medium bg-gray-50">
                {t('serviceJobs.status')}
              </td>
              <td className="border border-gray-400 px-2 py-1 w-1/4">
                {t(`jobStatuses.${job.status}`)}
              </td>
              <td className="border border-gray-400 px-2 py-1 w-1/4 font-medium bg-gray-50">
                {t('serviceJobs.priority')}
              </td>
              <td className="border border-gray-400 px-2 py-1 w-1/4">
                {t(`priorities.${job.priority}`)}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-2 py-1 font-medium bg-gray-50">
                {t('serviceJobs.estimatedCompletionDate')}
              </td>
              <td className="border border-gray-400 px-2 py-1">
                {formatDate(job.estimatedCompletionDate)}
              </td>
              <td className="border border-gray-400 px-2 py-1 font-medium bg-gray-50">
                {t('serviceJobs.createdBy')}
              </td>
              <td className="border border-gray-400 px-2 py-1">{job.createdBy.name}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── Customer Information ────────────────────────────────── */}
      <section className="mb-3">
        <div className="bg-gray-200 px-2 py-0.5 font-semibold uppercase text-xs tracking-wide mb-1">
          {t('serviceJobs.customerInformation')}
        </div>
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="border border-gray-400 px-2 py-1 w-1/4 font-medium bg-gray-50">
                {t('serviceJobs.customer')}
              </td>
              <td className="border border-gray-400 px-2 py-1 w-1/4">{job.customer.name}</td>
              <td className="border border-gray-400 px-2 py-1 w-1/4 font-medium bg-gray-50">
                {t('customers.phone')}
              </td>
              <td className="border border-gray-400 px-2 py-1 w-1/4">
                {job.customer.phone ?? '—'}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── Machine / Part Information ──────────────────────────── */}
      <section className="mb-3">
        <div className="bg-gray-200 px-2 py-0.5 font-semibold uppercase text-xs tracking-wide mb-1">
          {t('serviceJobs.machineInformation')}
        </div>
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="border border-gray-400 px-2 py-1 w-1/4 font-medium bg-gray-50">
                {t('serviceJobs.partDescription')}
              </td>
              <td className="border border-gray-400 px-2 py-1" colSpan={3}>
                {job.partDescription}
              </td>
            </tr>
            {job.machineModel && (
              <tr>
                <td className="border border-gray-400 px-2 py-1 font-medium bg-gray-50">
                  {t('serviceJobs.machineModel')}
                </td>
                <td className="border border-gray-400 px-2 py-1 w-1/4">
                  {job.machineModel.brand} {job.machineModel.model}
                </td>
                <td className="border border-gray-400 px-2 py-1 w-1/4 font-medium bg-gray-50">
                  {t('machineModels.category')}
                </td>
                <td className="border border-gray-400 px-2 py-1 w-1/4">
                  {job.machineModel.category ?? '—'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* ── Service Items ───────────────────────────────────────── */}
      <section className="mb-3">
        <div className="bg-gray-200 px-2 py-0.5 font-semibold uppercase text-xs tracking-wide mb-1">
          {t('serviceJobs.items')}
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-400 px-2 py-1 text-center w-8">#</th>
              <th className="border border-gray-400 px-2 py-1 text-left">
                {t('serviceJobs.description')}
              </th>
              <th className="border border-gray-400 px-2 py-1 text-left w-28">
                {t('serviceJobs.measurement')}
              </th>
              <th className="border border-gray-400 px-2 py-1 text-center w-12">
                {t('serviceJobs.quantity')}
              </th>
              <th className="border border-gray-400 px-2 py-1 text-right w-20">
                {t('serviceJobs.unitPrice')}
              </th>
              <th className="border border-gray-400 px-2 py-1 text-right w-20">
                {t('serviceJobs.totalPrice')}
              </th>
            </tr>
          </thead>
          <tbody>
            {job.items.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="border border-gray-400 px-2 py-3 text-center text-gray-400"
                >
                  {t('serviceJobs.noItems')}
                </td>
              </tr>
            ) : (
              job.items.map((item, i) => (
                <tr key={item.id}>
                  <td className="border border-gray-400 px-2 py-1 text-center">{i + 1}</td>
                  <td className="border border-gray-400 px-2 py-1">
                    <div>{item.description}</div>
                    {item.service && (
                      <div className="text-gray-500" style={{ fontSize: '10px' }}>
                        {item.service.nameEn}
                      </div>
                    )}
                    {item.notes && (
                      <div className="text-gray-500 italic" style={{ fontSize: '10px' }}>
                        {item.notes}
                      </div>
                    )}
                  </td>
                  <td className="border border-gray-400 px-2 py-1 font-mono">
                    {item.measurement ?? '—'}
                  </td>
                  <td className="border border-gray-400 px-2 py-1 text-center font-mono">
                    {formatDecimal(item.quantity)}
                  </td>
                  <td className="border border-gray-400 px-2 py-1 text-right font-mono">
                    ${formatDecimal(item.unitPrice)}
                  </td>
                  <td className="border border-gray-400 px-2 py-1 text-right font-mono">
                    ${formatDecimal(item.totalPrice)}
                  </td>
                </tr>
              ))
            )}
            <tr className="font-semibold">
              <td
                colSpan={5}
                className="border border-gray-400 px-2 py-1.5 text-right bg-gray-50"
              >
                {t('serviceJobs.jobTotal')}
              </td>
              <td className="border border-gray-400 px-2 py-1.5 text-right font-mono bg-gray-50">
                ${jobTotal.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── Measurement Details ─────────────────────────────────── */}
      {itemsWithMeasurement.length > 0 && (
        <section className="mb-3">
          <div className="bg-gray-200 px-2 py-0.5 font-semibold uppercase text-xs tracking-wide mb-1">
            {t('serviceJobs.measurementDetails')}
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 px-2 py-1 text-left">
                  {t('serviceJobs.description')}
                </th>
                <th className="border border-gray-400 px-2 py-1 text-left">
                  {t('serviceJobs.measurement')}
                </th>
              </tr>
            </thead>
            <tbody>
              {itemsWithMeasurement.map((item) => (
                <tr key={item.id}>
                  <td className="border border-gray-400 px-2 py-1">{item.description}</td>
                  <td className="border border-gray-400 px-2 py-1 font-mono">
                    {item.measurement}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* ── Technician ──────────────────────────────────────────── */}
      <section className="mb-3">
        <div className="bg-gray-200 px-2 py-0.5 font-semibold uppercase text-xs tracking-wide mb-1">
          {t('serviceJobs.technicianSection')}
        </div>
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="border border-gray-400 px-2 py-1 w-1/4 font-medium bg-gray-50">
                {t('serviceJobs.assignedTo')}
              </td>
              <td className="border border-gray-400 px-2 py-1 w-1/4">
                {job.assignedTo?.name ?? t('serviceJobs.unassigned')}
              </td>
              <td className="border border-gray-400 px-2 py-1 w-1/4 font-medium bg-gray-50">
                {t('serviceJobs.technicianNotes')}
              </td>
              <td className="border border-gray-400 px-2 py-1 w-1/4">
                {job.technicianNotes ?? '—'}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── Parts & Products (manual fill) ─────────────────────── */}
      <section className="mb-3">
        <div className="bg-gray-200 px-2 py-0.5 font-semibold uppercase text-xs tracking-wide mb-1">
          {t('serviceJobs.productsSection')}
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-400 px-2 py-1 text-center w-8">#</th>
              <th className="border border-gray-400 px-2 py-1 text-left">
                {t('serviceJobs.description')}
              </th>
              <th className="border border-gray-400 px-2 py-1 text-center w-16">
                {t('serviceJobs.quantity')}
              </th>
              <th className="border border-gray-400 px-2 py-1 text-right w-20">
                {t('serviceJobs.unitPrice')}
              </th>
              <th className="border border-gray-400 px-2 py-1 text-right w-20">
                {t('serviceJobs.totalPrice')}
              </th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4].map((n) => (
              <tr key={n} style={{ height: '22px' }}>
                <td className="border border-gray-400 px-2 py-1 text-center text-gray-300">{n}</td>
                <td className="border border-gray-400 px-2 py-1">&nbsp;</td>
                <td className="border border-gray-400 px-2 py-1">&nbsp;</td>
                <td className="border border-gray-400 px-2 py-1">&nbsp;</td>
                <td className="border border-gray-400 px-2 py-1">&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ── Notes ───────────────────────────────────────────────── */}
      {job.notes && (
        <section className="mb-3">
          <div className="bg-gray-200 px-2 py-0.5 font-semibold uppercase text-xs tracking-wide mb-1">
            {t('serviceJobs.notes')}
          </div>
          <div className="border border-gray-400 px-2 py-2 min-h-8 whitespace-pre-line">
            {job.notes}
          </div>
        </section>
      )}

      {/* ── Signatures ──────────────────────────────────────────── */}
      <section className="mb-4">
        <div className="bg-gray-200 px-2 py-0.5 font-semibold uppercase text-xs tracking-wide mb-3">
          {t('serviceJobs.signaturesSection')}
        </div>
        <div className="flex gap-8">
          <div className="flex-1 text-center">
            <div style={{ borderTop: '1px solid black', marginTop: '36px', paddingTop: '4px' }}>
              {t('serviceJobs.customerSignature')}
            </div>
            <div className="text-xs mt-1">
              {t('customers.name')}: ___________________________
            </div>
            <div className="text-xs mt-1">
              {t('serviceJobs.createdAt')}: _____________________
            </div>
          </div>
          <div className="flex-1 text-center">
            <div style={{ borderTop: '1px solid black', marginTop: '36px', paddingTop: '4px' }}>
              {t('serviceJobs.technicianSignature')}
            </div>
            <div className="text-xs mt-1">
              {t('customers.name')}: ___________________________
            </div>
            <div className="text-xs mt-1">
              {t('serviceJobs.createdAt')}: _____________________
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <div
        className="border-t border-gray-300 pt-2 flex justify-between text-gray-500"
        style={{ fontSize: '9px' }}
      >
        <span>
          {t('serviceJobs.printedOn')}: {new Date().toLocaleDateString()}
        </span>
        <span className="font-mono">{job.jobCode}</span>
      </div>
    </div>
  );
}
