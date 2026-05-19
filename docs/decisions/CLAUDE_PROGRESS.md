# Workshop Service System — Claude Progress Snapshot

> Last updated: 2026-05-19

---

## 1. Project Overview

**Project name:** Workshop Service System

**Purpose:** Business management system for a family/father workshop. Manages service jobs, customers, products, invoices, payments, expenses, and reporting. Supports Khmer and English (bilingual).

**Folder structure:**
```
workshop-service-system/
├── apps/
│   ├── api/          ← NestJS 11 backend
│   └── web/          ← Next.js 16 frontend (PWA)
├── docs/
│   └── decisions/    ← Architecture decisions and progress notes
└── README.md
```

**Tech stack:**

| Layer | Technology |
|---|---|
| Backend | NestJS 11, Prisma 7, PostgreSQL, JWT, bcrypt, passport-jwt |
| Frontend | Next.js 16 (App Router), Redux Toolkit v2, RTK Query, shadcn/ui (radix-nova) |
| Database | PostgreSQL 16 via Docker |
| ORM | Prisma 7 with `@prisma/adapter-pg` + `pg.Pool` |
| Auth | JWT (access token in localStorage for MVP) |
| UI | shadcn/ui radix-nova style, Tailwind CSS v4, lucide-react icons |
| Fonts | Geist Sans + Noto Sans Khmer |
| i18n | Custom React Context (en.json + km.json) |
| State | Redux Toolkit + RTK Query |
| Forms | react-hook-form + zod/v4 + @hookform/resolvers |
| Toasts | sonner |
| Theme | next-themes (light/dark/system) |

---

## 2. Current Setup Status

### Infrastructure
- **Docker:** PostgreSQL running via Docker Compose on port 5433 (mapped from container 5432)
- **Database:** `workshop_db` database created and migrated
- **Prisma:** Schema defined, migrations applied, client generated

### Backend (apps/api)
- NestJS project initialized and running on port 4000
- Global prefix: `/api`
- CORS enabled for `http://localhost:3000`
- Global guards: `JwtAuthGuard` → `RolesGuard` (APP_GUARD order)
- Global pipes: `ValidationPipe` (whitelist, transform, enableImplicitConversion)
- Global filters: `AllExceptionsFilter` (structured error responses)
- Prisma using `@prisma/adapter-pg` with `pg.Pool`
- JWT configured (7d expiry by default)
- All modules registered in `AppModule`

### Frontend (apps/web)
- Next.js 16 App Router project running on port 3000
- Route groups: `(public)` for login, `(admin)` for protected pages
- API proxy at `app/api/proxy/[...path]/route.ts` → forwards to backend
- Redux store configured with RTK Query
- shadcn/ui installed (radix-nova style)
- Geist Sans + Noto Sans Khmer fonts loaded
- Light/dark theme working via next-themes
- Translation system working (en/km stored in localStorage)
- Mobile bottom nav + desktop sidebar layout working
- PWA manifest present

### Auth persistence (FIXED)
- Token saved to `localStorage` key: `workshop_access_token`
- On app load: `StoreProvider.HydrateAuth` reads localStorage → dispatches `hydrateAuth(token)`
- `AuthGuard` waits for `isHydrated`, then calls `/auth/me` to verify token
- If valid → user set as authenticated; if invalid → logout + redirect to `/login`

---

## 3. Files Created or Updated

### Backend

**Auth module** (`apps/api/src/modules/auth/`):
- `auth.controller.ts` — POST /auth/login, GET /auth/me
- `auth.service.ts` — login validation, bcrypt compare, JWT sign
- `auth.repository.ts` — findByEmailWithPassword, findById
- `auth.module.ts`
- `dto/login.dto.ts`
- `strategies/jwt.strategy.ts`

**Users module** (`apps/api/src/modules/users/`):
- `users.controller.ts` — CRUD + status endpoints, ADMIN role only
- `users.service.ts` — business logic, bcrypt hash
- `users.repository.ts` — safe select (no password)
- `users.module.ts`
- `dto/create-user.dto.ts`
- `dto/update-user.dto.ts`
- `dto/query-user.dto.ts`

**Customers module** (`apps/api/src/modules/customers/`):
- `customers.controller.ts` — GET/POST/PATCH/DELETE endpoints, all authenticated
- `customers.service.ts` — business logic (phone uniqueness, code generation, soft delete)
- `customers.repository.ts` — safe select (no deletedAt in response), soft delete
- `customers.module.ts`
- `dto/create-customer.dto.ts`
- `dto/update-customer.dto.ts`
- `dto/query-customer.dto.ts`

**Common** (`apps/api/src/common/`):
- `guards/jwt-auth.guard.ts`
- `guards/roles.guard.ts`
- `decorators/current-user.decorator.ts`
- `decorators/public.decorator.ts`
- `decorators/roles.decorator.ts`
- `filters/http-exception.filter.ts`
- `types/api-response.type.ts` — `createResponse`, `createPaginatedResponse`
- `types/jwt-payload.type.ts`

**Database** (`apps/api/prisma/`):
- `schema.prisma` — full schema with all models
- `seed.ts` — idempotent seed for 4 test users (ADMIN, STAFF, TECHNICIAN, CASHIER)

**Root config:**
- `apps/api/src/app.module.ts` — AuthModule + UsersModule + CustomersModule registered

### Frontend

**Auth feature** (`apps/web/features/auth/`):
- `types.ts` — AuthUser, AuthState (with isHydrated), LoginRequest, LoginResponse
- `authSlice.ts` — setCredentials (persists token), hydrateAuth, setAuthenticatedUser, logout
- `api.ts` — useLoginMutation, useGetMeQuery
- `components/LoginPage.tsx` — redirect if already logged in
- `components/AuthGuard.tsx` — waits for hydration, calls /auth/me

**Users feature** (`apps/web/features/users/`):
- `types.ts`, `api.ts`
- `components/UserPage.tsx` — list with search/filter/pagination
- `components/UserCreatePage.tsx`
- `components/UserEditPage.tsx`
- `components/UserDetailPage.tsx`
- `components/UserForm.tsx` — create/edit shared form
- `components/UserTable.tsx` — desktop table
- `components/UserMobileCard.tsx` — mobile card
- `components/dialogs/DisableUserDialog.tsx`

**Customers feature** (`apps/web/features/customers/`):
- `types.ts`, `api.ts`
- `components/CustomerPage.tsx` — list with search/type filter/status filter/pagination
- `components/CustomerCreatePage.tsx`
- `components/CustomerEditPage.tsx`
- `components/CustomerDetailPage.tsx` — with service/payment history placeholders
- `components/CustomerForm.tsx` — 2-column grid on desktop, 1-column on mobile
- `components/CustomerTable.tsx` — desktop table
- `components/CustomerMobileCard.tsx` — mobile card
- `components/dialogs/DeleteCustomerDialog.tsx`
- `components/dialogs/DisableCustomerDialog.tsx`

**Layout** (`apps/web/components/layout/`):
- `AdminShell.tsx` — wraps content with AuthGuard, dual layout
- `DesktopSidebar.tsx` — w-60 sidebar with nav items
- `DesktopHeader.tsx` — top bar with LanguageSwitcher, ThemeToggle, UserMenu
- `MobileHeader.tsx` — title + back button
- `MobileBottomNav.tsx` — 4 items + More button
- `MoreMenu.tsx` — bottom sheet with secondary nav items
- `UserMenu.tsx` — avatar dropdown with logout
- `LanguageSwitcher.tsx` — EN/KM dropdown

**Store** (`apps/web/lib/store/`):
- `store.ts`, `hooks.ts`

**API** (`apps/web/lib/api/`):
- `baseApi.ts` — tagTypes: ['User', 'Customer'], prepareHeaders with JWT
- `types.ts` — ApiResponse, ApiPaginatedResponse

**UI components** (`apps/web/components/ui/`):
- All standard shadcn/ui components installed (button, input, form, select, card, table, badge, alert-dialog, dropdown-menu, sheet, scroll-area, separator, skeleton, sonner, switch, textarea, etc.)
- Sizing updated: button h-10/h-11, input h-11, select h-11, table rows h-11/py-3, card px-5/py-5

**i18n** (`apps/web/locales/`):
- `en.json` — common, auth, nav, dashboard, theme, language, users, roles, customers, customerTypes
- `km.json` — same keys in Khmer

**Providers** (`apps/web/components/providers/`):
- `StoreProvider.tsx` — HydrateAuth reads localStorage on mount
- `ThemeProvider.tsx`

**Route pages** (`apps/web/app/`):
- `(public)/login/page.tsx`
- `(admin)/admin/page.tsx` — dashboard placeholder
- `(admin)/admin/layout.tsx` — AdminShell wrapper
- `(admin)/admin/users/page.tsx` + `create/page.tsx` + `[id]/page.tsx` + `[id]/edit/page.tsx`
- `(admin)/admin/customers/page.tsx` + `create/page.tsx` + `[id]/page.tsx` + `[id]/edit/page.tsx`

### Database / Docker
- `docker-compose.yml` at project root — PostgreSQL 16 on port 5433
- Prisma migrations applied
- Seed data: 4 users (admin@, staff@, technician@, cashier@ — all @workshop.local)

---

## 4. What Is Done

- [x] Docker + PostgreSQL setup
- [x] Prisma schema (all models defined)
- [x] Prisma migrations applied
- [x] Seed data (4 test users for all roles)
- [x] NestJS backend bootstrapped
- [x] JWT authentication (login + /auth/me)
- [x] Global JWT guard + Roles guard
- [x] Users module CRUD (ADMIN only)
- [x] Customers module CRUD (all authenticated users)
- [x] Next.js App Router setup
- [x] API proxy route
- [x] Redux store + RTK Query
- [x] Auth persistence (localStorage + /auth/me on refresh)
- [x] Login page with redirect if already logged in
- [x] AuthGuard with loading state during token verification
- [x] Admin layout (desktop sidebar + mobile bottom nav + more sheet)
- [x] User management UI (list, create, edit, detail, enable/disable)
- [x] Customer management UI (list, create, edit, detail, enable/disable, delete)
- [x] Light/dark theme
- [x] Bilingual (EN/KM) with localStorage persistence
- [x] Mobile-first PWA-like layout
- [x] shadcn/ui with comfortable sizing (44px inputs/buttons)
- [x] Geist Sans + Noto Sans Khmer fonts

---

## 5. What Is Partially Done / Needs Review

- **Dashboard page** — placeholder only (shows welcome message, no real data)
- **Customer service history** — placeholder in detail page (shows "Coming soon")
- **Customer payment history** — placeholder in detail page (shows "Coming soon")
- **Phone uniqueness** — enforced in service layer only (not at DB level via `@unique`)
- **Customer code generation** — uses `findFirst orderBy createdAt desc` (not transactional; low collision risk for MVP)
- **Login page** — pre-fills `admin@workshop.local / Admin@123` for development convenience (remove before production)

---

## 6. What Is Not Done Yet

| Module | Status |
|---|---|
| Service Catalog | Not started |
| Price Catalog | Not started |
| Machine Models | Not started |
| Reference Book | Not started |
| Service Jobs | Not started |
| Products / Inventory | Not started |
| Invoices | Not started |
| Payments | Not started |
| Direct Sales | Not started |
| Expenses | Not started |
| Dashboard (real data) | Not started |
| Reports | Not started |
| PWA polish (offline, install prompt) | Not started |
| Role-based UI access control | Not started |
| Audit logging | Not started |
| Refresh token / httpOnly cookie | Not started (localStorage is current MVP approach) |

---

## 7. Current Problems / Notes

1. **Pre-existing e2e test error** in `apps/api/test/app.e2e-spec.ts` — `supertest` import type issue. Not caused by our code, does not affect runtime. Can be fixed later.

2. **Docker must be running** before starting the API. After computer restart, start Docker Desktop first, then wait for the PostgreSQL container to be healthy before running `npm run start:dev`.

3. **Database port**: PostgreSQL runs on host port **5433** (not 5432). The `DATABASE_URL` in `apps/api/.env` should reflect this.

4. **Prisma uses pg adapter**: `@prisma/adapter-pg` with `pg.Pool`. This is configured in `PrismaService`. Do not use standard `PrismaClient` directly.

5. **JWT secret**: Set in `apps/api/.env` as `JWT_SECRET`. Do not hardcode.

6. **Module format**: Prisma generated client uses `moduleFormat = "cjs"` and outputs to `apps/api/src/generated/prisma/`. Import enums from `../../generated/prisma/enums`.

7. **radix-nova shadcn style**: Uses unified `radix-ui` package (not individual `@radix-ui/react-*`). `asChild` uses `Slot.Root`. Components use `data-slot` attributes.

8. **zod version**: Frontend uses `zod/v4` — import as `import { z } from 'zod/v4'`.

9. **Next.js params are async**: In App Router, `params` is a `Promise`. Always `await params` in server components.

---

## 8. Next Step After Restart

1. **Open Docker Desktop** and wait for it to start
2. **Start PostgreSQL container:**
   ```bash
   cd /Users/sunchhay/Documents/workshop-service-system
   docker compose up -d
   ```
3. **Verify container is running:**
   ```bash
   docker ps
   ```
4. **Start backend API:**
   ```bash
   cd apps/api
   npm run start:dev
   ```
5. **Start frontend:**
   ```bash
   cd apps/web
   npm run dev
   ```
6. **Open browser:** `http://localhost:3000`
7. **Login:** `admin@workshop.local` / `Admin@123`
8. **Start Claude Code** from project root:
   ```bash
   cd /Users/sunchhay/Documents/workshop-service-system
   claude
   ```
9. **Continue with next module:** Service Catalog or Machine Models (whichever is next in priority)

---

## 9. Useful Commands

```bash
# Start Docker services
docker compose up -d

# Check running containers
docker ps

# Start backend (from apps/api)
npm run start:dev

# Start frontend (from apps/web)
npm run dev

# Prisma commands (from apps/api)
npx prisma validate
npx prisma generate
npx prisma migrate dev --name <migration_name>
npx prisma migrate deploy
npx prisma db seed
npx prisma studio   # Visual database browser at http://localhost:5555

# TypeScript checks
cd apps/api && npx tsc --noEmit
cd apps/web && npx tsc --noEmit

# Git
git status
git log --oneline -10

# Seed test users
cd apps/api && npx prisma db seed
```

### Test Users (after seeding)

| Role | Email | Password |
|---|---|---|
| Admin | admin@workshop.local | Admin@123 |
| Staff | staff@workshop.local | Staff@123 |
| Technician | technician@workshop.local | Technician@123 |
| Cashier | cashier@workshop.local | Cashier@123 |
