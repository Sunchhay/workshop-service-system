# Step 19 — Module 13: Expense Management Prompt

```text
Using the Father Business Management System context, build Module 13: Expense Management.

Purpose:
Record and manage business expenses.

Frontend routes:
- app/(admin)/admin/expenses/page.tsx
- app/(admin)/admin/expenses/create/page.tsx
- app/(admin)/admin/expenses/[id]/page.tsx
- app/(admin)/admin/expenses/[id]/edit/page.tsx

Frontend feature:
features/expenses
  components
    ExpensePage.tsx
    ExpenseCreatePage.tsx
    ExpenseEditPage.tsx
    ExpenseDetailPage.tsx
    ExpenseForm.tsx
    ExpenseTable.tsx
    ExpenseMobileCard.tsx
    dialogs
      DeleteExpenseDialog.tsx
  api.ts
  types.ts

Backend module:
src/modules/expenses
  dto
    create-expense.dto.ts
    update-expense.dto.ts
    query-expense.dto.ts
  expenses.controller.ts
  expenses.service.ts
  expenses.repository.ts
  expenses.module.ts

Expense fields:
- id
- expenseTitle
- category
- amount
- paymentMethod
- expenseDate
- note
- createdBy
- createdAt
- updatedAt

Example categories:
- Rent
- Salary
- Fuel
- Stock
- Utility
- Repair Tools
- Other

Features:
1. Expense list
2. Add expense
3. Edit expense
4. Expense detail
5. Delete/cancel expense
6. Search by title
7. Filter by category, date, payment method
8. Include expenses in reports later

Validation:
- Expense title is required
- Category is required
- Amount is required
- Amount must be greater than 0
- Expense date is required

Mobile UX:
- Desktop uses table
- Mobile uses card list
- Create/edit/detail use app header and back button
- Save button sticky at bottom on mobile

Before coding:
1. Review existing module pattern
2. List files to create/update
3. Then implement step by step
```
