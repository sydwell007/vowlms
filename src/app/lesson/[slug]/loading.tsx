export default function Loading() {
  return (
    <main aria-busy="true" aria-label="Loading lesson" className="flex min-h-screen flex-col bg-[#f8fbfe]">
      <div className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 h-14" />
      <div className="flex flex-1">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white p-4 lg:block">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-1.5 w-full animate-pulse rounded-full bg-slate-100" />
          <div className="mt-6 space-y-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-9 animate-pulse rounded-lg bg-slate-100" />
            ))}
          </div>
        </aside>
        <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="h-3 w-56 animate-pulse rounded bg-slate-200" />
          <div className="mt-4 h-9 max-w-lg animate-pulse rounded bg-slate-200" />
          <div className="mt-6 aspect-video w-full animate-pulse rounded-2xl bg-slate-200" />
          <div className="mt-8 h-40 animate-pulse rounded-xl border border-slate-200 bg-white" />
        </div>
      </div>
    </main>
  );
}
