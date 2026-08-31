# VowLMS API and Data Flow

## Public Discovery

```text
Browser GET page
  -> Vercel Next.js server component
  -> src/lib/data.ts normalised academy/course/pathway data
  -> HTML + bounded client props
  -> optional same-origin public APIs for live aggregates/reviews
```

Public pages must not receive bridge keys, JWTs, Moodle tokens, PayFast secrets, or learner records.

## Authentication

```text
Browser POST /api/auth/login
  -> Next.js validates shape and calls bridgePost('/auth/login', noAuth)
  -> PHP verifies bridge key, rate limit, password hash, account state
  -> PHP returns JWT + safe user profile
  -> Next.js writes HttpOnly vowlms_token
  -> browser restores session through same-origin session endpoint
```

Registration follows the same boundary and forces `role = learner` in PHP and Next.js. Password reset returns a generic response to reduce account enumeration.

## Enrolment and Payment

```text
Free course:
Browser -> POST /api/enrollments -> PHP ownership/idempotency transaction
        -> active enrolment -> aggregate count invalidated in the browser

Paid course:
Browser -> POST /api/payments/payfast/create -> pending payment + signed fields
Browser -> PayFast hosted checkout
PayFast -> server notification -> Next.js relay/PHP verifier
PHP -> signature/source/server/merchant/amount/state checks in transaction
    -> payment paid -> enrolment active exactly once
```

A browser return URL never proves payment.

## Lesson, Progress, Assessment, Certificate

```text
Protected page -> proxy cookie check -> server data lookup
Browser completion -> Next.js API -> PHP JWT + enrolment ownership
PHP transaction -> progress/enrolment update -> first-event reward if eligible
Assessment submit -> server score/pass -> progress update
Certificate request -> PHP re-checks completion -> unique certificate + reward
```

Local storage provides responsive/offline UI continuity for selected client experiences, but server records are authoritative for account progress, results, certificates, and rewards.

## Moodle Content and Files

- Trusted operator scripts read configured academy Moodle APIs using six environment-specific URL/token pairs.
- Extracted content is transformed into reviewed local migration/import assets.
- Lesson file access uses a short-lived HMAC-signed VowLMS/PHP resource URL.
- PHP verifies signature and expiry, requests the approved Moodle resource with TLS verification, and streams it without exposing the Moodle token.

## VowHumans Presenter

```text
Learner opens approved lesson
  -> presenter is opt-in and iframe remains unmounted until Start
  -> VowLMS validates saved https://vowhumans.com/embed/... URL
  -> iframe receives only delegated camera/microphone permissions
  -> VowHumans requests signed lesson context token
  -> VowLMS returns approved lesson title/content/resource context with short expiry
```

The presenter is optional support. Lesson reading material remains visible and usable when the embed, GPU worker, media session, or context API is unavailable.

## Reviews and Enrolment Counts

- Public review reads return aggregate and approved learner review fields.
- Review writes require learner JWT plus active/completed enrolment and update only that learner's review.
- Enrolment-count reads return non-negative aggregate counts for active/completed enrolments and never expose user IDs or contact details.
- Grouped VowLMS courses combine underlying Moodle child-course totals in the Next.js route.

## Failure Behaviour

| Failure | Expected behaviour |
|---|---|
| Bridge unavailable | 503 envelope; account mutations fail closed; public factual pages remain available |
| Invalid/expired JWT | 401; client returns to sign-in without trusting cached identity |
| Wrong role/owner | 403 without record detail |
| Moodle file unavailable | Visible lesson error/retry; no token leakage |
| VowHumans unavailable | Presenter error/retry/close; lesson content remains available |
| PayFast invalid/replayed | Reject tamper or return idempotent already-processed result; no duplicate enrolment/reward |
| Local storage unavailable | In-memory path finder/course UI continues; account server data unaffected |

## Environment Ownership

- Vercel: `NEXT_PUBLIC_APP_URL`, bridge URL/key, matching signing/auth/payment integration values used by Next.js server code.
- Afrihost: database credentials, matching bridge/JWT/resource secrets, frontend origin, PayFast, SMTP, and Moodle tokens used by PHP.
- Operator workstation: Moodle migration URL/token variables.
- RunPod/VowHumans worker: avatar runtime variables; they do not belong in Vercel or Afrihost unless the consuming service explicitly reads them.

Only variable names and placeholders belong in Git.
