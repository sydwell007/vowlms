import Link from "next/link";
import { getCourses } from "@/lib/data";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata = {
  title: "My Certificates · GoalVow",
  description: "View and download your GoalVow certificates. Share verified achievements with employers via PlugConnect.",
};

export default function CertificatesIndexPage() {
  const allCourses = getCourses();

  const sampleCompleted = allCourses.slice(0, 3);

  return (
    <main className="premium-page">
      <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="premium-section-dark rounded-2xl p-8 text-white mb-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">GoalVow Achievements</p>
              <h1 className="mt-1 text-2xl font-semibold">My Certificates</h1>
              <p className="mt-1 text-sm text-white/70">Verified credentials you have earned on the GoalVow platform.</p>
            </div>
            <div className="flex gap-3">
              <div className="rounded-xl bg-white/8 px-5 py-3 text-center">
                <p className="text-2xl font-semibold text-gold">{sampleCompleted.length}</p>
                <p className="text-xs text-white/60">Earned</p>
              </div>
              <div className="rounded-xl bg-white/8 px-5 py-3 text-center">
                <p className="text-2xl font-semibold text-white">614</p>
                <p className="text-xs text-white/60">Available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Certificates grid */}
        {sampleCompleted.length === 0 ? (
          <div className="premium-card rounded-2xl p-12 text-center">
            <p className="text-4xl mb-4">🏅</p>
            <h2 className="text-xl font-semibold text-ink">No certificates yet</h2>
            <p className="mt-2 text-sm text-muted">Complete a course to earn your first GoalVow certificate.</p>
            <div className="mt-6">
              <ButtonLink href="/courses">Browse courses</ButtonLink>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sampleCompleted.map((course) => (
              <div key={course.slug} className="premium-card rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-br from-[#1e3a8a] to-[#06b6d4] p-6 text-center text-white">
                  <div className="text-4xl mb-2">🏅</div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">Certificate of Completion</p>
                  <h3 className="mt-1 text-base font-semibold leading-tight">{course.title}</h3>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between text-xs text-muted mb-3">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 font-semibold">✓ Verified</span>
                    <span>19 Jun 2026</span>
                  </div>
                  <p className="text-xs text-muted mb-4">
                    ID: <span className="font-mono font-semibold text-ink">GV-{course.slug.slice(0, 6).toUpperCase()}-2026-001</span>
                  </p>
                  <div className="flex gap-2">
                    <Link
                      href={`/certificates/${course.slug}`}
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-center text-xs font-semibold text-ink hover:bg-slate-50 transition"
                    >
                      View
                    </Link>
                    <Link
                      href={`/certificates/${course.slug}`}
                      className="flex-1 rounded-lg bg-gold px-3 py-2 text-center text-xs font-semibold text-[#06111f] hover:bg-[#e8b830] transition"
                    >
                      Download PDF
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Earn more CTA */}
        <div className="mt-10 premium-card-soft rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-ink">Earn more certificates</h2>
            <p className="mt-1 text-sm text-muted">614 courses across 6 academies — each one earns a verifiable GoalVow credential.</p>
          </div>
          <ButtonLink href="/courses" className="shrink-0">Browse all courses</ButtonLink>
        </div>

        {/* Share CTA */}
        <div className="mt-4 rounded-2xl border border-purple-100 bg-purple-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-purple-900">Share with employers</h2>
            <p className="mt-1 text-sm text-purple-700">PlugConnect lets you match your verified certificates to job listings and opportunities automatically.</p>
          </div>
          <ButtonLink href="/opportunities" className="shrink-0">Find opportunities</ButtonLink>
        </div>
      </div>
    </main>
  );
}
