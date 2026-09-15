# Upskilling VR Practice Deployment Manifest

Generated from the learner-visible VowLMS catalogue by the Virtual Reality Practice Studio.

| Coverage | Count |
| --- | ---: |
| Upskilling courses | 20 |
| Course modules | 118 |
| Module VR practices | 118 |
| Observable practice tasks | 590 |

Each practice is placed after its module assessment, contains five find-and-act tasks, records evidence and scoring, and posts completion to `/api/vr/submit`.

## Release flow

1. Run `npm run sync:vowlms` in the Virtual Reality Practice Studio.
2. Review every scenario in `/studio/upskilling` and refine the canonical manifest.
3. Run VowLMS typecheck, tests, and production build.
4. Import `public/sql/035_seed_upskilling_vr_practices.sql` into the VowLMS production database.
5. Deploy VowLMS and complete a learner acceptance test from assessment pass to VR result.

Use `docs/vr/VR_PRACTICE_LAUNCH_CHECKLIST.md` for content signoff, device QA,
analytics, deployment, and rollback gates.
