export default function Loading() {
  return (
    <main aria-busy="true" aria-label="Loading VR practice" className="bg-[#06111f] py-12 md:py-16">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="h-3 w-48 animate-pulse rounded bg-white/10" />
        <div className="mt-6 h-4 w-32 animate-pulse rounded bg-white/10" />
        <div className="mt-4 h-12 max-w-md animate-pulse rounded bg-white/10" />
        <div className="mt-5 h-5 max-w-2xl animate-pulse rounded bg-white/8" />
        <div className="mt-8 grid gap-6 rounded-xl bg-white/5 p-5 md:grid-cols-[1.2fr_0.8fr]">
          <div className="h-80 animate-pulse rounded-xl bg-white/10" />
          <div className="h-80 animate-pulse rounded-xl bg-white/10" />
        </div>
      </div>
    </main>
  );
}
