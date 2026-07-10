# VowLMS Test Plan

## Automated Gates

Run in this order:

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

PHP syntax must also be checked on a host with PHP installed:

```bash
find public/php -name '*.php' -print0 | xargs -0 -n1 php -l
```

## Role-Based End-to-End Matrix

| Journey | Visitor | Learner | Facilitator | Employer | Admin |
|---|---:|---:|---:|---:|---:|
| Browse academies/courses | Allow | Allow | Allow | Allow | Allow |
| Register | Allow as learner | N/A | N/A | N/A | N/A |
| Sign in/out and restore session | Test | Test | Test | Test | Test |
| Enrol free course | Redirect to sign-in | Allow | Deny unless learner flow | Deny | Deny unless test learner |
| Start paid checkout | Redirect | Allow sandbox only | Deny | Deny | Deny unless test learner |
| Complete lesson | Deny | Own active enrolment | Deny | Deny | Test with authorised account |
| Submit assessment | Deny | Own active enrolment | Review only when implemented | Deny | Authorised audit only |
| View learner dashboard | Deny | Own data | Deny | Deny | Admin policy decision |
| Facilitator dashboard | Deny | Deny | Assigned scope | Deny | Allow |
| Employer dashboard | Deny | Deny | Deny | Own listings; no unassigned learner data | Allow |
| Admin dashboard | Deny | Deny | Deny | Deny | Allow |
| Generate certificate | Deny | Own completed course | Deny | Deny | Authorised support only |
| Award rewards | Deny | Deny | Allow within approved scope | Deny | Allow |

## Core Scenarios

1. Register with valid data; verify role is learner regardless of tampered role field.
2. Submit invalid, weak, duplicate, and malformed registration data.
3. Sign in with valid/invalid credentials; confirm generic error and rate limit.
4. Restore and clear the HttpOnly session across refresh and sign-out.
5. Search and filter courses; verify empty and pagination states on mobile.
6. Open course details and verify CTA states: signed out, free, paid, enrolled, completed, unavailable.
7. Enrol in a free course twice; verify one enrolment and one enrol reward.
8. Create a PayFast sandbox payment; do not activate from browser return.
9. Send valid, invalid-signature, wrong-merchant, wrong-amount, duplicate, and conflicting PayFast ITNs.
10. Mark a lesson complete twice; verify progress and reward idempotency.
11. Submit an assessment twice; verify reward occurs only on the first pass.
12. Attempt progress, assessment, practice, and certificate actions without course ownership.
13. Verify certificate eligibility and unique certificate IDs.
14. Verify signed resource URL success, tamper failure, and expiry failure.
15. Verify `/php`, `/sql`, and archive paths return 404 in production.

## Browser Matrix

- Desktop: 1440 x 900 and 1920 x 1080.
- Tablet: 768 x 1024.
- Mobile: 390 x 844 and 360 x 800.
- Keyboard-only navigation and visible focus.
- 200% zoom and reflow.
- Reduced-motion preference.
- Slow network/offline shell; confirm private/API content is not cached.

## Data Safety

Use dedicated test accounts and PayFast sandbox. Do not create real payments, production certificates, learner results, or employer records during diagnostics. Restore or remove approved test data after verification.
