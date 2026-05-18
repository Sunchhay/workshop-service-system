# Master Feature Prompt

Use this at the start of every new feature chat.

```text
Using the Workshop Service Management System context, build [MODULE NAME].

Project context:
This is a part/component service workshop system, not a full vehicle repair system.
Customers bring parts/components such as cylinder, cylinder head, piston-related parts, bearing-related parts, shaft, or other machine components.
The workshop provides services such as replacing pipe cylinder, boring cylinder, smoothing cylinder head surface, checking size, matching piston with cylinder, and other custom services.

Technology stack:
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

Existing frontend structure:
- Admin routes are inside apps/web/app/(admin)/admin
- Feature logic is inside apps/web/features/[module]
- app route page.tsx should only import the main feature page component
- Main UI logic should be inside features/[module]/components
- Use dialogs only for small confirmation/action dialogs
- Do not use modal for create/edit pages

Existing backend structure:
- Modules are inside apps/api/src/modules
- Follow controller/service/repository/module pattern
- Use dto folder for DTO files
- Use Prisma schema in apps/api/prisma/schema.prisma

UI/UX:
- Desktop should feel like admin dashboard
- Mobile should feel like installed PWA/mobile app
- Desktop can use tables
- Mobile must use card lists
- Create/edit/detail pages must be separate pages
- Use app-style mobile header and back button
- Use sticky bottom action button where useful
- Support loading, empty, and error states
- Use translation keys, no hardcoded text
- Support light/dark theme

Important:
Build only this module.
Do not build unrelated modules.
Do not rewrite unrelated files.
Before coding, review existing pattern and list files to create/update.
```
