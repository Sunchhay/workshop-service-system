# Start Project Setup Prompt

Copy this into Claude Code or ChatGPT when starting the project setup.

```text
I want to start coding my project step by step. Please act as my senior full-stack engineer and help me set up and build the project carefully.

Project Name:
Workshop Service Management System

Project Context:
This is a web-based system for a part/component service workshop, not a full vehicle repair system.

Customers bring parts/components such as:
- Cylinder
- Cylinder head
- Piston-related parts
- Bearing-related parts
- Shaft
- Other machine or engine components

The workshop provides services such as:
- Replace pipe cylinder
- Bore cylinder
- Smooth cylinder head surface
- Smooth cylinder block surface
- Check cylinder size
- Match piston with cylinder
- Surface smoothing / resurfacing
- Other custom workshop services

Technology Stack:
Frontend:
- Next.js App Router
- Shadcn UI
- Tailwind CSS
- Redux Toolkit / RTK Query
- React Hook Form
- Zod
- Lucide React
- Khmer/English translation
- Light/dark theme
- PWA support

Backend:
- NestJS
- Prisma
- PostgreSQL
- REST API
- JWT authentication
- Role-based permission
- Controller / Service / Repository pattern

Project Folder Structure:
workshop-service-system/
  apps/
    web/  -> Next.js frontend
    api/  -> NestJS backend API
  docs/   -> requirements, prompts, decisions

Important:
- Frontend files must be created under apps/web
- Backend files must be created under apps/api
- Do not mix frontend and backend files
- Prisma schema must be inside apps/api/prisma/schema.prisma
- Next.js admin pages must be inside apps/web/app/(admin)/admin
- Frontend feature logic must be inside apps/web/features/[module]
- Backend modules must be inside apps/api/src/modules/[module]

For now, I want to start from project setup.

Please help me set up the project first.

First Task:
Guide me to create the base project structure:

workshop-service-system/
  apps/
    web/
    api/
  docs/
    prompts/
    requirements/
    decisions/

Then help me set up:
1. Next.js frontend inside apps/web
2. NestJS backend inside apps/api
3. Prisma inside apps/api
4. Basic docs files:
   - docs/requirements/MASTER_CONTEXT.md
   - docs/decisions/PROJECT_DECISIONS.md
5. Recommended package installation
6. Recommended dev commands
7. Recommended first commit

Important:
Do not start business modules yet.
Start only with project setup.
Give me commands step by step.
After each step, wait for me to confirm before continuing.
```
