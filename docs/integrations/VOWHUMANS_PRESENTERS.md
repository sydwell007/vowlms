# VowHumans Presenters in VowLMS

## Capability

VowLMS can assign one approved VowHumans digital person to any lesson as a:

- Course presenter
- Mentor
- Tutor
- Field expert

The presenter is optional learning support. It never controls lesson completion,
and ordinary reading material, media, downloads, assessments, and navigation
remain available when VowHumans is offline or media permission is denied.

## Security Model

- Store only a structured embed URL, never iframe HTML.
- Accepted format: `https://vowhumans.com/embed/{digital-human-id}/{embed-slug}`.
- HTTPS, exact hostname, empty port, no credentials, no query string, and no
  fragment are required.
- Validation runs in the admin UI, the Next.js route handler, and Afrihost PHP.
- The PHP mutation endpoint requires the bridge key, a valid JWT, and `admin` role.
- The iframe is created only after an explicit learner action and is removed on
  close, releasing its browser media session.
- VowLMS does not capture or store camera or microphone data.
- Privacy-safe browser events are emitted as `vowlms:presenter-event` with only
  the lesson slug and one of: `presenter_started`, `presenter_loaded`,
  `presenter_closed`, or `presenter_failed`.

## VowHumans Repository Change Required

As verified on 2026-08-24, the approved embed route currently returns
`X-Frame-Options: SAMEORIGIN`, which blocks cross-origin embedding. Change only
the VowHumans `/embed/*` response policy:

1. Do not send `X-Frame-Options` on `/embed/*` responses.
2. Keep restrictive framing headers on Studio, admin, account, and API routes.
3. Replace `frame-ancestors *` on `/embed/*` with:

```text
Content-Security-Policy: frame-ancestors https://vowlms.vercel.app https://vowlms.co.za https://goalvow.com;
```

4. If VowHumans reports detailed lifecycle states to its parent, use only
   `window.parent.postMessage(..., "https://vowlms.vercel.app")` with these
   message types: `vowhumans:loaded`, `vowhumans:permission-denied`,
   `vowhumans:unavailable`, and `vowhumans:error`.
5. Never post tokens, transcripts, camera data, microphone data, or Studio URLs.

## Deployment Order

1. Back up the Afrihost database and PHP API directory.
2. Import `public/sql/018_vowhuman_presenters.sql` in phpMyAdmin.
3. Upload `public/php/api/admin/lessons.php`.
4. Upload the updated `public/php/api/lessons/index.php`.
5. Upload the updated hidden `public/php/.htaccess`.
6. Run `public/sql/verify_schema.sql`.
7. Deploy the Next.js repository to Vercel.
8. Apply the route-only VowHumans header change above.
9. Sign in to VowLMS as an admin and open `/dashboard/admin/lessons`.

No new environment variable is required.

## Add Another Digital Human

1. Publish an embed-enabled digital human in VowHumans.
2. Copy only its approved `/embed/{id}/{slug}` URL.
3. In VowLMS, open **Admin > AI lesson presenters**.
4. Search for and select the lesson.
5. Choose Presenter, Mentor, Tutor, or Field expert.
6. Add the display name, expertise, learner introduction, placement, and only
   the permissions that digital human needs.
7. Use **Preview presenter**.
8. Enable the guide and save.
9. Open the learner lesson in a separate tab and complete a final media test.

No VowLMS source-code change or Vercel redeployment is needed for later
presenters after this feature is deployed.

## Future Content Blocks

The current schema deliberately adds the smallest safe set of optional fields
to `lessons`; this repository does not yet have an ordered lesson-content-block
model. When lessons need multiple presenters or freely interleaved text, video,
downloads, quizzes, VR activities, and digital humans, migrate these settings
into an ordered `lesson_content_blocks` table. Keep the same URL validator and
admin-only mutation policy when that architecture is introduced.
