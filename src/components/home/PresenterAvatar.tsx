/** Abstract animated "AI presenter" avatar — deliberately not a photo. VowLMS's AI presenters
 * are on-demand interactive avatars (via VowHumans), not fixed individual people, so this
 * represents the role visually rather than implying a specific real person. */
export function PresenterAvatar({ color, icon, size = "md" }: { color: string; icon: string; size?: "md" | "lg" }) {
  const dims = size === "lg" ? "h-28 w-28 text-4xl" : "h-16 w-16 text-2xl";

  return (
    <div className={`relative flex ${dims} shrink-0 items-center justify-center`}>
      <span
        className="absolute inset-0 rounded-full animate-ping"
        style={{ backgroundColor: `${color}30`, animationDuration: "2.4s" }}
        aria-hidden="true"
      />
      <span
        className="absolute inset-[6%] rounded-full"
        style={{ background: `radial-gradient(circle at 35% 30%, ${color}, ${color}cc 55%, ${color}66 100%)` }}
        aria-hidden="true"
      />
      <span className="relative" aria-hidden="true">{icon}</span>
    </div>
  );
}
