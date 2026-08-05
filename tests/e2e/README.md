# VowLMS E2E suite (Playwright)

```
npm run test:e2e                 # non-destructive specs only (default)
RUN_DESTRUCTIVE_TESTS=1 npm run test:e2e   # everything, including specs below
PLAYWRIGHT_BASE_URL=https://vowlms.vercel.app npm run test:e2e   # against a deployed URL
```

## Non-destructive (always run)

`onboarding.spec.ts`, `quiz.spec.ts`, `catalog.spec.ts`, `responsive.spec.ts` — read-only browsing, nothing is written to the database.

## Destructive — tagged `@destructive`, skipped unless `RUN_DESTRUCTIVE_TESTS=1`

`auth.spec.ts`, `enrollment.spec.ts`, `assessment.spec.ts`, `certification.spec.ts`.

`assessment.spec.ts` is here not because assessment submission writes anything (it doesn't —
`AssessmentPlayer.tsx` only writes to `localStorage`, no backend call) but because `/assessment`
is in the Next.js middleware's `protectedPrefixes` list (`src/proxy.ts:15`) and redirects
unauthenticated visitors to sign-in, so reaching the page at all requires a real test account.

**Why gated:** `.env.local`'s `BRIDGE_BASE_URL` points at the real production API
(`https://api.goalvow.com`), and this is true even when running against a local
dev server — there is no local/mock database to isolate these writes to. Running
these specs creates a real user row, real enrollments, real assessment attempts,
and a real certificate.

**Before running with `RUN_DESTRUCTIVE_TESTS=1`:** use a throwaway email you
control (the specs generate `qa-test+<timestamp>@vowlms-qa.invalid` by default —
override via `QA_TEST_EMAIL_DOMAIN` if `.invalid` bounces anything unexpected on
your mail relay) and be prepared to manually clean up the created test user,
enrollments, and certificate afterward — there is no automated teardown.
