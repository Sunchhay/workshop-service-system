import type { Invoice, InvoiceStatus } from '../../types';

const STATUS_LABEL: Record<InvoiceStatus, string> = {
  DRAFT: 'Draft',
  ISSUED: 'Issued',
  PARTIAL: 'Partially Paid',
  PAID: 'Paid',
  CANCELLED: 'Cancelled',
};

function fmt(v: string) {
  const n = parseFloat(v);
  return isNaN(n) ? '0.00' : n.toFixed(2);
}

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

interface InvoicePrintProps {
  invoice: Invoice;
}

export function InvoicePrint({ invoice }: InvoicePrintProps) {
  return (
    <div style={{ fontFamily: 'serif', fontSize: '12px', color: '#000' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>INVOICE</h1>
          <p style={{ fontFamily: 'monospace', fontSize: '14px', marginTop: '4px' }}>
            {invoice.invoiceNumber}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontWeight: 'bold', fontSize: '14px' }}>Workshop Service System</p>
          <p style={{ color: '#555', marginTop: '4px' }}>Issued: {formatDate(invoice.issuedAt)}</p>
          {invoice.dueDate && (
            <p style={{ color: '#555' }}>Due: {formatDate(invoice.dueDate)}</p>
          )}
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '2px solid #000', marginBottom: '16px' }} />

      {/* Bill To + Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <p style={{ fontSize: '10px', textTransform: 'uppercase', color: '#555', marginBottom: '4px' }}>
            BILL TO
          </p>
          <p style={{ fontWeight: 'bold', fontSize: '13px' }}>{invoice.customer.name}</p>
          {invoice.customer.phone && <p style={{ color: '#555' }}>{invoice.customer.phone}</p>}
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '10px', textTransform: 'uppercase', color: '#555', marginBottom: '4px' }}>
            STATUS
          </p>
          <p style={{ fontWeight: 'bold', fontSize: '13px' }}>{STATUS_LABEL[invoice.status] ?? invoice.status}</p>
          {invoice.serviceJob && (
            <>
              <p style={{ fontSize: '10px', textTransform: 'uppercase', color: '#555', marginTop: '8px', marginBottom: '4px' }}>
                JOB REF
              </p>
              <p style={{ fontFamily: 'monospace' }}>{invoice.serviceJob.jobCode}</p>
            </>
          )}
        </div>
      </div>

      {/* Items table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #000', background: '#f5f5f5' }}>
            <th style={{ textAlign: 'left', padding: '6px 4px', fontSize: '11px' }}>Description</th>
            <th style={{ textAlign: 'right', padding: '6px 4px', fontSize: '11px', width: '60px' }}>Qty</th>
            <th style={{ textAlign: 'right', padding: '6px 4px', fontSize: '11px', width: '90px' }}>Unit Price</th>
            <th style={{ textAlign: 'right', padding: '6px 4px', fontSize: '11px', width: '80px' }}>Discount</th>
            <th style={{ textAlign: 'right', padding: '6px 4px', fontSize: '11px', width: '90px' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, idx) => (
            <tr key={item.id} style={{ borderBottom: '1px solid #e0e0e0', background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
              <td style={{ padding: '6px 4px' }}>
                <span>{item.description}</span>
                {item.service && (
                  <span style={{ color: '#888', fontSize: '10px', marginLeft: '6px' }}>
                    {item.service.code}
                  </span>
                )}
                {item.product && (
                  <span style={{ color: '#888', fontSize: '10px', marginLeft: '6px' }}>
                    {item.product.code}
                  </span>
                )}
              </td>
              <td style={{ padding: '6px 4px', textAlign: 'right', fontFamily: 'monospace' }}>
                {fmt(item.quantity)}
              </td>
              <td style={{ padding: '6px 4px', textAlign: 'right', fontFamily: 'monospace' }}>
                ${fmt(item.unitPrice)}
              </td>
              <td style={{ padding: '6px 4px', textAlign: 'right', fontFamily: 'monospace', color: '#888' }}>
                {parseFloat(item.discountAmount) > 0 ? `-$${fmt(item.discountAmount)}` : '—'}
              </td>
              <td style={{ padding: '6px 4px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 'bold' }}>
                ${fmt(item.totalPrice)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
        <table style={{ width: '220px', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '3px 4px', color: '#555' }}>Subtotal</td>
              <td style={{ padding: '3px 4px', textAlign: 'right', fontFamily: 'monospace' }}>
                ${fmt(invoice.subtotal)}
              </td>
            </tr>
            {parseFloat(invoice.discountAmount) > 0 && (
              <tr>
                <td style={{ padding: '3px 4px', color: '#555' }}>Discount</td>
                <td style={{ padding: '3px 4px', textAlign: 'right', fontFamily: 'monospace', color: '#c00' }}>
                  -${fmt(invoice.discountAmount)}
                </td>
              </tr>
            )}
            {parseFloat(invoice.taxAmount) > 0 && (
              <tr>
                <td style={{ padding: '3px 4px', color: '#555' }}>Tax</td>
                <td style={{ padding: '3px 4px', textAlign: 'right', fontFamily: 'monospace' }}>
                  +${fmt(invoice.taxAmount)}
                </td>
              </tr>
            )}
            <tr style={{ borderTop: '2px solid #000' }}>
              <td style={{ padding: '6px 4px', fontWeight: 'bold', fontSize: '13px' }}>Total</td>
              <td style={{ padding: '6px 4px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 'bold', fontSize: '13px' }}>
                ${fmt(invoice.totalAmount)}
              </td>
            </tr>
            {parseFloat(invoice.paidAmount) > 0 && (
              <tr>
                <td style={{ padding: '3px 4px', color: '#555' }}>Paid</td>
                <td style={{ padding: '3px 4px', textAlign: 'right', fontFamily: 'monospace', color: '#080' }}>
                  -${fmt(invoice.paidAmount)}
                </td>
              </tr>
            )}
            {parseFloat(invoice.dueAmount) > 0 && (
              <tr style={{ background: '#fff8e1' }}>
                <td style={{ padding: '6px 4px', fontWeight: 'bold' }}>Balance Due</td>
                <td style={{ padding: '6px 4px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 'bold', color: '#b45309' }}>
                  ${fmt(invoice.dueAmount)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div style={{ marginBottom: '24px', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
          <p style={{ fontSize: '10px', textTransform: 'uppercase', color: '#555', marginBottom: '4px' }}>Notes</p>
          <p style={{ whiteSpace: 'pre-line' }}>{invoice.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div style={{ borderTop: '1px solid #ccc', paddingTop: '12px', marginTop: '24px', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#888' }}>
        <span>Created by: {invoice.createdBy.name}</span>
        <span>Printed: {new Date().toLocaleString()}</span>
      </div>
    </div>
  );
}
