# Step 21 — Module 15: Basic Reports Prompt

```text
Using the Father Business Management System context, build Module 15: Basic Reports.

Purpose:
Generate business reports for service, sales, payment, expense, and stock.

Frontend route:
- app/(admin)/admin/reports/page.tsx

Frontend feature:
features/reports
  components
    ReportPage.tsx
    ReportFilter.tsx
    SalesReport.tsx
    ServiceJobReport.tsx
    PaymentReport.tsx
    ExpenseReport.tsx
    ProfitReport.tsx
  api.ts
  types.ts

Backend module:
src/modules/reports
  reports.controller.ts
  reports.service.ts
  reports.repository.ts
  reports.module.ts

Required reports:
1. Sales Report
2. Service Job Report
3. Service Income Report
4. Payment Report
5. Customer Report
6. Expense Report
7. Profit Report
8. Unpaid Balance Report
9. Product Usage Report
10. Low Stock Report

Filters:
- Date range
- Customer
- Service type
- Component type
- Payment status
- Product
- Expense category
- Technician
- Job status

For MVP:
Build screen and data summary first.
Export to Excel/PDF/CSV can be added later.

Mobile UX:
- Reports should be readable on mobile
- Use cards or compact tables
- Filters should collapse on mobile
- Avoid horizontal overflow

Acceptance criteria:
- User can view service income report
- User can view sales report
- User can view payment report
- User can view unpaid balance report
- User can view expense report
- User can filter reports by date range

Before coding:
1. Review existing report/dashboard pattern
2. List files to create/update
3. Then implement step by step
```
