# Step 11 — Module 5: Machine / Model Management Prompt

```text
Using the Father Business Management System context, build Module 5: Machine / Model Management.

Purpose:
Manage machine/model reference records. This is for reference only, not full vehicle repair.

The business will start with common/famous models first and add new models when needed.

Frontend routes:
- app/(admin)/admin/models/page.tsx
- app/(admin)/admin/models/create/page.tsx
- app/(admin)/admin/models/[id]/page.tsx
- app/(admin)/admin/models/[id]/edit/page.tsx

Frontend feature:
features/models
  components
    ModelPage.tsx
    ModelCreatePage.tsx
    ModelEditPage.tsx
    ModelDetailPage.tsx
    ModelForm.tsx
    ModelTable.tsx
    ModelMobileCard.tsx
    dialogs
      DeleteModelDialog.tsx
      DisableModelDialog.tsx
  api.ts
  types.ts

Backend module:
src/modules/models
  dto
    create-model.dto.ts
    update-model.dto.ts
    query-model.dto.ts
  models.controller.ts
  models.service.ts
  models.repository.ts
  models.module.ts

Model fields:
- id
- brand
- modelName
- modelCode
- machineType
- yearVersion
- description
- photo
- status
- createdAt
- updatedAt

Features:
1. Model list
2. Create model
3. Edit model
4. Model detail
5. Search by brand, model name, model code
6. Filter by machine type and status
7. Active/inactive status

Validation:
- Brand is required
- Model name is required
- Machine type is required
- Model code is optional

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
