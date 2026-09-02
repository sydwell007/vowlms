# Upskilling Course Image Implementation Report

Date: 2026-09-02

## Outcome

VowLMS now uses 20 distinct, course-specific Upskilling Academy images instead of assigning the same generic academy network image to every course. The new collection is people-focused, predominantly African, visually consistent with the VowLMS navy/cyan/gold identity, and composed for the existing Foundation and Free badge positions.

## Root Cause

`CourseCard` and the course detail route both called `getAcademyCourseImage(category)`. That resolver accepts only the academy category, so all Upskilling courses necessarily received `visualAssets.academyNetwork`. Course data originates in Moodle-derived seed records and is assembled into 20 parent courses by `src/lib/data.ts` and `src/data/course-groupings.ts`, but the image resolver did not use the stable parent slug.

## Generation And Export

- Tool: OpenAI ImageGen through Codex.
- Master output: 1672x941 PNG, one generation per course.
- Production export: Sharp, centre-safe crop/resize to 1600x900, sRGB WebP, quality 90, metadata omitted.
- Art direction: premium editorial realism, authentic African professional contexts, natural faces and hands, restrained navy/cyan/gold grading, quiet top-left and bottom-left badge zones, no text/logos/watermarks.
- Regenerations: none. The Business Ethics, Cybersecurity, and Health and Wellness pilots passed the visual gate, and all remaining first-generation outputs passed individual and contact-sheet review.
- Masters remain in the Codex generated-images workspace and were not duplicated into the repository.

## Production Assets

All paths are under `public/images/courses/upskilling/`.

| File | Dimensions | Size |
| --- | ---: | ---: |
| `business-ethics.webp` | 1600x900 | 114 KB |
| `workplace-compliance.webp` | 1600x900 | 161 KB |
| `organizational-culture.webp` | 1600x900 | 178 KB |
| `stress-management.webp` | 1600x900 | 93 KB |
| `cybersecurity.webp` | 1600x900 | 105 KB |
| `health-and-wellness.webp` | 1600x900 | 222 KB |
| `human-resources.webp` | 1600x900 | 73 KB |
| `marketing.webp` | 1600x900 | 134 KB |
| `sales.webp` | 1600x900 | 107 KB |
| `project-management.webp` | 1600x900 | 127 KB |
| `customer-service.webp` | 1600x900 | 104 KB |
| `career-management.webp` | 1600x900 | 132 KB |
| `change-management.webp` | 1600x900 | 115 KB |
| `communication.webp` | 1600x900 | 122 KB |
| `leadership.webp` | 1600x900 | 146 KB |
| `resilience.webp` | 1600x900 | 145 KB |
| `problem-solving.webp` | 1600x900 | 93 KB |
| `time-management.webp` | 1600x900 | 93 KB |
| `team-management.webp` | 1600x900 | 153 KB |
| `critical-thinking.webp` | 1600x900 | 153 KB |

The files have 20 unique SHA-256 hashes and all report 1600x900 sRGB metadata.

## Mapping And Integration

`src/lib/visual-assets.ts` now owns one typed slug-to-visual mapping containing both the production path and concise standalone alt text. `getCourseVisual()` returns a curated record for the 20 known slugs and deliberately falls back to the existing academy image for unknown or non-Upskilling courses. Missing Upskilling mappings emit a development-only, once-per-slug warning.

The shared resolver is used by:

- `src/components/courses/CourseCard.tsx`, which covers homepage featured courses, `/courses`, `/academies/upskilling`, Find My Path recommendations, Smart Course Feed, and returning-learner recommendations.
- `src/app/courses/[slug]/page.tsx`, which covers the course preview and course-specific Open Graph/Twitter metadata.

Search and learner-dashboard views do not currently render course imagery through a separate component, so no duplicate mapping was introduced. Related-course sections were already intentionally removed from course detail pages. Academy hero artwork remains unchanged and the generic network image remains the intentional fallback.

## Accessibility

- Card thumbnails retain `alt=""` because each sits inside a link named from the visible course title; repeating the generated scene would add redundant screen-reader output.
- The standalone course preview uses the concise course-specific alt text from the central mapping.
- Course image links retain their explicit `aria-label` based on the course title.
- Existing stable 16:9 containers, keyboard focus behaviour, badge overlays, and touch targets remain unchanged.

## Performance

- Production assets total approximately 2.6 MB across all 20 source WebPs. A catalogue session can now transfer more distinct thumbnails than the old single cached image, which is the deliberate cost of course recognition; responsive derivatives and lazy loading keep that cost bounded.
- `next/image` continues to provide responsive width selection and optimized derivatives.
- Only the first true above-the-fold course card receives `priority`; below-the-fold cards remain lazy loaded.
- Card and preview containers retain fixed aspect ratios, preventing image-driven layout shift.
- No base64 image copies were added to source or production bundles.

## Files Added

- 20 WebPs in `public/images/courses/upskilling/`.
- `docs/design/UPSKILLING_COURSE_IMAGE_MANIFEST.md`.
- `docs/audits/upskilling-course-images-contact-sheet.jpg`.
- `docs/audits/UPSKILLING_COURSE_IMAGE_IMPLEMENTATION_REPORT.md`.
- Desktop, tablet, and mobile before/after screenshots in `docs/audits/`.
- `docs/audits/business-ethics-final-desktop.png`.

## Files Changed

- `src/lib/visual-assets.ts` - central typed mapping, alt text, fallback and development warning.
- `src/components/courses/CourseCard.tsx` - shared slug-specific image resolution.
- `src/app/courses/[slug]/page.tsx` - shared preview and social image resolution.
- `tests/production-readiness.test.mjs` - verifies all 20 mappings and files.

## Intentionally Unchanged

- Course slugs, titles, descriptions, durations, lessons, pricing and rewards.
- Moodle migration and seed architecture.
- Authentication, enrolment, payment, progress, assessments and certificates.
- VowHumans configuration.
- Other academy artwork and the generic fallback image.
- `public/php`, `public/sql`, deployment configuration and environment variables.

## Verification

- Baseline: lint passed; TypeScript passed; 26/26 tests passed; production build passed.
- Final: lint passed; TypeScript passed; 27/27 tests passed; production build passed.
- Browser routes checked: homepage, `/courses`, `/academies/upskilling`, and every one of the 20 course detail routes.
- All first 20 academy cards resolved to 20 unique expected images.
- All 20 detail pages returned HTTP 200 and exposed the expected preview and Open Graph image.
- Desktop 1440x1000, tablet 900x1100, and mobile 390x844 checks found zero broken images and zero horizontal overflow.
- No unexpected 4xx/5xx image or page responses occurred.
- Contact sheet: `docs/audits/upskilling-course-images-contact-sheet.jpg`.
- Before screenshots: `docs/audits/upskilling-baseline-{desktop,tablet,mobile}.png`.
- After screenshots: `docs/audits/upskilling-final-{desktop,tablet,mobile}.png`.

## Remaining Limitations And Manual Actions

The local enrolment-count request still depends on the external API bridge and returned its pre-existing local 500 response during baseline and final browser sessions. The image work does not touch that endpoint, enrolment state, or its tests. No image failed to load because of it.

No manual image integration is required. Deployment was not performed because it was not authorised in this task. As with any externally published AI-generated campaign imagery, a final brand/legal review before launch remains advisable.
