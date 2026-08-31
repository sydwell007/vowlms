# VowLMS Design System

## Product Character

VowLMS is a learning and operations product, not a marketing-only site. Interfaces should be clear, calm, evidence-led, mobile efficient, and recognisably part of GoalVow.

## Foundation

- Ink/navy: primary navigation, high-contrast learning actions, dark information bands.
- Cyan/blue: links, selection, progress, focus, and informational emphasis.
- Gold: one primary conversion action or important earned-state accent, not a general background.
- White/soft slate: long reading, forms, catalogue, dashboards, and operational surfaces.
- Semantic green/amber/red: verified success, warning/pending, and error only.
- Geist Sans/Mono are loaded through `next/font`; do not add render-blocking font links.

Canonical CSS tokens and reusable surface classes live in `src/app/globals.css`. Academy-specific accents are centralised in `src/lib/academy-colors.ts`.

## Layout

- Main content maximum: `max-w-7xl`; reading content should use a narrower measure.
- Public discovery sections are full-width bands with constrained inner content.
- Cards are for repeated courses/items and framed tools, with radius at or below 8px where the existing component permits.
- Do not nest cards. Use borders, bands, headings, and whitespace for hierarchy.
- Fixed-format media uses explicit aspect ratios and responsive `sizes`.

## Components

- Commands use `ButtonLink` or an icon plus clear text where the action is not universally understood.
- Icon-only controls require Lucide icons, an accessible name, tooltip/title where helpful, and stable 40-44px dimensions.
- Binary settings use checkbox/toggle; mode choices use segmented controls; numeric settings use native range/input controls.
- Inputs require a visible label, `name`, correct `type`, autocomplete, focus state, and associated error/status text.
- Course cards keep stable media, two-line title/description limits, presenter identity, lesson/week/reward facts, live aggregate enrolment count, and a consistent course action.
- Progress uses native `<progress>` or `ProgressBar` with an accessible label and bounded 0-100 value.

## Responsive Rules

- Mobile first at 360px; verify 768px tablet and 1440px desktop.
- Never use viewport-width font scaling.
- Controls and text must wrap without covering adjacent actions.
- Sticky mobile enrolment controls reserve space and must not cover lesson/navigation content.
- Navigation drawers close after route changes and restore focus appropriately.

## Content and State

- Use direct learner language: what this is, who it is for, what happens next.
- Label Live, Built-in, In development, Planned, and Coming soon accurately.
- Empty, loading, unavailable, offline, error, retry, and success states must preserve the next useful action.
- Never fabricate popularity, ratings, learner totals, accreditation, partners, testimonials, employment outcomes, or investor figures.

## Accessibility and Motion

- Target WCAG 2.2 AA for core journeys.
- Preserve skip navigation, semantic landmarks, one page H1, visible focus, and keyboard order.
- Interactive targets should be at least 44px where practical.
- Respect `prefers-reduced-motion`; animation must not carry essential meaning.
- Informative images need useful alt text; decorative/redundant images use empty alt text.
