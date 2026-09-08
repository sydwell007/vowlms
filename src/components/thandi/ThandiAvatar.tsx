import Image from "next/image";
import { Sparkles } from "lucide-react";
import { visualAssets } from "@/lib/visual-assets";

/**
 * Thandi's portrait — a still frame cropped from her own live, disclosed
 * "AI-generated digital human" call (`public/images/thandi-avatar.jpg`), used
 * for the sidebar entry and the panel header/idle state where a live video
 * feed isn't running. The small sparkle badge is kept on top of the photo
 * for the same reason the live call itself always shows it on-screen: this
 * is a synthetic persona, not a photo of a real person, and that stays
 * visible everywhere her face appears, not just during an active call.
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
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-inset ring-white/15 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={visualAssets.thandiAvatar}
        alt="Thandi, VowLMS's AI-generated digital human tutor"
        width={size}
        height={size}
        className="h-full w-full object-cover"
      />
      <span
        className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full bg-white shadow-sm"
        style={{ width: size * 0.36, height: size * 0.36 }}
        title="AI-generated digital human"
      >
        <Sparkles size={size * 0.22} className="text-[#4aa3ff]" />
      </span>
      {listening ? (
        <span className="absolute -inset-0.5 animate-ping rounded-full border-2 border-[#4aa3ff]/60" />
      ) : null}
    </span>
  );
}
