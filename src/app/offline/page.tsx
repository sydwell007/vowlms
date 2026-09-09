export const metadata = {
  title: "Offline",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main className="premium-page">
      <section className="visual-hero hero-learning py-16 text-white md:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Offline mode</p>
          <h1 className="mt-4 max-w-4xl text-balance text-4xl font-semibold">Saved learning will return when your connection is back.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/72">
            VowLMS has a service worker structure for future offline course overviews, lesson text, and progress sync. This page is the fallback for cached navigation.
          </p>
        </div>
      </section>
    </main>
  );
}
