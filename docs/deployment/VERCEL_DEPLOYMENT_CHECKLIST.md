# Vercel Deployment Checklist

## Environment Names

Configure values in Vercel, never in Git:

- `NEXT_PUBLIC_APP_URL`
- `BRIDGE_BASE_URL`
- `BRIDGE_API_KEY`
- `RESOURCE_SIGNING_SECRET`
- `JWT_SECRET`
- `PAYFAST_MERCHANT_ID`
- `PAYFAST_MERCHANT_KEY`
- `PAYFAST_PASSPHRASE`
- `PAYFAST_SANDBOX`
- Ecosystem API URL/key pairs as enabled
- SMTP names only if Next.js begins sending email directly

Moodle tokens are migration/operator secrets and should not be added to browser-visible variables.

## Preview

- Use a preview API/database or leave the bridge absent and accept zero-state dashboards plus unavailable identity, profile, payment, and certificate operations locally.
- Never point an untrusted preview deployment at production PayFast or production learner data.
- Set `NEXT_PUBLIC_APP_URL` to the preview origin when testing return URLs.

## Production

1. Rotate all credentials identified by the baseline audit.
2. Deploy and verify Afrihost SQL/PHP first.
3. Confirm `public/php/**`, `public/sql/**`, and `public/php.zip` are excluded by `.vercelignore`.
4. Build command: `npm run build`.
5. Node runtime: 22.15 or later.
6. Confirm the canonical domain in `NEXT_PUBLIC_APP_URL`.
7. Confirm bridge CORS `FRONTEND_ORIGIN` exactly matches the production origin.
8. Keep PayFast sandbox enabled until sandbox ITN verification passes.

## Post-Deployment

- `/`, `/academies`, `/courses`, course details, support, impact, ecosystem, and investors load.
- `/robots.txt` and `/sitemap.xml` use the production domain.
- `/php`, `/php/...`, `/sql`, `/sql/...`, and `/php.zip` return 404.
- Unauthenticated dashboard, lesson, assessment, certificate, profile, and results routes redirect to sign-in.
- Sign-up creates a learner even if a request is tampered with to include another role.
- Dashboard APIs reject incorrect roles.
- Browser console has no errors and network requests have no unexpected 4xx/5xx responses.
- Images render at desktop, tablet, and mobile sizes without layout shift.
- Service worker does not cache `/api` or authenticated pages.
- PayFast sandbox return, cancel, valid ITN, invalid signature, amount mismatch, and replay paths are checked.

## Rollback

Promote the last known-good Vercel deployment. If the release also changed Afrihost, restore the previous PHP directory and follow the SQL rollback/backup guidance. Do not keep a new frontend against an incompatible old API contract.
