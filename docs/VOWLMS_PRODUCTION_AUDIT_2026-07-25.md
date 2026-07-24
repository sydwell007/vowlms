# VowLMS Production Audit

Date: 2026-07-25

## Scope

- Audited the live Vercel site and the local Next.js implementation.
- Checked public routes, protected-route redirects, header and academy navigation,
  forms, API validation, course discovery, search, responsive layout, and media
  viewer implementation.
- Verified the final local production build at desktop and 390px mobile widths.

## Findings

- All 47 audited public and protected route entry points returned a valid page or
  the expected sign-in redirect.
- Login, registration, and reset-password endpoints reject invalid payloads with
  validation responses.
- The existing PDF reader, lesson video player, profile editor, dashboard, and
  authenticated API flows remain in place. Their private production data could
  not be exercised without a learner test session.
- The theme is cohesive and launch-appropriate. The existing navy, gold, cyan,
  white, and photography system was retained.
- The previous desktop header exposed too many unrelated links at one level.
- Course and search client components imported the complete multi-megabyte lesson
  seed file.
- The live VR library rendered every scenario in one response (about 1.86 MB of
  HTML).
- Course links containing `academy` or `q` query parameters were not applied by
  the catalogue page.
- The mobile academy bar exposed a native horizontal scrollbar.
- Assessments could generate an empty VR link for courses with no VR scenario.
- An upstream authentication response could be wrapped as HTTP 500 even when its
  message clearly reported Unauthorized or Forbidden.
- A global canonical URL pointed every route to the home page.

## Implemented

- Added accessible Academies, Learning, Progress, and Support menus with desktop
  dropdowns and mobile accordions.
- Kept every menu destination on a real, existing VowLMS page.
- Added a lightweight `CourseSummary` boundary so lesson and assessment data stay
  on the server.
- Added URL-aware academy and query filters to the course catalogue.
- Limited search results to a focused first set with a link to the full filtered
  catalogue.
- Added server-side VR search and 18-item pagination.
- Hid the academy bar scrollbar while preserving touch and keyboard scrolling.
- Corrected assessment VR links, bridge status normalization, selection contrast,
  route canonical metadata, browser theme color, and first-viewport composition.

## Verification

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: 13 tests passed.
- `npm run build`: passed; 79 routes generated.
- Browser verification: no horizontal overflow, Next.js error overlay, or runtime
  exception at 1440px and emulated 390px widths.
- Local `/vr-practice` HTML: about 103 KB after pagination.

## Deployment Boundary

- Deploy the Next.js changes to Vercel.
- No Afrihost PHP file changed.
- No SQL file changed and no SQL import is required.
- No production environment variable was added or renamed.
- The local `.env.local` bridge key appears different from the active Afrihost
  bridge key. This affects local authenticated API testing only; synchronize it
  manually if local end-to-end testing is required.

## Post-Deployment Smoke Test

1. Open the home page on desktop and mobile.
2. Open every header group and follow one link from each group.
3. Test `/courses?q=business&academy=upskilling`.
4. Test `/vr-practice?page=2` and a VR search.
5. Sign in with a dedicated test learner.
6. Open one PDF lesson, one Moodle-hosted video lesson, and one assessment.
7. Save profile preferences and a profile photo.
8. Confirm the browser Network panel has no unexpected 500 responses.
