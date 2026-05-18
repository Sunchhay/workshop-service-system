# Step 12 — Module 6: Model & Part Reference Book Prompt

```text
Using the Father Business Management System context, build Module 6: Model & Part Reference Book.

Purpose:
Replace the manual notebook used by the business to record technical part/component sizes and notes.

This is the technical knowledge base for model, component, part size, measurement, compatible products, and related services.

Frontend routes:
- app/(admin)/admin/reference-book/page.tsx
- app/(admin)/admin/reference-book/create/page.tsx
- app/(admin)/admin/reference-book/[id]/page.tsx
- app/(admin)/admin/reference-book/[id]/edit/page.tsx

Frontend feature:
features/reference-book
  components
    ReferenceBookPage.tsx
    ReferenceBookCreatePage.tsx
    ReferenceBookEditPage.tsx
    ReferenceBookDetailPage.tsx
    ReferenceBookForm.tsx
    ReferenceBookTable.tsx
    ReferenceBookMobileCard.tsx
    MeasurementFields.tsx
    dialogs
      DeleteReferenceRecordDialog.tsx
      VerifyReferenceRecordDialog.tsx
  api.ts
  types.ts

Backend module:
src/modules/reference-book
  dto
    create-reference-book.dto.ts
    update-reference-book.dto.ts
    query-reference-book.dto.ts
  reference-book.controller.ts
  reference-book.service.ts
  reference-book.repository.ts
  reference-book.module.ts

Reference fields:
- id
- modelId
- componentType
- partName
- partCode
- standardSize
- availableSize
- unit
- measurementDetails
- compatibleProducts
- relatedServices
- sourceType
- verificationStatus
- note
- attachment
- createdAt
- updatedAt

Source types:
- Mom Notebook
- Supplier Info
- Real Measurement
- Service History
- Service Manual
- Other

Verification statuses:
- Draft
- Pending Review
- Verified
- Old Data

Measurement details:
Use flexible JSON/key-value format.

Example measurement details:
- Diameter: 52.4 mm
- Pin Size: 13 mm
- Height: 38 mm
- Surface Condition: Uneven
- Before Thickness: 20 mm
- After Thickness: 19.8 mm

Features:
1. Reference list
2. Create reference record
3. Edit reference record
4. Reference detail
5. Link to machine/model
6. Add component type
7. Add part name/code
8. Add standard size and available size
9. Add flexible measurement fields
10. Add source type
11. Add verification status
12. Add note
13. Search by model, component, part name, size
14. Filter by source type and verification status

Validation:
- Component type is required
- Source type is required
- Verification status is required
- Model is optional because some records may not have known model yet

Mobile UX:
- Desktop uses table
- Mobile uses card list
- Dynamic measurement fields should be easy to add/remove on mobile
- Save button sticky at bottom on mobile

Before coding:
1. Review existing module pattern
2. List files to create/update
3. Then implement step by step
```
