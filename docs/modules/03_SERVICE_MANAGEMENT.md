# Step 9 — Module 3: Service Management Prompt

```text
Using the Father Business Management System context, build Module 3: Service Management.

Purpose:
Allow admin to manage workshop services dynamically. Services may be Khmer or English and should not be hardcoded.

Example services:
- ដូរសំបកស៊ីឡាំង
- ខាត់ស៊ីឡាំង
- លាងមុខក្បាលស៊ីឡាំង
- Replace pipe cylinder
- Bore cylinder
- Smooth cylinder head surface
- Smooth cylinder block surface
- Check cylinder size
- Match piston with cylinder

Frontend routes:
- app/(admin)/admin/services/page.tsx
- app/(admin)/admin/services/create/page.tsx
- app/(admin)/admin/services/[id]/page.tsx
- app/(admin)/admin/services/[id]/edit/page.tsx

Frontend feature:
features/services
  components
    ServicePage.tsx
    ServiceCreatePage.tsx
    ServiceEditPage.tsx
    ServiceDetailPage.tsx
    ServiceForm.tsx
    ServiceTable.tsx
    ServiceMobileCard.tsx
    dialogs
      DeleteServiceDialog.tsx
      DisableServiceDialog.tsx
  api.ts
  types.ts

Backend module:
src/modules/services
  dto
    create-service.dto.ts
    update-service.dto.ts
    query-service.dto.ts
  services.controller.ts
  services.service.ts
  services.repository.ts
  services.module.ts

Service fields:
- id
- serviceName
- serviceCategory
- relatedComponent
- defaultPrice
- priceType
- description
- status
- createdAt
- updatedAt

Price types:
- fixed
- catalog-based
- custom

Features:
1. Service list
2. Create service
3. Edit service
4. Service detail
5. Search by service name/category/component
6. Filter by status/category/component
7. Activate/inactivate service
8. Support Khmer service name input

Validation:
- Service name is required
- Service category is required
- Price type is required
- Default price must be number if provided

Mobile UX:
- Desktop uses table
- Mobile uses card list
- Create/edit/detail use app header and back button
- Save button sticky at bottom on mobile

Important:
Inactive services should not be shown later in service job selection.

Before coding:
1. Review existing feature module pattern
2. List files to create/update
3. Then implement step by step
```
