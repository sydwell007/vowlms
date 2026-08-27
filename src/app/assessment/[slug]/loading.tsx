export default function Loading() {
  return (
    <main aria-busy="true" aria-label="Loading assessment" className="min-h-screen bg-[#f8fbfe]">
      <section className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <div className="mx-auto h-16 w-16 animate-pulse rounded-full bg-slate-100" />
          <div className="mx-auto mt-6 h-4 w-40 animate-pulse rounded bg-slate-100" />
          <div className="mx-auto mt-3 h-8 w-64 animate-pulse rounded bg-slate-200" />
          <div className="mt-6 grid grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
          <div className="mx-auto mt-8 h-11 w-full max-w-xs animate-pulse rounded-lg bg-slate-200" />
        </div>
      </section>
    </main>
  );
}
