# VowLMS Outstanding Business Decisions

These are not engineering facts and must not be invented in public content.

| Decision | Required owner/evidence | Product impact | Launch status |
|---|---|---|---|
| Canonical production domain beyond current Vercel URL | Business + DNS owner | Canonicals, PayFast returns, email links, CORS | Current Vercel URL is configured; custom domain pending decision |
| Academy live/planned schedule | Academy executives | Navigation, sitemap, cards, coming-soon labels | Four visible; three hidden planned in central config |
| Accreditation per programme | Academic/legal owner and accreditor evidence | Course claims, schema, certificates | Do not claim until verified |
| Certificate meaning and verification policy | Academic + legal | Completion copy and employer use | Course completion record only unless approved otherwise |
| Course pricing, refunds, funding, and tax rules | Finance/legal | Checkout and support policy | PayFast integrity exists; commercial policy sign-off pending |
| Learner support hours and SLA | Support operations | Contact copy, forms, incident response | Existing verified channels only; no response-time promise |
| Email verification and account recovery owner | Support/security | Registration and password reset | SMTP/staging process requires approval |
| Account deletion, retention, and data-rights workflow | Privacy/legal/data owner | POPIA operations | Policy/process and response ownership pending |
| Organisation membership and learner consent | Product/legal/employer owner | Employer dashboards/group learning | Learner-level employer data intentionally withheld |
| Facilitator assignment and assessment moderation | Academic operations | Facilitator dashboard | Partial until assignment workflow is approved |
| VowRewards redemption value/rules | Rewards/finance/legal | Public rewards promises | Earn events exist; redemption claims require approval |
| Opportunity verification and matching | Partnerships/legal | Opportunity page and notifications | No placement guarantees |
| Learning Hub locations/capacity/partners | Operations/partnerships | Hub page and enquiries | Planned data only unless verified |
| Analytics provider, consent, and event retention | Privacy/product/engineering | Funnel and investor evidence | Event plan documented; implementation pending approval |
| Investor metrics and data room publication | Finance/executive/legal | Investor hub | Only evidence-backed dated metrics may be published |
| VowHumans service level and GPU budget | VowHumans/finance/operations | Presenter availability and scaling | Measure queue, render, network, and audio pipeline before resizing pods |
| Mobile/offline content entitlement | Academic/security/product | Offline marketing and caching | Public offline fallback exists; secure lesson download scope needs approval |
| Accessibility conformance statement/review cadence | Product/legal/accessibility owner | Accessibility page | Engineering target is WCAG 2.2 AA; formal claim needs audit |

## Decision Recording Rule

Each approved decision needs an owner, approval date, source/evidence link, effective environment, review date, and exact public wording. Configuration changes should be centralised; legal or commercial changes must not be hidden in component copy.
