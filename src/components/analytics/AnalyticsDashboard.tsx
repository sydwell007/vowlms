const reportingAreas = [
  { title: "Learner activity", source: "Users, enrolments, and lesson progress" },
  { title: "Course outcomes", source: "Completions, assessments, and certificates" },
  { title: "Skills Practice", source: "Verified practice attempts and facilitator evidence" },
  { title: "Payments", source: "Verified PayFast payment events only" },
  { title: "Rewards", source: "Idempotent VowRewards events" },
  { title: "Progression", source: "Consent-based opportunity outcomes" },
];

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-900">
        Live analytics are not connected in this frontend preview. No demonstration figures are presented as operational data.
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-ink">Reporting readiness</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
          Connect this view to the authorised admin dashboard endpoint after the Afrihost schema migration is verified. Exports must retain role checks and avoid learner-level personal data unless the requester is authorised.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reportingAreas.map((area) => (
            <article key={area.title} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-sm font-semibold text-ink">{area.title}</h3>
              <p className="mt-2 text-xs leading-5 text-muted">{area.source}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#1166c8]">Awaiting verified data</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
