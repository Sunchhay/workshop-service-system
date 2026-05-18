# Step 10 — Module 4: Price Catalog Management Prompt

```text
Using the Father Business Management System context, build Module 4: Price Catalog Management.

Purpose:
Manage standard service prices. Prices may depend on service, component, size, difficulty, customer type, currency, and effective date.

Frontend routes:
- app/(admin)/admin/price-catalog/page.tsx
- app/(admin)/admin/price-catalog/create/page.tsx
- app/(admin)/admin/price-catalog/[id]/page.tsx
- app/(admin)/admin/price-catalog/[id]/edit/page.tsx

Frontend feature:
features/price-catalog
  components
    PriceCatalogPage.tsx
    PriceCatalogCreatePage.tsx
    PriceCatalogEditPage.tsx
    PriceCatalogDetailPage.tsx
    PriceCatalogForm.tsx
    PriceCatalogTable.tsx
    PriceCatalogMobileCard.tsx
    dialogs
      DeletePriceCatalogDialog.tsx
      DisablePriceCatalogDialog.tsx
  api.ts
  types.ts

Backend module:
src/modules/price-catalog
  dto
    create-price-catalog.dto.ts
    update-price-catalog.dto.ts
    query-price-catalog.dto.ts
  price-catalog.controller.ts
  price-catalog.service.ts
  price-catalog.repository.ts
  price-catalog.module.ts

Price catalog fields:
- id
- serviceId
- priceName
- componentType
- sizeRangeFrom
- sizeRangeTo
- difficultyLevel
- customerType
- price
- currency
- priceType
- effectiveDate
- endDate
- status
- note
- createdAt
- updatedAt

Difficulty levels:
- normal
- difficult
- special

Customer types:
- normal
- VIP
- wholesale
- partner

Currency:
- USD
- KHR

Features:
1. Price catalog list
2. Create price record
3. Edit price record
4. Price detail
5. Link price record to service
6. Create multiple prices for one service
7. Filter by service, component, customer type, status
8. Active/inactive price records
9. Keep old price history
10. Add endpoint or helper to suggest price later in service job

Validation:
- Service is required
- Price name is required
- Price is required
- Currency is required
- Effective date is required
- End date must be after effective date if provided

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
