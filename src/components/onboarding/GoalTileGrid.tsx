"use client";

import { goalTiles, type GoalTile } from "@/data/goal-tiles";
import { getAcademyAccentColor } from "@/lib/academy-colors";
import { getCourseSummaries } from "@/lib/data";
import { isHiddenAcademyCategory } from "@/lib/academy-launch";
import { useSession } from "@/lib/auth/useSession";

function tileCourseCount(tile: GoalTile): number | null {
  if (!tile.academyCategory) return null;
  return getCourseSummaries().filter((course) => course.academyCategory === tile.academyCategory).length;
}

export function GoalTileGrid({ onSelect }: { onSelect: (tile: GoalTile) => void }) {
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Learning goals">
      {visibleTiles.map((tile) => {
        const count = tileCourseCount(tile);
        const accent = tile.academyCategory ? getAcademyAccentColor(tile.academyCategory) : "#f5c542";

        return (
          <button
            key={tile.id}
            type="button"
            aria-label={tile.question}
            onClick={() => onSelect(tile)}
            className="premium-card flex min-h-[180px] flex-col items-start rounded-xl border-t-4 p-6 text-left text-ink transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_54px_rgba(6,17,31,0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1166c8]"
            style={{ borderTopColor: accent }}
          >
            <span className="text-4xl" aria-hidden="true">{tile.icon}</span>
            <p className="mt-4 text-lg font-semibold leading-snug">{tile.question}</p>
            {count !== null ? (
              <span className="mt-auto pt-4 text-sm font-semibold" style={{ color: accent }}>
                → {count} courses
              </span>
            ) : (
              <span className="mt-auto pt-4 text-sm font-semibold text-gold">→ Answer 4 quick questions</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
