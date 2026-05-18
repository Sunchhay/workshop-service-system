# Step 15 — Module 9: Product / Inventory Management Prompt

```text
Using the Father Business Management System context, build Module 9: Product / Inventory Management.

Purpose:
Manage products/spare parts sold or used by the workshop.

Products are separate from technical reference data, but can be linked to model/part reference records.

Frontend routes:
- app/(admin)/admin/products/page.tsx
- app/(admin)/admin/products/create/page.tsx
- app/(admin)/admin/products/[id]/page.tsx
- app/(admin)/admin/products/[id]/edit/page.tsx

Frontend feature:
features/products
  components
    ProductPage.tsx
    ProductCreatePage.tsx
    ProductEditPage.tsx
    ProductDetailPage.tsx
    ProductForm.tsx
    ProductTable.tsx
    ProductMobileCard.tsx
    dialogs
      DeleteProductDialog.tsx
      AdjustStockDialog.tsx
  api.ts
  types.ts

Backend module:
src/modules/products
  dto
    create-product.dto.ts
    update-product.dto.ts
    query-product.dto.ts
    adjust-stock.dto.ts
  products.controller.ts
  products.service.ts
  products.repository.ts
  products.module.ts

Product fields:
- id
- productName
- productCode
- category
- brand
- componentPartType
- size
- costPrice
- sellingPrice
- stockQuantity
- minimumStock
- supplier
- photo
- status
- linkedPartSizeRecord
- createdAt
- updatedAt

Features:
1. Product list
2. Create product
3. Edit product
4. Product detail
5. Search by name, code, brand, size
6. Filter by category, component type, status
7. Stock quantity
8. Minimum stock
9. Low stock indicator
10. Link product to reference record
11. Active/inactive status
12. Adjust stock dialog as small action

Validation:
- Product name is required
- Product code is required and should be unique
- Selling price is required
- Stock quantity cannot be negative
- Minimum stock cannot be negative

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
