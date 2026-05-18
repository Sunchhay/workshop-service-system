# Step 4 — Code Organization Rule Prompt

```text
Code Organization Rule:

Do not put all logic in one file.

Frontend:
- app route page.tsx should be small
- page.tsx should only import the main feature page component
- Put main UI logic inside features/[module]/components
- Put reusable forms in features/[module]/components/[Module]Form.tsx
- Put desktop table in features/[module]/components/[Module]Table.tsx
- Put mobile card in features/[module]/components/[Module]MobileCard.tsx
- Put detail UI in features/[module]/components/[Module]DetailPage.tsx
- Put create page UI in features/[module]/components/[Module]CreatePage.tsx
- Put edit page UI in features/[module]/components/[Module]EditPage.tsx
- Put confirmation/small action dialogs in features/[module]/components/dialogs
- Put API logic in features/[module]/api.ts
- Put TypeScript types in features/[module]/types.ts
- Use slice.ts only if local Redux state is needed
- Use translation keys, no hardcoded text
- Support light/dark theme
- Support mobile/PWA responsive layout

Backend:
- Use separate DTO files
- Controller should handle routes only
- Service should handle business logic
- Repository should handle Prisma/database queries
- Module file should register the module
- Do not put all backend logic in controller
- Follow existing NestJS module pattern

Before coding:
1. Review existing module pattern
2. List files to create/update
3. Explain what each file is responsible for
4. Then implement step by step
5. Do not rewrite unrelated files
```
