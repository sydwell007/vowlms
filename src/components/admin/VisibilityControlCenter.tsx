"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";
import type { VisibilityEntityType, VisibilityRow } from "@/lib/visibility-overrides";

type Props = {
  initialRows: VisibilityRow[];
  /** False when the bridge or its `/admin/visibility` endpoint isn't reachable yet. */
  connected: boolean;
};

const SECTIONS: { type: VisibilityEntityType; title: string; description: string }[] = [
  { type: "academy", title: "Academies", description: "Upskilling is always on for learners — everything else stays admin-only until you turn it on." },
  { type: "course", title: "Upskilling courses", description: "The 20 complete courses are on by default. Microsoft Office and any unfinished course stay admin-only." },
  { type: "service", title: "Ecosystem services", description: "VowRewards is built-in and on by default. Every other service is admin-only until it's ready." },
];

function Switch({ checked, disabled, onChange }: { checked: boolean; disabled?: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        checked ? "bg-[#1166c8]" : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-[1.375rem]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export function VisibilityControlCenter({ initialRows, connected }: Props) {
  const [rows, setRows] = useState(initialRows);
  const [query, setQuery] = useState("");
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const stats = useMemo(() => {
    const bySection = new Map<VisibilityEntityType, { live: number; total: number }>();
    for (const row of rows) {
      const current = bySection.get(row.entityType) ?? { live: 0, total: 0 };
      current.total += 1;
      if (row.effectiveVisible) current.live += 1;
      bySection.set(row.entityType, current);
    }
    return bySection;
  }, [rows]);

  async function setOverride(row: VisibilityRow, isVisibleToLearners: boolean | null) {
    const key = `${row.entityType}:${row.entityKey}`;
    const previous = rows;
    setPendingKey(key);
    setRows((current) =>
      current.map((r) =>
        r.entityType === row.entityType && r.entityKey === row.entityKey
          ? { ...r, overrideVisible: isVisibleToLearners, effectiveVisible: isVisibleToLearners ?? r.baselineVisible }
          : r,
      ),
    );

    try {
      const res = await fetch("/api/admin/visibility", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ entityType: row.entityType, entityKey: row.entityKey, isVisibleToLearners }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok || !payload?.ok) throw new Error(payload?.error ?? "Could not save this change.");
      toast.success(
        isVisibleToLearners === null
          ? `${row.label} reset to its default.`
          : `${row.label} is now ${isVisibleToLearners ? "visible to learners" : "admin-only"}.`,
      );
    } catch (error) {
      setRows(previous);
      toast.error(error instanceof Error ? error.message : "Could not save this change.");
    } finally {
      startTransition(() => setPendingKey(null));
    }
  }

  return (
    <div className="mt-8">
      {!connected ? (
        <div role="alert" className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          <span className="font-semibold">Not connected to the visibility backend yet.</span> Showing
          platform defaults below — toggles are disabled until the backend is wired up.
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        {SECTIONS.map((section) => {
          const stat = stats.get(section.type);
          return (
            <div key={section.type} className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-2xl font-semibold text-ink">
                {stat?.live ?? 0} <span className="text-base font-normal text-muted">of {stat?.total ?? 0}</span>
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-muted">{section.title} live</p>
            </div>
          );
        })}
      </div>

      {SECTIONS.map((section) => {
        const sectionRows = rows
          .filter((r) => r.entityType === section.type)
          .filter((r) => (section.type === "course" ? r.label.toLowerCase().includes(query.trim().toLowerCase()) : true));

        return (
          <section key={section.type} className="mt-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-ink">{section.title}</h2>
                <p className="mt-1 max-w-xl text-sm leading-6 text-muted">{section.description}</p>
              </div>
              {section.type === "course" ? (
                <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                  <Search aria-hidden="true" className="h-4 w-4 text-muted" />
                  <span className="sr-only">Search Upskilling courses</span>
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search courses"
                    className="w-40 bg-transparent text-sm outline-none placeholder:text-muted"
                  />
                </label>
              ) : null}
            </div>

            <div className="mt-4 divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
              {sectionRows.map((row) => {
                const key = `${row.entityType}:${row.entityKey}`;
                const isOverridden = row.overrideVisible !== null;
                return (
                  <div key={key} className="flex items-center justify-between gap-4 px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">{row.label}</p>
                      <p className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                        <span className={row.effectiveVisible ? "text-emerald-600" : "text-slate-500"}>
                          {row.effectiveVisible ? "Live to learners" : "Admin-only"}
                        </span>
                        {isOverridden ? (
                          <>
                            <span aria-hidden="true">·</span>
                            <button
                              type="button"
                              onClick={() => setOverride(row, null)}
                              disabled={!connected || pendingKey === key}
                              className="font-semibold text-[#1166c8] underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              Reset to default ({row.baselineVisible ? "live" : "admin-only"})
                            </button>
                          </>
                        ) : null}
                      </p>
                    </div>
                    <Switch
                      checked={row.effectiveVisible}
                      disabled={!connected || pendingKey === key}
                      onChange={() => setOverride(row, !row.effectiveVisible)}
                    />
                  </div>
                );
              })}
              {sectionRows.length === 0 ? (
                <p className="px-5 py-6 text-sm text-muted">No matches.</p>
              ) : null}
            </div>
          </section>
        );
      })}
    </div>
  );
}
