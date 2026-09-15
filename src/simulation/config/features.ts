import type { ModeAvailability } from "@/simulation/types";

function enabled(value: string | undefined, fallback: boolean) {
  if (value === undefined || value === "") return fallback;
  return value.toLowerCase() === "true";
}

export const vrFeatureFlags = {
  legacy: enabled(process.env.VR_SKILLS_LEGACY_ENABLED, true),
  adaptive: enabled(process.env.VR_SKILLS_ADAPTIVE_ENABLED, true),
  immersive: enabled(process.env.VR_SKILLS_IMMERSIVE_ENABLED, true),
  vowHumans: enabled(process.env.VOWHUMANS_ENABLED, false),
  vowRewards: enabled(process.env.VOWREWARDS_ENABLED, false),
  plugConnect: enabled(process.env.PLUGCONNECT_ENABLED, false),
  webXr: enabled(process.env.WEBXR_ENABLED, true),
};

export function getModeAvailability(courseSlug: string, mode: "legacy" | "adaptive" | "immersive"): ModeAvailability {
  void courseSlug;
  if (mode === "legacy") return vrFeatureFlags.legacy ? "available" : "locked";
  if (mode === "adaptive") return vrFeatureFlags.adaptive ? "beta" : "locked";
  return vrFeatureFlags.immersive ? "beta" : "locked";
}
