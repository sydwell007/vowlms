# VowLMS Image Audit

## Asset Inventory

| Asset | Dimensions | Approx. size | Primary use | Assessment | Action |
|---|---:|---:|---|---|---|
| `public/images/GoalVow - Logo.png` | 1134 x 1164 | 44 KB | Original supplied brand mark | Approved source; filename is awkward for code | Retain as original |
| `public/images/goalvow-logo.png` | 1134 x 1164 | 44 KB | Header, footer, auth, sidebar, manifest | Strong brand alignment; transparent background | Retain |
| `public/images/vowlms/hero-ecosystem.png` | 1728 x 910 | 1.96 MB | Home and investor/ecosystem hero | Strong subject relevance and wide composition | Retain; Next.js responsive optimisation required |
| `public/images/vowlms/academy-network.png` | 1672 x 941 | 2.17 MB | Academy, course, catalogue, and service discovery | Consistent visual language | Retain; consider source WebP later |
| `public/images/vowlms/dashboard-experience.png` | 1536 x 1024 | 1.95 MB | Role dashboards, rewards, opportunities | Useful product-context visual | Retain; crop via `object-fit`, not separate duplicates |
| `public/images/vowlms/vr-practice-lab.png` | 1694 x 929 | 1.71 MB | Skills Practice, learning hubs, support | Clear applied-learning context | Retain |

## Placement Review

- Homepage hero: high-value, full-bleed use with readable dark overlay and responsive `sizes`.
- Academy and catalogue pages: supporting visual appears once per route, avoiding decorative repetition.
- Dashboards: image appears in the shared dashboard shell on wide screens only, reducing mobile data use.
- Lesson side panel: brand mark is used instead of unrelated decoration.
- Skills Practice: the visual accurately communicates a preview; no score or capability claim is inferred from the image.
- Authentication: supplied GoalVow mark replaces temporary letter tiles.

## Accessibility

- Informative images have contextual alt text.
- The logo uses concise brand alt text.
- Images use fixed dimensions, `fill` with stable aspect ratios, or a shared `ImagePanel`, preventing layout shift.
- Text is not embedded in generated imagery.

## Production Recommendations

1. Keep `next/image` optimisation enabled and preserve responsive `sizes` values.
2. Do not preload dashboard and supporting images on mobile.
3. Convert source PNG photography to high-quality WebP or AVIF only after visual comparison; keep the supplied logo PNG.
4. Future photography should favour authentic South African learning, teaching, collaboration, and practical skills application.
5. Do not add generic stock imagery, invented partner logos, accreditation marks, or decorative image clutter.

No additional generated image was required in this pass. The four existing VowLMS visuals cover the main public, academy, dashboard, and Skills Practice contexts consistently.
