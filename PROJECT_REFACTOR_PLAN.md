# Project Refactor Plan

## Overview
- **Objective**: Gradually separate the monolithic codebase into dedicated frontend and backend workspaces with student, teacher, and admin modules.
- **Current Phase**: Base folder scaffolding complete, backend modules wired into the Express server, and the student frontend module owns the primary application shell. Teacher and admin frontend modules are stubbed with dedicated entry points ready for further build-out.

## Backend Structure
```
/backend
  server.mjs                # Express bootstrap
  /student
    /models
      studentModel.mjs
    /services
      studentService.mjs
    /routes
      index.mjs
  /teacher
    /models
      teacherModel.mjs
    /services
      teacherService.mjs
    /routes
      index.mjs
  /admin
    /models
      adminModel.mjs
    /services
      modelCheckService.mjs
      proctoringService.mjs
      proxyService.mjs
    /routes
      apiRoutes.mjs
      legacyRoutes.mjs
      index.mjs
```
- **Routing**: `server.mjs` now mounts `/api/student`, `/api/teacher`, and `/api/admin`, while preserving legacy endpoints (`/proxy`, `/proctor-logs`, `/test-models`) through the admin module.
- **Services/Models**: Each module exposes lightweight service logic backed by simple in-memory model classes to enable future data layer integration.

## Frontend Structure
```
/frontend
  App.tsx               # Shared entry that mounts the student app by default
  main.tsx              # Vite bootstrap importing ./styles/index.css
  /context              # React providers (AuthContext)
  /data                 # Static question/lab datasets
  /lib                  # Supabase client and other singletons
  /services             # API client wrappers grouped by domain
  /styles               # Global Tailwind + theme tokens
  /types                # Shared TypeScript types and re-exports
  /student
    /components
      StudentAppContent.tsx
    /pages
      StudentApp.tsx
    /styles
      student.css
    index.ts
  /teacher
    /components
      TeacherDashboardShell.tsx
    /pages
      TeacherApp.tsx
    /styles
      teacher.css
    index.ts
  /admin
    /components
      AdminPortal.tsx
    /pages
      AdminApp.tsx
    /styles
      admin.css
    index.ts
```
- **Primary Shell**: `frontend/App.tsx` now delegates to `@student`'s `StudentApp`, which wraps the original application flow via `StudentAppContent`.
- **Module Placeholders**: Teacher and admin modules expose dedicated entry points and styling hooks; they currently wrap existing shared components and will be expanded with module-specific logic in subsequent iterations.

## Configuration Updates
- Added TypeScript path aliases for each workspace segment (`@context/*`, `@services/*`, `@data/*`, `@lib/*`, `@styles/*`, `@types/*`, `@student/*`, `@teacher/*`, `@admin/*`).
- Updated Vite configuration to honour the new aliases and point `@` to `/frontend` (`vite.config.ts`).
- Adjusted Tailwind content glob to scan `frontend/**/*.{js,ts,jsx,tsx}`.
- Adjusted NPM script `proxy` earlier to run `backend/server.mjs`.

## Next Steps
1. Migrate shared UI assets/components into module-specific or shared frontend workspaces as needed.
2. Flesh out teacher and admin frontend modules with tailored routing logic and API integration points.
3. Gradually replace the in-memory backend services with real data sources (e.g., Supabase or another persistence layer).
4. Add API client wrappers in each frontend module to communicate with their corresponding backend routes.
5. Update documentation and developer onboarding materials once the module separation is fully implemented.

> **Assumptions**: Existing Supabase integrations and environment files remain unchanged in this phase. Further clarifications on data contracts will be documented as modules evolve.
