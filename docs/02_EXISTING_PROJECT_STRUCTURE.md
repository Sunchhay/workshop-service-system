# Step 2 — Existing Project Structure Prompt

```text
Existing Project Structure:

Frontend:
- Admin routes are inside app/(admin)/admin
- Public routes are inside app/(public)
- API proxy exists at app/api/proxy/[...path]/route.ts
- Feature logic is inside features/[module]

Current frontend pattern example:
app/(admin)/admin/drivers/page.tsx
→ imports DriverPage from features/drivers/components/DriverPage.tsx

features/drivers
  components
    dialogs
    DriverForm.tsx
    DriverPage.tsx
  api.ts
  types.ts

Important frontend rule:
- app route page.tsx should stay small
- page.tsx should only import the main feature page component
- Do not put full page logic directly inside app route page.tsx
- Put main UI and business UI logic inside features/[module]/components
- Put API logic inside features/[module]/api.ts
- Put TypeScript types inside features/[module]/types.ts
- Put dialogs inside features/[module]/components/dialogs
- Use slice.ts only if Redux local state is really needed

Backend:
- NestJS modules are inside src/modules
- Follow this existing pattern:
src/modules/[module]
  dto
  [module].controller.ts
  [module].service.ts
  [module].repository.ts
  [module].module.ts

Backend rule:
- Controller handles routes only
- Service handles business logic
- Repository handles Prisma/database queries
- DTO files handle request validation
- Do not put all backend logic inside controller
- Do not create a new architecture
- Follow existing module style
```
