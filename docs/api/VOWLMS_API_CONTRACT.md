# VowLMS API Contract

## Conventions

- Browser clients call same-origin Next.js routes under `/api`.
- Next.js forwards authorised server-to-server requests to the Afrihost PHP bridge.
- The bridge requires `X-Bridge-Key`; authenticated endpoints also require the JWT bearer token forwarded from the HttpOnly `vowlms_token` cookie.
- JSON responses use `{ ok, requestId, timestamp, data? , error? }` in Next.js and `{ ok, timestamp, data?, error? }` in PHP.
- User IDs and roles come from the verified JWT, never from browser request fields.
- Money is ZAR and stored as decimal values.
- Development fallbacks are limited to explicit zero states. Identity, profile, payment, and certificate operations fail closed when the bridge is absent.

## Endpoint Matrix

| Method | Next.js path | Auth / roles | Main request fields | Main response | PHP path / tables |
|---|---|---|---|---|---|
| GET | `/api/health` | Public | None | Service and bridge health | `/health`; database probe |
| GET | `/api/academies` | Public | Optional query filters | Academy list | `/academies`; `academies` |
| GET | `/api/courses` | Public | Academy, level, free, page, limit | Published course list | `/courses`; `courses`, `academies` |
| GET | `/api/courses/{slug}` | Public | Slug path | Course, modules, lessons | `/courses/{slug}`; course tables |
| GET | `/api/lessons/{slug}` | Learner session for page access | Slug path | Lesson navigation and content | `/lessons/{slug}`; learning tables |
| GET | `/api/learning-hubs` | Public | Optional status | Hub list | `/learning-hubs`; `learning_hubs` |
| GET | `/api/opportunities` | Public | Optional type | Opportunity list | `/opportunities`; `opportunities` |
| POST | `/api/auth/register` | Public, rate limited | Name, email, password, optional profile fields | Learner account and session | `/auth/register`; `users`, `reward_events` |
| POST | `/api/auth/login` | Public, rate limited | Email, password | User and session | `/auth/login`; `users` |
| POST | `/api/auth/logout` | Session optional | None | Signed-out state | `/auth/logout` |
| GET | `/api/auth/session` | Public, nullable session | Cookie/JWT | Current user or `null` | `/auth/me`; `users` |
| GET | `/api/auth/me` | Authenticated | Cookie/JWT | Current user | `/auth/me`; `users` |
| POST | `/api/auth/forgot-password` | Public, rate limited | Email | Generic sent state | `/auth/forgot-password`; `password_resets` |
| POST | `/api/auth/reset-password` | Public, rate limited | Reset token, password | Reset state | `/auth/reset-password`; `users`, `password_resets` |
| GET | `/api/enrollments` | Learner | None | Current learner enrolments | `/enrollments`; `enrollments`, courses |
| POST | `/api/enrollments` | Learner | `courseSlug` | Existing or new free/paid enrolment | `/enrollments`; `enrollments`, `payments`, `reward_events` |
| POST | `/api/progress` | Enrolled learner | `lessonSlug`, `completed` | Course progress and completion state | `/progress`; `progress`, `enrollments`, `reward_events` |
| POST | `/api/assessments/submit` | Enrolled learner | `assessmentSlug`, answer map | Score, pass result, attempt ID | `/assessments/submit`; attempts and rewards |
| POST | `/api/vr/submit` | Enrolled learner | `practiceSlug`, score, optional feedback | Practice attempt; no automatic reward | `/vr/submit`; `vr_attempts` |
| GET | `/api/certificates/generate?courseSlug=` | Learner owner | Course slug | Existing certificate | `/certificates/generate`; `certificates` |
| POST | `/api/certificates/generate` | Completed learner | `courseSlug` | Existing or newly issued certificate | `/certificates/generate`; certificates and rewards |
| POST | `/api/payments/payfast/create` | Learner | `courseSlug` | PayFast form action and signed fields | `/payments/payfast-create`; `payments` |
| POST | `/api/payments/payfast/notify` | PayFast relay | Raw form payload | Processing status | `/payments/payfast-notify`; payments, enrolments, rewards |
| POST | `/api/rewards/award` | Facilitator or admin | User, event, points, metadata | Reward event and balance | `/rewards/award`; `reward_events` |
| GET | `/api/dashboard/learner` | Learner owner | None | Own metrics, courses, certificates, events | `/dashboard/learner`; learner-owned tables |
| GET | `/api/dashboard/facilitator` | Facilitator/admin | None | Assigned courses and learner aggregates | `/dashboard/facilitator`; facilitator-scoped tables |
| GET | `/api/dashboard/employer` | Employer/admin | None | Own listings; learner data restricted | `/dashboard/employer`; employer-owned opportunities |
| GET | `/api/dashboard/admin` | Admin | None | Platform totals and admin records | `/dashboard/admin`; admin-only aggregate queries |
| GET, PUT | `/api/user/profile` | Authenticated owner | Profile fields on PUT | Current profile | `/user/profile`; `users` |
| GET | `/api/integrations/{name}` | Server-configured integration | Integration name | Configuration availability only | External service adapter; no PHP table |

## Validation and Ownership Rules

- Registration always assigns `learner`; elevated roles require an audited admin workflow.
- Paid enrolment requires a `paid` payment row created only by verified PayFast ITN processing.
- Progress, assessments, practice, and certificates require enrolment ownership.
- Employers cannot enumerate platform learners. Organisation assignment and consent tables must exist before learner-level employer reporting is added.
- Admin and facilitator access is enforced in PHP with JWT role checks.
- Lesson resource URLs expire after one hour and are HMAC-signed with `RESOURCE_SIGNING_SECRET`.
- Payment notifications validate ordered signature data, source, merchant, PayFast server response, stored amount, and state transition.

## Example

Request:

```json
POST /api/enrollments
{ "courseSlug": "example-course" }
```

Success:

```json
{
  "ok": true,
  "requestId": "00000000-0000-4000-8000-000000000000",
  "timestamp": "2026-07-10T10:00:00.000Z",
  "data": {
    "enrollmentId": "example-enrolment-id",
    "courseSlug": "example-course",
    "status": "active",
    "progress": 0
  }
}
```

Error:

```json
{
  "ok": false,
  "requestId": "00000000-0000-4000-8000-000000000000",
  "timestamp": "2026-07-10T10:00:00.000Z",
  "error": "An active enrolment is required"
}
```

## Compatibility Notes

The Afrihost schema uses snake_case while browser-facing TypeScript uses camelCase in several views. Route normalisation should remain explicit until a versioned v2 contract is approved; do not add silent ad-hoc aliases in components.
