# Step 17 — Module 11: Payment Management Prompt

```text
Using the Father Business Management System context, build Module 11: Payment Management.

Purpose:
Record payments connected to invoices. Support full payment, partial payment, and unpaid balance.

Important:
Payment record can use dialog because it is a small action from invoice detail.

Frontend feature:
features/payments
  components
    PaymentPage.tsx
    PaymentHistory.tsx
    PaymentForm.tsx
    PaymentTable.tsx
    PaymentMobileCard.tsx
    dialogs
      RecordPaymentDialog.tsx
      DeletePaymentDialog.tsx
  api.ts
  types.ts

Backend module:
src/modules/payments
  dto
    create-payment.dto.ts
    query-payment.dto.ts
  payments.controller.ts
  payments.service.ts
  payments.repository.ts
  payments.module.ts

Payment fields:
- id
- paymentDate
- customerId
- invoiceId
- paymentMethod
- paidAmount
- remainingBalance
- referenceNumber
- note
- createdBy
- createdAt
- updatedAt

Payment methods:
- Cash
- ABA
- Bank Transfer
- Other

Payment status logic:
- If paidAmount = 0, invoice is Unpaid
- If paidAmount > 0 and paidAmount < totalAmount, invoice is Partial
- If paidAmount >= totalAmount, invoice is Paid

Features:
1. Record payment from invoice detail
2. Support full payment
3. Support partial payment
4. Payment history list
5. Show customer unpaid balance
6. Auto-update invoice payment status
7. Payment method selection
8. Payment reference number
9. Payment note

Validation:
- Invoice is required
- Payment date is required
- Paid amount is required
- Paid amount must be greater than 0
- Paid amount cannot exceed remaining balance unless overpayment is intentionally allowed

Mobile UX:
- Record payment dialog must be mobile-friendly
- Payment history should use card list on mobile
- Payment section should be clear inside invoice detail

Before coding:
1. Review invoice detail structure first
2. List files to create/update
3. Then implement step by step
```
