"use client";

import { goalTiles, type GoalTile } from "@/data/goal-tiles";
import { getAcademyAccentColor } from "@/lib/academy-colors";
import { getCourseSummaries } from "@/lib/data";

function tileCourseCount(tile: GoalTile): number | null {
  if (!tile.academyCategory) return null;
  return getCourseSummaries().filter((course) => course.academyCategory === tile.academyCategory).length;
}

export function GoalTileGrid({ onSelect }: { onSelect: (tile: GoalTile) => void }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Learning goals">
      {goalTiles.map((tile) => {
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
