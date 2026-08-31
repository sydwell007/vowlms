# VowLMS Content and Image Audit

Verified: 31 August 2026

## Content Findings

- Homepage facts are derived from the current academy/course configuration rather than invented learner or outcome numbers.
- Featured courses use an explicit first-six catalogue rule. This is editorial ordering, not a popularity claim.
- Live academy visibility is centralised in `src/lib/academy-launch.ts`: four visible academies and three hidden planned academies at audit time.
- Course cards use live aggregate enrolment totals, not seeded testimonials or fabricated ratings.
- Course and pathway pages avoid formal accreditation claims not present in source data.
- Impact and investor pages describe measurement and platform foundations without publishing unsupported reach, revenue, pass-rate, placement, valuation, or return claims.
- Planned VowTools, SkillsShop, ChefOrder, learning-hub, and ecosystem functions are labelled planned/in development rather than integrated/live.
- Find My Path now explains its deterministic academy score and course-order rule. Study-time is explicitly saved as context but not scored.

## Content Risks

- Legal pages require final POPIA and commercial review by named business/legal owners.
- Each academy needs a verified accreditation register with accrediting body, programme, status, reference, scope, and review date before claims are added.
- Course descriptions imported from Moodle require an academic copy-edit workflow that preserves meaning and source traceability.
- Support, careers, investor, and partnership contact routes need documented response owners and service levels before forms or response promises are added.
- No testimonial, partner logo, learner count, employment outcome, or investor metric should be published without consent/evidence.

## Image Inventory

| Asset | Source size | Current use | Decision |
|---|---:|---|---|
| `hero-ecosystem.png` | 1,965,021 bytes | Homepage hero and Chef Academy fallback | Retain; effective and responsive through `next/image`; convert source to AVIF/WebP in a later asset pass |
| `academy-network.png` | 2,165,121 bytes | Academy and default course discovery | Retain; strongest immediate academy signal; source optimisation recommended |
| `dashboard-experience.png` | 1,948,106 bytes | Dashboard/platform preview and Business School | Retain; source optimisation recommended |
| `vr-practice-lab.png` | 1,713,363 bytes | Skills Training and practice | Retain; source optimisation recommended |
| `course-presenter.webp` | 13,554 bytes | Course presenter avatar | Retain; already compact |
| `goalvow-logo.png` | Repository brand asset | Header/auth/schema identity | Retain; do not replace without brand approval |

## Image Rules

- Continue using `next/image`, explicit responsive `sizes`, stable aspect ratios, and priority only for the first viewport/LCP image.
- Informative images require concise alt text; decorative card thumbnails use empty alt text when the surrounding link already names the course.
- Do not add stock testimonials, invented partner logos, unlicensed photos, watermarks, or atmospheric images that hide the actual product.
- New generated imagery needs a named page purpose, brand review, source record, and mobile crop verification.

## Recommended Asset Follow-up

1. Produce visually lossless WebP/AVIF masters at the maximum rendered dimensions.
2. Compare file weight and visual quality at desktop and 360px mobile widths.
3. Update only after screenshot comparison confirms no text, face, or interface degradation.
4. Keep original masters outside the public deployment or in an approved asset archive.
