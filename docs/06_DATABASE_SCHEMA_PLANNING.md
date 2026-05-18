# Step 6 — Database Schema Planning Prompt

```text
Using the Father Business Management System context, please design the Prisma database schema for the MVP.

MVP modules:
1. Authentication & users
2. Customers
3. Services
4. Price catalog
5. Machine/models
6. Model & part reference book
7. Service jobs
8. Products/inventory
9. Invoices
10. Payments
11. Direct sales
12. Expenses
13. Dashboard summary support
14. Audit logs

Important:
- This is not a full car repair system
- It is a part/component service workshop system
- Customers bring components such as cylinder, cylinder head, piston-related parts, and other machine parts
- Service names may be Khmer or English
- Services and prices must be dynamic and managed by admin
- Invoice items can be service, product, or custom charge
- Payment can be full, partial, or unpaid
- Reference book should support flexible measurements
- Price catalog should support size range, difficulty, customer type, currency, and effective date

Please provide:
1. Recommended Prisma models
2. Fields for each model
3. Relationships between models
4. Enums/status values
5. Indexes and unique constraints
6. Soft delete/status recommendation
7. Migration order
8. Seed data recommendation

Do not generate all code yet. Start with schema planning only.
```
