# Step 8 — Module 2: Customer Management Prompt

```text
Using the Father Business Management System context, build Module 2: Customer Management.

Purpose:
Manage customer information for service jobs, invoices, payments, and service history.

Frontend routes:
- app/(admin)/admin/customers/page.tsx
- app/(admin)/admin/customers/create/page.tsx
- app/(admin)/admin/customers/[id]/page.tsx
- app/(admin)/admin/customers/[id]/edit/page.tsx

Frontend feature:
features/customers
  components
    CustomerPage.tsx
    CustomerCreatePage.tsx
    CustomerEditPage.tsx
    CustomerDetailPage.tsx
    CustomerForm.tsx
    CustomerTable.tsx
    CustomerMobileCard.tsx
    dialogs
      DeleteCustomerDialog.tsx
      DisableCustomerDialog.tsx
  api.ts
  types.ts

Backend module:
src/modules/customers
  dto
    create-customer.dto.ts
    update-customer.dto.ts
    query-customer.dto.ts
  customers.controller.ts
  customers.service.ts
  customers.repository.ts
  customers.module.ts

Customer fields:
- id
- name
- phone
- address
- customerType
- note
- status
- createdAt
- updatedAt

Features:
1. Customer list
2. Create customer
3. Edit customer
4. Customer detail
5. Search by name and phone
6. Filter by status/customer type
7. View customer service history placeholder
8. View customer payment history placeholder
9. Delete or disable customer

Validation:
- Customer name is required
- Phone number is required
- Customer type default is Normal
- Phone number should be unique if possible

Mobile UX:
- Desktop uses table layout
- Mobile uses card list
- Create/edit/detail pages have mobile app header and back button
- Save button sticky at bottom on mobile
- No modal for create/edit
- No horizontal overflow

Translation:
- Use translation keys for all labels, buttons, table headers, empty states, errors, and validation messages
- Support Khmer and English

Theme:
- Support light/dark mode
- Use Shadcn UI and Tailwind theme tokens

Before coding:
1. Review existing drivers/users module pattern
2. List all files to create/update
3. Then implement step by step
```
