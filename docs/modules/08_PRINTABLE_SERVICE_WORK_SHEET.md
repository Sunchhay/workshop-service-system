# Step 14 — Module 8: Printable Service Work Sheet Prompt

```text
Using the Father Business Management System context, build Module 8: Printable Service Work Sheet.

Purpose:
Allow staff to print a service work sheet from a service job. The sheet is used by the workshop/technician during service work.

Print button location:
- Service job detail page

Frontend feature location:
features/service-jobs/components/print
  ServiceWorkSheetPrint.tsx
  ServiceWorkSheetPreview.tsx

The printed sheet should include:
1. Workshop info
2. Job number
3. Date
4. Customer name and phone
5. Part/component information
6. Related model, if known
7. Customer request/problem
8. Selected services
9. Suggested price or price reference, optional
10. Reference specification from reference book, if available
11. Inspection checklist
12. Measurement before service
13. Measurement after service
14. Products used, if any
15. Technician note
16. Customer signature area

Print layout requirements:
- Clean A4 layout
- Easy to print
- Black and white friendly
- Clear sections
- Space for handwriting
- Business logo and info at top
- Hide normal navigation/sidebar/header when printing
- Readable on normal printer

Mobile/PWA:
- Print preview should be readable on mobile
- Print action should be available from service job detail
- Do not break mobile detail layout

Acceptance criteria:
- User can print service work sheet from service job detail
- Printed page does not show sidebar/header navigation
- Sheet is readable on A4 paper
- Technician can write measurements manually after printing

Before coding:
1. Review ServiceJobDetailPage structure
2. List files to create/update
3. Then implement step by step
```
