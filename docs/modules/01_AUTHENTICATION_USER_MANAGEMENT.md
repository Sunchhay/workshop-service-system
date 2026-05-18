# Step 7 — Module 1: Authentication & User Management Prompt

```text
Using the Father Business Management System context, build or update Module 1: Authentication & User Management.

Purpose:
Users must log in before accessing business data. The system contains sensitive data such as customers, service jobs, invoices, payments, prices, expenses, and reports.

Important:
If my existing project already has authentication, reuse the existing auth pattern instead of rebuilding everything from zero.

Roles:
- Admin
- Staff
- Technician
- Cashier

Role access:
- Admin: full access
- Staff: customers, service jobs, products, invoices
- Technician: service jobs, measurements, technician notes
- Cashier: invoices, payments, expenses

Required features:
1. Login page
2. Logout function
3. Protected admin routes
4. User list page
5. Create user page
6. Edit user page
7. Disable/enable user
8. Role assignment
9. Permission checking
10. Hide unauthorized menus/actions
11. Prevent unauthorized API access

User fields:
- id
- name
- email or username
- password
- role
- status
- createdAt
- updatedAt

Frontend structure:
- Reuse features/auth if available
- Use features/users for user management if needed
- app route page.tsx must only import main feature component

Backend structure:
- Reuse src/modules/auth if available
- Use existing users/admins module if available
- Follow controller/service/repository/module pattern

UI/UX:
- Login page should be mobile-friendly
- Admin pages must be protected
- Support Khmer/English translation
- Support light/dark theme
- Mobile layout should be touch-friendly

Before coding:
1. Review existing auth module first
2. Explain what already exists
3. List files to create/update
4. Then implement only missing parts
```
