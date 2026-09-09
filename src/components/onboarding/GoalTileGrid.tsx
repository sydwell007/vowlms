"use client";

import { BriefcaseBusiness, ChefHat, GraduationCap, Search, TrendingUp, Wrench } from "lucide-react";
import { goalTiles, type GoalTile, type GoalTileId } from "@/data/goal-tiles";
import { getAcademyAccentColor } from "@/lib/academy-colors";
import { isHiddenAcademyCategory } from "@/lib/academy-launch";
import { useSession } from "@/lib/auth/useSession";
import type { CourseSummary } from "@/types/lms";

const goalIcons = {
  kitchen: ChefHat,
  trade: Wrench,
  career: TrendingUp,
  business: BriefcaseBusiness,
  certificate: GraduationCap,
  unsure: Search,
} satisfies Record<GoalTileId, typeof Search>;

function tileCourseCount(tile: GoalTile, courses: CourseSummary[]): number | null {
  if (!tile.academyCategory) return null;
  return courses.filter((course) => course.academyCategory === tile.academyCategory).length;
}

export function GoalTileGrid({
  onSelect,
  courses,
  disabled = false,
}: {
  onSelect: (tile: GoalTile) => void;
  courses: CourseSummary[];
  disabled?: boolean;
}) {
  const session = useSession();
  const role = session.status === "authenticated" ? session.user.role : null;
  // Only offer a goal tile if its academy is actually live for this viewer —
  // otherwise the tile leads to a role list with zero real courses behind
  // it. Tiles with no academyCategory ("certificate"/"unsure") route into
  // the quiz instead and are always shown.
  const visibleTiles = goalTiles.filter(
    (tile) => !tile.academyCategory || !isHiddenAcademyCategory(tile.academyCategory, role),
  );

  return (
    <div
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="Learning goals"
      aria-busy={disabled}
    >
      {visibleTiles.map((tile) => {
        const count = tileCourseCount(tile, courses);
        const accent = tile.academyCategory ? getAcademyAccentColor(tile.academyCategory) : "#f5c542";
        const Icon = goalIcons[tile.id];

        return (
          <button
            key={tile.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(tile)}
            className="premium-card interactive-lift flex min-h-[164px] flex-col items-start rounded-lg border-t-4 p-6 text-left text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1765a6] disabled:cursor-wait"
            style={{ borderTopColor: accent }}
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-md"
              style={{ backgroundColor: `${accent}18`, color: accent }}
            >
              <Icon aria-hidden="true" className="h-5 w-5" />
            </span>
            <p className="mt-4 text-lg font-semibold leading-snug">{tile.question}</p>
            {count !== null ? (
              <span className="mt-auto pt-4 text-sm font-semibold" style={{ color: accent }}>
                → {count} courses
              </span>
            ) : (
              <span className="mt-auto pt-4 text-sm font-semibold text-[#806000]">→ Answer 4 quick questions</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
