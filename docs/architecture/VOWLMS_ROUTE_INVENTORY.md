# VowLMS Route Inventory

## Public Discovery

- `/` home
- `/academies` and `/academies/[slug]`
- `/courses`, `/catalogue`, `/courses/[slug]`, `/search`
- `/learn`, `/practice`, `/apply`, `/vr-practice`
- `/rewards`, `/opportunities`, `/learning-hubs`
- `/support`, `/vowsupport`, `/vowtools`, `/skillsshop`, `/cheforder`
- `/ecosystem`, `/impact`, `/investors`, `/innovation-labs`
- `/about`, `/team`, `/careers`, `/pricing`, `/contact`
- `/privacy`, `/terms`, `/cookies`, `/accessibility`

## Authentication

- `/auth/signin`
- `/auth/signup`
- `/auth/forgot-password`

## Protected Learning

- `/lesson/[slug]`
- `/assessment/[slug]`
- `/vr-practice/[slug]`
- `/results/[courseSlug]`
- `/certificates`, `/certificates/[courseSlug]`
- `/courses/[slug]/assignments`
- `/courses/[slug]/discussion`

Assignments and discussions currently show honest unavailable states rather than simulated submissions.

## Protected Account and Dashboards

- `/profile`, `/calendar`, `/announcements`
- `/dashboard/learner`, `/dashboard/learner/grades`
- `/dashboard/facilitator`, `/dashboard/facilitator/courses`
- `/dashboard/employer`
- `/dashboard/admin`, `/dashboard/admin/users`, `/dashboard/admin/analytics`, `/dashboard/admin/settings`

## Platform

- `/manifest.webmanifest`, `/offline`, `/robots.txt`, `/sitemap.xml`, `/opengraph-image`
- `/api/*` route handlers documented in `docs/api/VOWLMS_API_CONTRACT.md`

## Explicitly Blocked

- `/php`, `/php/*`, `/php.zip`
- `/sql`, `/sql/*`

## Provisional or Redirected

- `/contact` redirects to VowSupport.
- Sports Academy is represented as a planned academy pathway with no fabricated course catalogue.
- Generic legacy `[slug]` information routes remain for backwards compatibility where an explicit route is absent.
