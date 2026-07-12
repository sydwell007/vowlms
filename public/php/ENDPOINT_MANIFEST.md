# PHP Endpoint Manifest

| Route | Method | Access |
|---|---|---|
| `/health` | GET | Public, minimal status |
| `/academies` | GET | Bridge key |
| `/courses`, `/courses/{slug}` | GET | Bridge key |
| `/lessons/{slug}` | GET | Bridge key |
| `/files/serve` | GET/HEAD | Expiring HMAC signature |
| `/user/avatar` | POST/DELETE | Bridge key + bearer token |
| `/auth/register` | POST | Bridge key, rate limited; creates learner only |
| `/auth/login` | POST | Bridge key, rate limited |
| `/auth/logout` | POST | Bridge key |
| `/auth/me` | GET | Bridge key plus JWT |
| `/auth/forgot-password` | POST | Bridge key, rate limited |
| `/auth/reset-password` | POST | Bridge key, rate limited |
| `/enrollments` | GET/POST | Learner JWT |
| `/progress` | POST | Enrolled learner JWT |
| `/assessments/submit` | POST | Enrolled learner JWT |
| `/vr/submit` | POST | Enrolled learner JWT; no automatic reward |
| `/certificates`, `/certificates/generate` | GET/POST | Learner owner JWT |
| `/payments/payfast-create` | POST | Learner JWT |
| `/payments/payfast-notify` | POST | PayFast validation or trusted bridge relay |
| `/rewards/award` | POST | Facilitator/admin JWT |
| `/dashboard/learner` | GET | Learner owner JWT |
| `/dashboard/facilitator` | GET | Facilitator/admin JWT |
| `/dashboard/employer` | GET | Employer/admin JWT, privacy restricted |
| `/dashboard/admin` | GET | Admin JWT |
| `/user/profile` | GET/PUT | Authenticated owner JWT |
| `/opportunities`, `/learning-hubs` | GET | Bridge key |
| `/homepage-sections`, `/ecosystem-services`, `/sidebar-services`, `/support-services`, `/investor-sections` | GET | Public content |
| `/investor-leads`, `/partner-leads`, `/service-interest` | POST | Bridge key |

The former diagnostic endpoint is intentionally excluded from production.
