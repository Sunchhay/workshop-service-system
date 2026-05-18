# Step 13 — Module 7: Service Job Management Prompt

```text
Using the Father Business Management System context, build Module 7: Service Job Management.

Purpose:
Manage customer service jobs for parts/components. This is the main daily workflow.

Important:
This is not full car repair. Customers bring parts/components such as cylinder, cylinder head, piston-related parts, or other machine components.

Frontend routes:
- app/(admin)/admin/service-jobs/page.tsx
- app/(admin)/admin/service-jobs/create/page.tsx
- app/(admin)/admin/service-jobs/[id]/page.tsx
- app/(admin)/admin/service-jobs/[id]/edit/page.tsx

Frontend feature:
features/service-jobs
  components
    ServiceJobPage.tsx
    ServiceJobCreatePage.tsx
    ServiceJobEditPage.tsx
    ServiceJobDetailPage.tsx
    ServiceJobForm.tsx
    ServiceJobTable.tsx
    ServiceJobMobileCard.tsx
    ServiceSelectionSection.tsx
    MeasurementSection.tsx
    JobPriceSummary.tsx
    dialogs
      CancelServiceJobDialog.tsx
      UpdateServiceJobStatusDialog.tsx
      DeleteServiceJobDialog.tsx
  api.ts
  types.ts

Backend module:
src/modules/service-jobs
  dto
    create-service-job.dto.ts
    update-service-job.dto.ts
    query-service-job.dto.ts
    update-service-job-status.dto.ts
    cancel-service-job.dto.ts
  service-jobs.controller.ts
  service-jobs.service.ts
  service-jobs.repository.ts
  service-jobs.module.ts

Service job fields:
- id
- jobNumber
- customerId
- customerPartComponent
- relatedModelId
- componentType
- problemCondition
- requestedServices
- receivedDate
- expectedCompletionDate
- technicianId
- jobStatus
- beforeMeasurement
- afterMeasurement
- inspectionResult
- serviceWorkPerformed
- productsUsed
- serviceFee
- productFee
- discount
- totalAmount
- paymentStatus
- warrantyPeriod
- internalNote
- customerNote
- attachment
- createdAt
- updatedAt

Job statuses:
- Received
- Inspecting
- Waiting for Approval
- In Service
- Waiting for Parts
- Completed
- Delivered
- Canceled

Payment statuses:
- Unpaid
- Partial
- Paid

Features:
1. Service job list
2. Create service job
3. Edit service job
4. Service job detail
5. Select or create customer
6. Select related model, optional
7. Select component type
8. Add customer part/component description
9. Select one or multiple requested services
10. Suggest price from price catalog
11. Allow price adjustment only if user has permission
12. Add before measurement
13. Add after measurement
14. Add problem/condition
15. Add technician note
16. Add job status
17. Update status
18. Cancel job with reason
19. Show total service fee, product fee, discount, and total amount

Validation:
- Customer is required
- Component type is required
- At least one service is required
- Received date is required
- Job status is required
- Price must be number
- Discount cannot be greater than total

Mobile UX:
- Desktop uses table
- Mobile uses card list
- Detail page shows status badge near top
- Primary actions sticky at bottom
- Create/edit form one-column
- Service selection should be easy on mobile

Before coding:
1. Review existing module pattern
2. List files to create/update
3. Then implement step by step
```
