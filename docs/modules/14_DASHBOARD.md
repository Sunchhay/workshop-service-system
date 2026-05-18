# Step 20 — Module 14: Dashboard Prompt

```text
Using the Father Business Management System context, build Module 14: Dashboard.

Purpose:
Show business overview and daily operation summary.

Frontend route:
- app/(admin)/admin/dashboard/page.tsx

Frontend feature:
features/dashboard
  components
    DashboardPage.tsx
    DashboardSummaryCard.tsx
    RecentServiceJobs.tsx
    RecentTransactions.tsx
    LowStockProducts.tsx
  api.ts
  types.ts

Backend module:
src/modules/dashboard
  dashboard.controller.ts
  dashboard.service.ts
  dashboard.repository.ts
  dashboard.module.ts

Dashboard cards:
- Total Customers
- Today’s Service Jobs
- Pending Service Jobs
- Completed Service Jobs
- Today’s Sales
- Monthly Sales
- Total Unpaid Amount
- Total Expenses
- Low Stock Products
- Recent Transactions

Filters:
- Today
- This Week
- This Month
- Custom Date Range

Features:
1. Summary cards
2. Recent service jobs
3. Recent invoices/payments
4. Low stock products
5. Date range filter
6. Responsive layout
7. Clickable recent items

Mobile UX:
- Dashboard should feel like mobile app home screen
- Use summary cards in grid
- Recent items should be card list
- Avoid wide table
- Use pull-to-refresh or refresh button if suitable

Acceptance criteria:
- User can see daily business summary
- User can filter dashboard by date
- User can click recent service job or invoice
- Low stock products are visible
- Dashboard loads efficiently

Before coding:
1. Review existing dashboard pattern
2. List files to create/update
3. Then implement step by step
```
