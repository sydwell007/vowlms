# VowLMS Launch Readiness — Recommendations

Target launch: **15 August 2026**. This is a checklist, not code — it captures the
process recommendations from the pre-launch QA brief, updated with what the QA
pass this session actually found in the codebase and the three related repos.

## 1. Cross-platform coordination — confirmed status, not assumption

| System | Status found | What's needed |
|---|---|---|
| VowRewards (`vowrewards-school`) | **No endpoint exists** to receive an external reward event — only an internal, cookie-session-gated admin CRUD API. Confirmed by reading the repo directly. | Whoever owns VowRewards needs to ship a documented, authenticated reward-event ingestion endpoint before `public/php/api/qa/test-vowrewards-integration.php` (or the real `/rewards/award` flow) can do anything beyond report "not configured." |
| PlugConnect (`plugconnect`) | **No opportunities push/pull API exists.** The only bridge route explicitly rejects `POST` with "Protected mutations must use a dedicated authenticated route" (405), and there is no `/api/opportunities` route at all. All "opportunities" data currently visible is either the unrelated `/api/jobs` listing endpoint or hardcoded mock fixtures. | PlugConnect needs a real push (certified-learner) and pull (opportunities-by-skill) API with VowLMS's bridge-key pattern before this integration can be anything but a placeholder. VowLMS's own `/opportunities` page already degrades gracefully to an honest empty state in the meantime — that part doesn't need to change. |
| VR platform (`virtual-reality-simulation`) | **Zero backend.** No `app/api` directory, no outbound fetch calls anywhere in that repo — it's a self-contained mock-data UI prototype today. | VowLMS's receiving endpoint (`public/php/api/qa/test-vr-callback.php`) is real and ready. The VR platform needs its own backend built before it can ever call it — this is 100% work on that side, not VowLMS's. |

**Action:** these are the three real go/no-go dependencies outside VowLMS's control. Confirm timelines with each owner before treating Aug 15 as fixed.

## 2. Findings from this QA pass worth fixing before launch (not process — actual code)

- `/results/[courseSlug]` (`src/app/results/[courseSlug]/page.tsx:22-25`) shows **hardcoded demo numbers** ("6/6", "84%", "86%") for every course, regardless of the learner's real progress. A learner who checks their real results today sees fake data.
- **No UI ever calls `POST /api/certificates/generate`** — the only wired-up certificate flow is a read of an already-existing certificate, which 404s until one exists. There is currently no way for a real learner to actually get a certificate through the UI.
- Assessment scoring is **entirely client-side** (`localStorage`, `AssessmentPlayer.tsx`) — no server call, no server-side record of a pass/fail. Certificate eligibility can't currently be verified against a real assessment result.
- Only **Upskilling Academy has free courses** (140/140 checked). Chef Academy, Skills Training, and Business School are 100% paid — every enrollment in those three academies goes through a real PayFast redirect. Confirm this is the intended business model, not an oversight.
- `sendMail()` (`public/php/lib/mail.php`) uses PHP's native `mail()` against the shared host's local MTA — the configured `SMTP_HOST`/`PORT`/`USER`/`PASS` env vars are not actually used by anything. If real SMTP relay delivery is required (rather than depending on Afrihost's local sendmail reputation), this needs to change before launch.

See `pre-launch-frontend-report.md` for the full test run this was found during.

## 3. A single demo path that never breaks

Pick one course per academy (4 total) and give it the deepest QA attention — full
enrollment → lesson delivery → assessment → certificate → reward path, manually
verified end to end by a person, not just this automated suite. This becomes the
investor-demo path and the fallback if something else has rough edges on day one.

Given the findings above, the certificate step in particular needs a human to walk
through the real production flow before it can be trusted for a demo — the
automated certification test in this suite (`tests/e2e/certification.spec.ts`)
calls the backend endpoint directly specifically because the UI doesn't expose it yet.

## 4. Soft launch

Given the 11-day window and the unresolved cross-team dependencies above, consider
opening enrollment to a small cohort (50-100 learners) on Aug 15, watching
`integration_health_log` and error rates for 3-5 days, then opening fully. Lower
risk than a hard public launch with untested concurrent load.

## 5. Support readiness for day one

- `support@goalvow.com` should have someone actively monitoring it from launch day.
- Keep a shared "known issues / workarounds" note (even just the findings in
  section 2 above) so whoever answers tickets isn't caught off guard by things this
  QA pass already knows about.

## 6. Post-launch monitoring cadence

- Run `GET public/php/api/qa/run-all-diagnostics.php` once daily for the first
  week (via a cron job or uptime monitor) — see `README.md` in this folder for how
  to wire that up on Afrihost.
- Re-run `npm run qa:report` after any deploy during launch week, not just once
  before launch.
