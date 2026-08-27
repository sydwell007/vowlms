export default function Loading() {
  return (
    <main aria-busy="true" aria-label="Loading course preview">
      <section className="bg-[#06111f] py-16 md:py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <div>
            <div className="h-3 w-40 animate-pulse rounded bg-white/10" />
            <div className="mt-6 h-10 max-w-xl animate-pulse rounded bg-white/10" />
            <div className="mt-5 h-5 max-w-2xl animate-pulse rounded bg-white/8" />
            <div className="mt-2 h-5 max-w-lg animate-pulse rounded bg-white/8" />
            <div className="mt-8 flex gap-3">
              <div className="h-11 w-40 animate-pulse rounded-lg bg-white/10" />
              <div className="h-11 w-40 animate-pulse rounded-lg bg-white/10" />
            </div>
          </div>
          <div className="h-64 animate-pulse rounded-2xl bg-white/8" />
        </div>
      </section>
      <section className="border-b border-slate-100 bg-white py-6">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-6 px-5 sm:px-6 sm:grid-cols-4 lg:px-8">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-10 animate-pulse rounded bg-slate-100" />
          ))}
        </div>
      </section>
      <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl border border-slate-200 bg-white" />
          ))}
        </div>
      </div>
    </main>
  );
}
