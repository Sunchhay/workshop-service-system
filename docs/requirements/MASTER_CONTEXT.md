I want to start coding my project step by step. Please act as my senior full-stack engineer and help me set up and build the project carefully.

Project Name:
Workshop Service Management System

Project Context:
This is a web-based system for a part/component service workshop, not a full vehicle repair system.

Customers bring parts/components such as:
- Cylinder
- Cylinder head
- Piston-related parts
- Bearing-related parts
- Shaft
- Other machine or engine components

The workshop provides services such as:
- Replace pipe cylinder
- Bore cylinder
- Smooth cylinder head surface
- Smooth cylinder block surface
- Check cylinder size
- Match piston with cylinder
- Surface smoothing / resurfacing
- Other custom workshop services

The system must support:
- Authentication & role permission
- Customer management
- Service management
- Price catalog management
- Machine/model reference management
- Model & part reference book
- Service job management
- Printable service work sheet
- Product/inventory management
- Direct sales/order management
- Invoice management
- Payment management
- Expense management
- Dashboard
- Reports
- Settings
- Khmer/English translation
- Light/dark theme
- Mobile responsive layout
- PWA support

Important Business Rule:
Separate reference data, service data, product/inventory data, and financial data, but allow them to connect together.

Do not design this as a full car repair system. It is a part/component service workshop system.

Technology Stack:
Frontend:
- Next.js App Router
- Shadcn UI
- Tailwind CSS
- Redux Toolkit / RTK Query
- React Hook Form
- Zod
- Lucide React
- Khmer/English translation
- Light/dark theme
- PWA support

Backend:
- NestJS
- Prisma
- PostgreSQL
- REST API
- JWT authentication
- Role-based permission
- Controller / Service / Repository pattern

Project Folder Structure:
I want to use one parent folder with frontend and backend separated:

workshop-service-system/
  apps/
    web/  -> Next.js frontend
    api/  -> NestJS backend API
  docs/   -> requirements, prompts, decisions

Important Folder Rules:
- Frontend files must be created under apps/web
- Backend files must be created under apps/api
- Do not mix frontend files into backend
- Do not mix backend files into frontend
- Prisma schema must be inside apps/api/prisma/schema.prisma
- Next.js admin pages must be inside apps/web/app/(admin)/admin
- Frontend feature logic must be inside apps/web/features/[module]
- Backend modules must be inside apps/api/src/modules/[module]

Frontend Code Organization Rule:
For every admin route, page.tsx should be small and only import the main feature page component.

Example:
apps/web/app/(admin)/admin/customers/page.tsx

Should only contain something like:
import CustomerPage from "@/features/customers/components/CustomerPage";

export default function Page() {
  return <CustomerPage />;
}

Do not put full page logic directly inside app route page.tsx.

Feature structure example:
apps/web/features/customers
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
  slice.ts only if needed

Dialog Rule:
Dialogs are allowed only for small actions such as:
- Delete confirmation
- Disable confirmation
- Cancel confirmation
- Status update
- Record payment
- Quick warning

Do not use dialog/modal for:
- Create customer
- Edit customer
- Create service job
- Create invoice
- Edit product

Create/edit/detail should be separate pages.

Backend Code Organization Rule:
Each backend module should follow this structure:

apps/api/src/modules/customers
  dto
    create-customer.dto.ts
    update-customer.dto.ts
    query-customer.dto.ts
  customers.controller.ts
  customers.service.ts
  customers.repository.ts
  customers.module.ts

Backend rules:
- Controller handles routes only
- Service handles business logic
- Repository handles Prisma/database queries
- DTO files handle request validation
- Do not put all backend logic inside controller
- Follow NestJS best practice

Mobile Responsive & PWA UX Requirement:
Desktop should feel like a clean admin dashboard.
Mobile should feel like an installed PWA/mobile app.

Desktop:
- Sidebar navigation
- Top header
- Table layout is allowed
- Filters at top
- Multi-column forms are allowed when suitable

Mobile:
- App-style header
- Back button on create/edit/detail pages
- Bottom navigation or sticky quick action when suitable
- Card list instead of wide table
- One-column forms
- Large touch-friendly buttons
- Sticky bottom primary action button where useful
- No hover-only actions
- No horizontal overflow
- No modal for create/edit
- Support safe-area padding for PWA
- Use Load More or infinite scroll for long lists

Translation Requirement:
- Support Khmer and English
- Use translation keys
- Do not hardcode UI labels, buttons, menu names, table headers, validation messages, empty states, or errors
- Service names can be Khmer or English because admin manages them dynamically

Theme Requirement:
- Support light mode and dark mode
- Use Shadcn UI and Tailwind theme tokens
- Keep design consistent on desktop and mobile

Authentication Requirement:
The system must require login before users can access business data.

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

Permission examples:
- Manage Customers
- Manage Services
- Manage Price Catalog
- Manage Machine Models
- Manage Reference Book
- Manage Service Jobs
- Manage Products
- Manage Invoices
- Manage Payments
- Adjust Price
- Give Discount
- Manage Expenses
- View Reports
- Manage Settings

Development Rule:
Do not build the full system at once.
Build step by step.
Before generating code, always:
1. Review the current project structure
2. List files/folders to create or update
3. Explain what each file is responsible for
4. Then generate code step by step
5. Do not rewrite unrelated files
6. Do not change existing behavior unless necessary

Recommended Development Order:
1. Project setup
2. Authentication & User Management
3. Admin Layout / Navigation
4. Customer Management
5. Service Management
6. Price Catalog Management
7. Machine / Model Management
8. Model & Part Reference Book
9. Service Job Management
10. Printable Service Work Sheet
11. Product / Inventory Management
12. Invoice Management
13. Payment Management
14. Direct Sales / Order Management
15. Expense Management
16. Dashboard
17. Reports
18. PWA polish

For now, I want to start from project setup.

Please help me set up the project first.

First Task:
Guide me to create the base project structure:

workshop-service-system/
  apps/
    web/
    api/
  docs/
    prompts/
    requirements/
    decisions/

Then help me set up:
1. Next.js frontend inside apps/web
2. NestJS backend inside apps/api
3. Prisma inside apps/api
4. Basic docs files:
   - docs/requirements/MASTER_CONTEXT.md
   - docs/decisions/PROJECT_DECISIONS.md
5. Recommended package installation
6. Recommended dev commands
7. Recommended first commit

Important:
Do not start business modules yet.
Start only with project setup.
Give me commands step by step.
After each step, wait for me to confirm before continuing.