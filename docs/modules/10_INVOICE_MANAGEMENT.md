# Step 16 — Module 10: Invoice Management Prompt

```text
Using the Father Business Management System context, build Module 10: Invoice Management.

Purpose:
Create invoices from service jobs, direct sales, approved quotations, or manual invoices.

Invoice sources:
- Service Job
- Direct Sale
- Approved Quotation
- Manual Invoice

Invoice item types:
- Service
- Product
- Custom Charge

Frontend routes:
- app/(admin)/admin/invoices/page.tsx
- app/(admin)/admin/invoices/create/page.tsx
- app/(admin)/admin/invoices/[id]/page.tsx
- app/(admin)/admin/invoices/[id]/edit/page.tsx

Frontend feature:
features/invoices
  components
    InvoicePage.tsx
    InvoiceCreatePage.tsx
    InvoiceEditPage.tsx
    InvoiceDetailPage.tsx
    InvoiceForm.tsx
    InvoiceTable.tsx
    InvoiceMobileCard.tsx
    InvoiceItemSection.tsx
    InvoiceSummary.tsx
    print
      InvoicePrint.tsx
    dialogs
      CancelInvoiceDialog.tsx
  api.ts
  types.ts

Backend module:
src/modules/invoices
  dto
    create-invoice.dto.ts
    update-invoice.dto.ts
    query-invoice.dto.ts
    cancel-invoice.dto.ts
  invoices.controller.ts
  invoices.service.ts
  invoices.repository.ts
  invoices.module.ts

Invoice fields:
- id
- invoiceNumber
- customerId
- serviceJobId
- orderId
- items
- subtotal
- discount
- totalAmount
- paidAmount
- remainingBalance
- paymentStatus
- invoiceStatus
- note
- createdDate
- createdAt
- updatedAt

Invoice item fields:
- itemType
- name
- description
- quantity
- unitPrice
- totalPrice
- referenceId optional

Payment status:
- Unpaid
- Partial
- Paid

Invoice status:
- Draft
- Issued
- Canceled

Features:
1. Invoice list
2. Create invoice from service job
3. Create manual invoice
4. Invoice detail
5. Add service items
6. Add product items
7. Add custom charge items
8. Add discount
9. Auto-calculate subtotal, discount, total
10. Show paid amount and remaining amount
11. Print invoice/receipt
12. Cancel invoice with reason

Validation:
- Customer is required
- At least one invoice item is required
- Quantity must be greater than 0
- Unit price cannot be negative
- Discount cannot be greater than subtotal

Mobile UX:
- Desktop uses table
- Mobile uses card list
- Invoice form uses one-column layout on mobile
- Invoice summary sticky at bottom if useful
- Create/edit/detail separate pages

Before coding:
1. Review existing module pattern
2. List files to create/update
3. Then implement step by step
```
