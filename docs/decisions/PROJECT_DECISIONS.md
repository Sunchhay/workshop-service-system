# Project Decisions

## System Name

Workshop Service Management System

## Folder Structure

Use one parent folder with frontend and backend separated:

```text
workshop-service-system/
  apps/
    web/  -> Next.js frontend
    api/  -> NestJS backend API
  docs/   -> requirements, prompts, decisions
```

## Frontend Rules

- Frontend files must be created under `apps/web`.
- Next.js admin pages must be inside `apps/web/app/(admin)/admin`.
- Frontend feature logic must be inside `apps/web/features/[module]`.
- `page.tsx` should stay small and only import the main feature page component.
- Main UI logic should stay inside `features/[module]/components`.
- Use dialogs only for small actions.
- Do not use dialog/modal for create/edit forms.
- Create/edit/detail should be separate pages.

## Backend Rules

- Backend files must be created under `apps/api`.
- Backend modules must be inside `apps/api/src/modules/[module]`.
- Prisma schema must be inside `apps/api/prisma/schema.prisma`.
- Backend must follow controller/service/repository/dto/module pattern.
- Controller handles routes only.
- Service handles business logic.
- Repository handles Prisma/database queries.

## UI/UX Rules

- Desktop should feel like a clean admin dashboard.
- Mobile should feel like an installed PWA/mobile app.
- Mobile list pages should use card lists instead of wide tables.
- Mobile create/edit/detail pages should have app-style header and back button.
- Use sticky bottom primary action button where useful.
- Support safe-area padding for PWA.

## Translation & Theme

- Support Khmer and English.
- Use translation keys.
- Do not hardcode UI labels, buttons, menu names, table headers, validation messages, empty states, or errors.
- Support light mode and dark mode.
- Use Shadcn UI and Tailwind theme tokens.

## Roles

- Admin
- Staff
- Technician
- Cashier

## Important Naming

Use consistent terms:

- Customer
- Service
- Price Catalog
- Machine / Model
- Reference Book
- Service Job
- Service Work Sheet
- Product
- Invoice
- Payment
- Expense
