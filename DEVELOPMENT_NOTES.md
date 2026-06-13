# VowLMS Development Notes

## Scope

This phase avoids Moodle-style complexity. It does not include forums, wikis, SCORM, competency frameworks, complex gradebooks, or social networking.

## Current Data Strategy

The UI and API routes read from `src/data/seed-data.ts` through `src/lib/data.ts`. This keeps the local demo reliable while the Prisma schema is prepared for PostgreSQL.

When the database is available, replace the helper functions in `src/lib/data.ts` with Prisma-backed queries. Keep the page components unchanged where possible.

## Auth Boundary

`src/lib/auth/mock-auth.ts` provides a role-based mock session and access helper. It is shaped so Auth.js session logic can replace it later without rewriting all dashboards.

## VR Practice

`src/components/vr/VRStudio.tsx` is a WebXR-ready visual placeholder. The next implementation step is to add a client component with a React Three Fiber `Canvas`, device checks, controller support, and persisted scoring.

## Offline

`public/sw.js` caches the shell and fallback routes. Future offline work should add:

- Course overview cache rules
- Lesson text storage
- IndexedDB progress queue
- Background sync for progress, assessment attempts, and VR attempts

## Integrations

Integration route handlers live under `src/app/api/integrations/[name]/route.ts`. Each response includes configuration state and the future connection point.
