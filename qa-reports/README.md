# QA reports

Generated output lives here. `pre-launch-frontend-report.md` and
`launch-readiness-recommendations.md` are committed as the latest snapshot;
`playwright-results.json` is regenerated per run and gitignored.

## Running the full frontend QA pass

```
npm run qa:report                 # everything, including a local Lighthouse pass
SKIP_LIGHTHOUSE=1 npm run qa:report   # skip the slow Lighthouse step
QA_TARGET_URL=https://vowlms.vercel.app npm run qa:report   # against a deployed URL
RUN_DESTRUCTIVE_TESTS=1 npm run qa:report   # also run auth/enrollment/assessment/certification (see tests/e2e/README.md)
```

## Scheduling `run-all-diagnostics.php` on Afrihost (cPanel cron)

Afrihost's cPanel exposes **Cron Jobs** under Advanced. Add a daily job (the week
before launch, then weekly after) that hits the endpoint with `curl`, since it's a
GET request requiring the bridge key and an admin/facilitator bearer token:

```
curl -s -X GET \
  -H "X-Bridge-Key: $BRIDGE_API_KEY" \
  -H "Authorization: Bearer $ADMIN_JWT" \
  "https://<afrihost-domain>/php/api/qa/run-all-diagnostics.php" \
  >> /home/<user>/logs/vowlms-diagnostics.log 2>&1
```

A long-lived admin JWT for this purpose should be generated once and stored in
cPanel's cron environment (not committed anywhere) — `JWT::encode()`
(`public/php/lib/jwt.php`) accepts a custom `$ttl` in seconds if a longer-lived
token is needed than the default 30 days.

Every run is logged to the `integration_health_log` table regardless of how it
was triggered, so the response body doesn't need to be parsed by the cron job
itself — checking the log table (or an uptime monitor watching for `LAUNCH_READY:
false` in the JSON body) is enough.
