import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata = { title: "Announcements" };

export default function AnnouncementsPage() {
  return (
    <main className="premium-page min-h-screen px-5 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1166c8]">Learner updates</p>
        <h1 className="mt-3 text-4xl font-semibold text-ink">Announcements</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
          Confirmed platform and academy notices will appear here after the authorised publishing workflow is connected.
        </p>

        <section className="mt-10 rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
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
