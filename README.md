# VowLMS

VowLMS is the local build of the GoalVow Academy LMS platform. It is a premium, mobile-first Next.js App Router application for learning pathways, assessments, VR practice placeholders, certificates, rewards, learning hubs, and opportunities.

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification Commands

```bash
npm run lint
npm run build
npx prisma generate
npx prisma db push
npx prisma db seed
```

`npx prisma db push` requires a PostgreSQL `DATABASE_URL` in `.env.local`.

## Platform Areas

- Public marketing homepage
- Academy and course catalogue
- Course detail, lesson player, assessment, VR practice, results, and certificates
- Learner, facilitator, employer, and admin dashboards
- Rewards, opportunities, learning hubs, pricing, PWA offline fallback
- API routes for health, catalogues, dashboards, progress, assessments, VR, certificates, rewards, PayFast, and integrations

## Environment

Copy `.env.example` to `.env.local` and fill values as services become available. The app renders locally with mock data, so a database is not required for the first UI demo.

## Stack

- Next.js App Router with TypeScript and `src/`
- Tailwind CSS v4
- Prisma schema for PostgreSQL
- Auth.js-ready mock auth boundary
- PWA manifest and service worker
- WebXR and React Three Fiber-ready VR placeholder structure
- PayFast and GoalVow ecosystem integration placeholders
