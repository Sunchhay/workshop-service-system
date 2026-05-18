# Step 18 — Module 12: Direct Sales / Order Management Prompt

```text
Using the Father Business Management System context, build Module 12: Direct Sales / Order Management.

Purpose:
Allow staff to sell products directly to customers without creating a service job.

Frontend routes:
- app/(admin)/admin/sales/page.tsx
- app/(admin)/admin/sales/create/page.tsx
- app/(admin)/admin/sales/[id]/page.tsx

Frontend feature:
features/sales
  components
    SalesPage.tsx
    SalesCreatePage.tsx
    SalesDetailPage.tsx
    SalesForm.tsx
    SalesTable.tsx
    SalesMobileCard.tsx
    SalesItemSection.tsx
    SalesSummary.tsx
    dialogs
      CancelSaleDialog.tsx
  api.ts
  types.ts

Backend module:
src/modules/sales
  dto
    create-sale.dto.ts
    query-sale.dto.ts
    cancel-sale.dto.ts
  sales.controller.ts
  sales.service.ts
  sales.repository.ts
  sales.module.ts

Sale/order fields:
- id
- orderNumber
- customerId optional
- customerName optional for walk-in
- items
- subtotal
- discount
- totalAmount
- paymentStatus
- orderStatus
- createdBy
- createdDate
- createdAt
- updatedAt

Order status:
- Pending
- Completed
- Canceled

Features:
1. Direct sale list
2. Create direct sale
3. Select customer or walk-in customer
4. Select product items
5. Quantity and unit price
6. Discount
7. Auto-calculate total
8. Create invoice from sale
9. Record payment
10. Update product stock
11. Print receipt
12. Cancel sale with reason

Validation:
- At least one product item is required
- Quantity must be greater than 0
- Product stock should be enough unless admin allows negative stock
- Discount cannot be greater than subtotal

Mobile UX:
- Desktop uses table
- Mobile uses card list
- Sales form should be one-column on mobile
- Summary section should be easy to see
- Primary action sticky at bottom if useful

Before coding:
1. Review product and invoice modules if available
2. List files to create/update
3. Then implement step by step
```
