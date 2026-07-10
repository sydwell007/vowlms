import { CertificatesOverview } from "@/components/certificates/CertificatesOverview";

export const metadata = {
  title: "My Certificates - GoalVow",
  description: "View certificate records issued to your VowLMS learner account.",
};

export default function CertificatesIndexPage() {
  return (
    <main className="premium-page">
      <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="premium-section-dark mb-8 rounded-lg p-8 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">GoalVow achievements</p>
          <h1 className="mt-2 text-3xl font-semibold">My certificates</h1>
          <p className="mt-2 text-sm text-white/70">Only records issued to your authenticated learner account are shown.</p>
        </div>
        <CertificatesOverview />
      </div>
    </main>
  );
}
