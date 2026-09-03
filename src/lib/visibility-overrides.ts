import { getAllAcademies } from "@/lib/data";
import { isHiddenAcademyCategory } from "@/lib/academy-launch";
import { allGroupings } from "@/data/course-groupings";
import { LEARNER_VISIBLE_UPSKILLING_SLUGS } from "@/lib/upskilling-visibility";
import { ecosystemServices } from "@/data/ecosystem-services";

export type VisibilityEntityType = "academy" | "course" | "service";

/** One row from the bridge's `/admin/visibility` table — see route.ts for the contract. */
export type VisibilityOverride = {
  entityType: VisibilityEntityType;
  entityKey: string;
  isVisibleToLearners: boolean;
};

export type VisibilityRow = {
  entityType: VisibilityEntityType;
  entityKey: string;
  label: string;
  /** Secondary line — e.g. "Microsoft Office" for a grouping, empty for academies/services. */
  meta: string;
  /** What Layer 1 (code-level rules) decides today. */
  baselineVisible: boolean;
  /** What the admin has explicitly set, if anything — null means "inherits baseline". */
  overrideVisible: boolean | null;
  /** baselineVisible, unless overridden. */
  effectiveVisible: boolean;
};

function overrideKey(entityType: VisibilityEntityType, entityKey: string) {
  return `${entityType}:${entityKey}`;
}

/**
 * Merges the code-level baseline (Layer 1 — what every learner sees today,
 * with zero backend dependency) with the bridge-persisted overrides (Layer 2)
 * into one row per academy / Upskilling course / ecosystem service, for the
 * admin control center to render and edit.
 */
export function buildVisibilityRows(overrides: VisibilityOverride[]): VisibilityRow[] {
  const overrideMap = new Map(overrides.map((o) => [overrideKey(o.entityType, o.entityKey), o.isVisibleToLearners]));
  const rows: VisibilityRow[] = [];

  for (const academy of getAllAcademies()) {
    const baselineVisible = !isHiddenAcademyCategory(academy.category, null);
    const overrideVisible = overrideMap.get(overrideKey("academy", academy.category)) ?? null;
    rows.push({
      entityType: "academy",
      entityKey: academy.category,
      label: academy.name,
      meta: "",
      baselineVisible,
      overrideVisible,
      effectiveVisible: overrideVisible ?? baselineVisible,
    });
  }

  for (const grouping of allGroupings) {
    const baselineVisible = LEARNER_VISIBLE_UPSKILLING_SLUGS.has(grouping.slug);
    const overrideVisible = overrideMap.get(overrideKey("course", grouping.slug)) ?? null;
    rows.push({
      entityType: "course",
      entityKey: grouping.slug,
      label: grouping.title,
      meta: "Upskilling",
      baselineVisible,
      overrideVisible,
      effectiveVisible: overrideVisible ?? baselineVisible,
    });
  }

  for (const service of ecosystemServices) {
    const overrideVisible = overrideMap.get(overrideKey("service", service.slug)) ?? null;
    rows.push({
      entityType: "service",
      entityKey: service.slug,
      label: service.name,
      meta: "",
      baselineVisible: service.learnerVisible,
      overrideVisible,
      effectiveVisible: overrideVisible ?? service.learnerVisible,
    });
  }

  return rows;
}
