"use client";

import type { GoalTile, RoleOption } from "@/data/goal-tiles";
import { getAcademyAccentColor } from "@/lib/academy-colors";
import { getRoleCourseCount } from "@/lib/goal-routing";

export function RoleSelector({
  tile,
  onSelect,
  onBack,
}: {
  tile: GoalTile;
  onSelect: (role: RoleOption) => void;
  onBack: () => void;
}) {
  const accent = tile.academyCategory ? getAcademyAccentColor(tile.academyCategory) : "#f5c542";

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-5 text-sm font-semibold text-muted transition hover:text-ink"
      >
        ← Back
      </button>
      <h3 className="text-2xl font-semibold text-ink">Great — now tell us more:</h3>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Role options">
        {tile.roles.map((role) => {
          const count = tile.academyCategory ? getRoleCourseCount(tile.academyCategory, role) : 0;
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onSelect(role)}
              className="premium-card flex flex-col items-start rounded-xl border-l-4 p-5 text-left text-ink transition duration-200 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(6,17,31,0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1166c8]"
              style={{ borderLeftColor: accent }}
            >
              <span className="text-base font-semibold">{role.label}</span>
              <span className="mt-2 text-sm font-medium" style={{ color: accent }}>
                {count} courses available
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
