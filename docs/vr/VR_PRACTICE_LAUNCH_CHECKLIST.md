# VowLMS VR Practice Launch Checklist

This checklist governs promotion of the 118 Upskilling module practices from the
Virtual Reality Practice Studio into VowLMS. The generated manifest is the
canonical content source; the production database stores placement and attempt
records.

## Required signoff inputs

- Academy owner confirms that each scenario applies the complete module outcome.
- Subject-matter expert approves the five task decisions and feedback messages.
- Safety reviewer approves workplace, electrical, health, and compliance language.
- Learning designer confirms the module assessment appears immediately before the
  VR practice and that the practice does not disclose assessment answers.
- Brand owner approves public names, environments, and GoalVow terminology.
- Product owner confirms the pass mark, retry policy, reward policy, and completion
  event contract.

## Content acceptance

- Open every practice from `/studio/upskilling` and review it at 360, 768, and
  1440 pixel widths.
- Confirm all five stations are visible and each task names the station to find.
- Confirm selecting a station reveals the action but does not complete the task.
- Confirm an unsafe or weak option gives corrective feedback without progress.
- Confirm only the correct action advances progress by 20 percentage points.
- Confirm completion remains locked until all five actions are complete.
- Replace primitive room objects with reviewed GLB or GLTF assets under
  `/public/models` when production models become available.

## Accessibility and device QA

- Complete each practice with keyboard-only controls and visible focus states.
- Verify the accessible station controls remain usable when WebGL is unavailable.
- Test browser zoom at 200 percent and Windows high-contrast mode.
- Test current Chrome and Edge on desktop, Android Chrome, and iOS Safari.
- Test supported WebXR headsets over HTTPS and document controller mappings.
- Verify reduced-motion preferences and provide captions or transcripts for any
  future audio instructions.

## Performance gates

- Keep the initial practice route within the agreed Core Web Vitals budget.
- Compress production 3D models and textures; lazy-load them per environment.
- Verify the canvas is nonblank and interactive after cold navigation.
- Test on a representative low-memory Android device before production promotion.
- Monitor failed WebGL contexts and offer the accessible control fallback.

## Data and analytics

- Record `vr.practice.started`, `vr.station.found`, `vr.action.failed`,
  `vr.action.completed`, `vr.practice.completed`, and `vr.practice.exited`.
- Include practice slug, course slug, module order, mode, duration, score, attempts,
  and task completion count without storing free-form sensitive learner content.
- Confirm `/api/vr/submit` and `/api/progress` are idempotent for repeat requests.
- Validate retention, consent, and privacy wording before enabling production
  learner analytics.

## Deployment

1. Run `npm run sync:vowlms` in `virtual-reality-simulation`.
2. Review the generated diff and the coverage test output.
3. Back up the VowLMS production database.
4. Import `public/sql/035_seed_upskilling_vr_practices.sql` in staging.
5. Verify 118 lesson rows and 118 practice rows resolve to valid source courses.
6. Run the assessment-to-practice learner journey in staging.
7. Deploy VowLMS through the normal preview-to-production promotion flow.
8. Import migration 035 in production during the approved release window.
9. Run a production smoke test without creating synthetic learner achievements.

## Rollback

- Roll back the application deployment first if the interface fails.
- Restore the pre-migration database backup for a full data rollback.
- Do not delete learner attempts, progress, rewards, or certificates manually.
- Preserve the generated manifest and failed release evidence for diagnosis.

## Release evidence

- `docs/vr/UPSKILLING_VR_PRACTICES.md`: generated coverage and release flow.
- `public/vr/upskilling-practices.json`: public deployment manifest.
- `public/sql/035_seed_upskilling_vr_practices.sql`: idempotent placement seed.
- `tests/vr-practice-coverage.test.mjs`: catalogue integrity contract.
- `tests/e2e/vr-practice-studio.spec.ts`: Studio and VowLMS browser journey.
