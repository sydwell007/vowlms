import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata = { title: "Announcements", robots: { index: false, follow: false } };

export default function AnnouncementsPage() {
  return (
    <main className="premium-page min-h-screen">
      <section className="visual-hero hero-achievement py-14 text-white md:py-16">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Learner updates</p>
          <h1 className="mt-3 text-4xl font-semibold">Announcements</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/72">
          Confirmed platform and academy notices will appear here after the authorised publishing workflow is connected.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6 lg:px-8">
        <section className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <h2 className="text-xl font-semibold text-ink">No announcements have been published</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted">
            VowLMS does not show demonstration launches, employer activity, events, or reward promotions as live notices.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/dashboard/learner" variant="ink">Learner dashboard</ButtonLink>
            <ButtonLink href="/support" variant="outline">VowSupport</ButtonLink>
          </div>
        </section>
      </div>
    </main>
  );
}
