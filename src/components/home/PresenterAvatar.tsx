import type { LucideIcon } from "lucide-react";

/** Represents a VowHumans role without implying a specific real person. */
export function PresenterAvatar({
  color,
  Icon,
  size = "md",
}: {
  color: string;
  Icon: LucideIcon;
  size?: "md" | "lg";
}) {
  const dims = size === "lg" ? "h-24 w-24" : "h-11 w-11";
  const iconSize = size === "lg" ? "h-8 w-8" : "h-5 w-5";

  return (
    <div
      className={`flex ${dims} shrink-0 items-center justify-center rounded-md border`}
      style={{ borderColor: `${color}4d`, backgroundColor: `${color}18`, color }}
    >
      <Icon className={iconSize} aria-hidden="true" />
    </div>
  );
}
