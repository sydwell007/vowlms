# VowLMS Route Inventory

Verified: 31 August 2026

Source: `src/app`, `src/proxy.ts`, `src/app/sitemap.ts`, and read-only production checks

## Route Policy

| Archetype | Audience | Authentication | Data source | Indexing | Primary action | State coverage | Status / action |
|---|---|---|---|---|---|---|---|
| `/` | Prospective and returning learners | Public | Static catalogue normalisation | Index | Find a path / browse courses | Populated catalogue | Working; add canonical and organisation schema |
| `/academies` | Learners and partners | Public | Academy and course data | Index | Choose academy | Live academies only | Working; retain |
| `/academies/[slug]` | Learners | Public | Academy and course data | Index canonical short slugs | Browse academy courses | Search, filters, empty state, load more | Working; redirect long legacy slugs |
| `/courses` | Learners | Public | Normalised course summaries | Index | Find and compare courses | Filters, sort, list/grid, empty, incremental loading | Working; refine URL state later |
| `/courses/[slug]` | Learners | Public | Course, academy, reviews, enrolment APIs | Index | Enrol / start learning | 404, free/paid, related courses | Working; add canonical, social and JSON-LD |
| `/learn`, `/learn/pathways`, `/learn/pathways/[slug]` | Learners | Public | Course/pathway data | Index | Select/start pathway | Empty and unavailable content handled | Working; retain |
| `/find-my-path` | Undecided learners | Public | Deterministic recommendation rules | Index | Complete recommendation flow | Four questions and result | Working; improve semantics, persistence, rationale |
| `/search` | Learners | Public | Course and academy summaries | Index | Search catalogue | Empty query, no results, result tabs | Working; make changed query shareable |
| `/practice`, `/vr-practice` | Learners | Public | VR scenario/course data | Index | Discover practice | Paginated listing | Working; retain |
| `/apply`, `/rewards`, `/opportunities`, `/learning-hubs` | Learners and partners | Public | Static plus guarded APIs | Index | Understand next step | Honest empty/availability states | Working/partial by integration status |
| `/pricing` | Prospective learners | Public | Static verified offers | Index | Compare/start | Static | Working; retain |
| `/support` | All users | Public | Verified contact configuration | Index | Contact support | Phone/email/WhatsApp fallback | Working; retain as canonical support route |
| `/about`, `/ecosystem`, `/impact`, `/team`, `/careers`, `/investors`, `/innovation-labs` | Public, partners, investors | Public | Verified static/catalogue facts | Index | Learn/contact | Static, honest provisional states | Working; claims need ongoing evidence review |
| `/privacy`, `/terms`, `/cookies`, `/accessibility` | All users | Public | Policy content | Index | Read policy/contact | Static | Working; business/legal review still required |
| `/auth/signin`, `/auth/signup`, `/auth/forgot-password` | Account users | Public | Next auth routes and PHP bridge | Noindex | Authenticate/create/recover | Loading, validation, API error/success | Working; improve field semantics |
| `/lesson/[slug]`, `/assessment/[slug]`, `/results/[courseSlug]` | Enrolled learners | Protected | PHP bridge, Moodle resources, progress APIs | Noindex | Learn/submit/continue | Missing content, API errors, retry | Working; preserve |
| `/vr-practice/[slug]` | Enrolled learners | Protected | VR submission API | Noindex | Complete practice | Unavailable/error states | Working; preserve |
| `/certificates`, `/certificates/[courseSlug]` | Learners | Protected | Certificate APIs | Noindex | View/download certificate | Eligibility and bridge unavailable states | Working; preserve |
| `/profile`, `/calendar`, `/announcements` | Signed-in users | Protected | Account APIs/local state | Noindex | Manage account/activity | Loading/error/empty | Working/partial; preserve |
| `/dashboard/learner*` | Learner | Protected plus API role checks | Learner dashboard APIs | Noindex | Continue learning | Loading/error/empty | Working; preserve |
| `/dashboard/facilitator*` | Facilitator | Protected plus API role checks | Facilitator APIs | Noindex | Manage assigned learning | Honest unavailable/empty states | Working/partial |
| `/dashboard/employer` | Employer | Protected plus API role checks | Employer API | Noindex | View authorised reporting | Restricted empty state | Working; organisation ownership model outstanding |
| `/dashboard/admin*` | Admin | Protected plus PHP role checks | Admin APIs | Noindex | Operate platform | Loading/error/empty | Working/partial; preserve server enforcement |
| `/api/*` | Browser/server consumers | Per-endpoint | Next facade to PHP/API/data | Never index | JSON operation | Consistent bridge errors | Documented in API contract |
| `/offline` | PWA users | Public | Static fallback | Noindex | Reconnect | Offline-safe | Working |

## Canonical Redirects

| Legacy route | Canonical destination | Status |
|---|---|---|
| `/contact` | `/support` | Live 308; retain |
| `/vowsupport` | `/support` | Live 308; retain |
| `/catalogue` | `/courses` | Live 308; retain |
| `/academies/upskilling-academy` | `/academies/upskilling` | Baseline duplicate; implement 308 |
| `/academies/skills-training-academy` | `/academies/skills-training` | Baseline duplicate; implement 308 |
| `/academies/chef-academy` | `/academies/chef-academy` | Category and legacy slug are identical; no redirect |
| `/academies/business-school` | `/academies/business-school` | Category and legacy slug are identical; no redirect |

## Explicitly Blocked

The following are deployment artifacts, not web routes, and must remain 404 locally, in Preview, and in Production:

- `/php`, `/php/*`, `/php.zip`
- `/sql`, `/sql/*`

## Non-Indexable Route Families

- Authentication and account routes.
- Dashboards and administrative pages.
- Lessons, assessments, results, certificates, discussions, and assignments.
- API routes, payment flows, callbacks, and deployment artifacts.
- Offline fallback and transient error/loading routes.

## Test Coverage

- Static security tests cover protected prefixes, `/php`/`/sql`, auth role safety, payment verification, signed resources, enrolment aggregates, review ownership, VowHumans allowlisting, and Vercel exclusions.
- Playwright specs cover catalogue, responsive layout, onboarding, auth, enrolment, assessment, certification, quiz, and VowHumans archetypes.
- Production-readiness tests added by this upgrade cover canonical redirects, sitemap canonicalisation, metadata/JSON-LD, auth field semantics, and Find My Path progress.
- Destructive account/payment/enrolment tests remain opt-in and must not run against Production.

## Route Count Note

The source tree contains 98 `page.tsx`/`route.ts` files. The clean production build emits 87 page outputs because dynamic routes, API handlers, metadata routes, redirects, and build-time rendering modes do not map one-to-one to source files. Route counts in investor or launch material must identify the counting method rather than presenting an ambiguous total.
