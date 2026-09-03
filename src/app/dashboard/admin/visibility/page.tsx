import type { Metadata } from "next";
import { buildVisibilityRows } from "@/lib/visibility-overrides";
import { fetchVisibilityOverrides } from "@/lib/admin/visibility-service";
import { VisibilityControlCenter } from "@/components/admin/VisibilityControlCenter";

export const metadata: Metadata = { title: "Visibility control center" };

export default async function AdminVisibilityPage() {
  const { overrides, connected } = await fetchVisibilityOverrides();
  const rows = buildVisibilityRows(overrides);

  return (
    <main className="premium-page">
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1166c8]">Admin</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">Visibility control center</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Choose which academies, Upskilling courses, and ecosystem services learners can see across
          VowLMS. Everything is admin-only by default until you switch it on here.
        </p>

        <VisibilityControlCenter initialRows={rows} connected={connected} />
      </div>
    </main>
  );
}
