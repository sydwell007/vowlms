import { Sparkles } from "lucide-react";

/**
 * Thandi's portrait. VowHumans has no stable, publicly-servable static
 * likeness image for this identity — its face is only rendered live,
 * per-session, once a real call starts (`/api/public/v1/embed-face?session_id=...`).
 * Rather than hotlink a session-scoped URL into a static sidebar (which would
 * break) or fabricate a photo, this is a designed portrait mark: a warm
 * gradient bust silhouette with a small "AI" sparkle, consistent with how
 * VowHumans itself discloses every persona here as AI-generated, not a real
 * person.
 */
export function ThandiAvatar({
  size = 40,
  listening = false,
  className = "",
}: {
  size?: number;
  listening?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #4aa3ff 0%, #7c6bf5 55%, #f7d05e 100%)",
      }}
    >
      <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="none" aria-hidden="true">
        <circle cx="12" cy="8.5" r="4" fill="white" fillOpacity="0.92" />
        <path
          d="M4 20c0-3.6 3.58-6.5 8-6.5s8 2.9 8 6.5"
          stroke="white"
          strokeOpacity="0.92"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span
        className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full bg-white shadow-sm"
        style={{ width: size * 0.36, height: size * 0.36 }}
      >
        <Sparkles size={size * 0.22} className="text-[#4aa3ff]" />
      </span>
      {listening ? (
        <span className="absolute -inset-0.5 animate-ping rounded-full border-2 border-[#4aa3ff]/60" />
      ) : null}
    </span>
  );
}
