export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-6 lg:px-8" aria-busy="true" aria-label="Loading page">
      <div className="h-3 w-32 animate-pulse rounded bg-slate-200" />
      <div className="mt-5 h-10 max-w-xl animate-pulse rounded bg-slate-200" />
      <div className="mt-4 h-5 max-w-2xl animate-pulse rounded bg-slate-100" />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-48 animate-pulse rounded-lg border border-slate-200 bg-white" />
        ))}
      </div>
    </main>
  );
}
