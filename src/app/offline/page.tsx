export const metadata = {
  title: "Offline",
};

export default function OfflinePage() {
  return (
    <main className="bg-slate-50 text-ink">
      <section className="mx-auto w-full max-w-4xl px-5 py-16 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-slate-200 bg-white p-8 card-shadow">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1166c8]">Offline mode</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold">Saved learning will return when your connection is back.</h1>
          <p className="mt-5 text-base leading-7 text-muted">
            VowLMS has a service worker structure for future offline course overviews, lesson text, and progress sync. This page is the fallback for cached navigation.
          </p>
        </div>
      </section>
    </main>
  );
}
