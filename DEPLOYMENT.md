# VowLMS Deployment

Production domain planned: `https://vowlms.co.za`

## Required Services

1. PostgreSQL database for Prisma.
2. Auth secret and production Auth.js configuration.
3. PayFast merchant credentials.
4. API credentials for VowRewards, PlugConnect, VowSupport, SkillsShop, VowTools, and ChefOrder.
5. Mux credentials for future video hosting.
6. Cloudflare R2 credentials for future certificate and media storage.

## Deployment Steps

1. Set all environment variables from `.env.example`.
2. Run `npm install`.
3. Run `npx prisma generate`.
4. Run `npx prisma db push`.
5. Run `npx prisma db seed` for demo data, if needed.
6. Run `npm run build`.
7. Deploy the Next.js app.

## Notes

- The current app uses mock data at runtime so the local build is not blocked by database availability.
- Prisma models are ready for PostgreSQL and can replace the mock data layer incrementally.
- The service worker is intentionally conservative and should be expanded after production cache and offline sync rules are finalized.
- PayFast and ecosystem APIs return safe placeholder responses until real credentials and request signing are connected.
