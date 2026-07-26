import { getAcademyAccentColor } from "@/lib/academy-colors";

export function AcademyBadge({ name, category }: { name: string; category?: string | null }) {
  const accent = getAcademyAccentColor(category);

  return (
    <span
      className="rounded-full px-3 py-1 text-xs font-semibold"
      style={{ backgroundColor: `${accent}1a`, color: accent }}
    >
      {name}
    </span>
  );
}
