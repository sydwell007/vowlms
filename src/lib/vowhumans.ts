import type {
  VowHumanPlacement,
  VowHumanPresenterConfig,
  VowHumanRole,
} from "@/types/lms";

export const VOWHUMANS_ORIGIN = "https://vowhumans.com";

export const vowHumanRoles: Array<{ value: VowHumanRole; label: string }> = [
  { value: "presenter", label: "Course Presenter" },
  { value: "mentor", label: "Mentor" },
  { value: "tutor", label: "Tutor" },
  { value: "field-expert", label: "Field Expert" },
];

export const vowHumanPlacements: Array<{
  value: VowHumanPlacement;
  label: string;
}> = [
  { value: "after-introduction", label: "After lesson introduction" },
  { value: "before-content", label: "Before reading material" },
  { value: "after-content", label: "After lesson content" },
];

export const emptyVowHumanPresenter: VowHumanPresenterConfig = {
  enabled: false,
  embedUrl: "",
  presenterName: "GoalVow AI Course Presenter",
  introduction: "Meet your AI learning guide for this lesson.",
  placement: "before-content",
  role: "presenter",
  expertise: "",
  cameraEnabled: true,
  microphoneEnabled: true,
};

export function isAllowedVowHumansUrl(value: string): boolean {
  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" &&
      url.hostname === "vowhumans.com" &&
      url.port === "" &&
      url.username === "" &&
      url.password === "" &&
      url.search === "" &&
      url.hash === "" &&
      /^\/embed\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+\/?$/.test(url.pathname)
    );
  } catch {
    return false;
  }
}

export function getVowHumanRoleLabel(role: VowHumanRole): string {
  return vowHumanRoles.find((item) => item.value === role)?.label ?? "Course Presenter";
}

export function validateVowHumanPresenter(
  config: VowHumanPresenterConfig,
): string[] {
  const errors: string[] = [];
  if (config.embedUrl && !isAllowedVowHumansUrl(config.embedUrl)) {
    errors.push(
      "Use an approved HTTPS URL in the format https://vowhumans.com/embed/{id}/{slug}.",
    );
  }
  if (!config.enabled) return errors;
  if (!config.embedUrl) {
    errors.push("Presenter embed URL is required.");
  }
  if (!config.presenterName.trim()) errors.push("Presenter name is required.");
  if (!config.introduction.trim()) errors.push("Presenter introduction is required.");
  if (!vowHumanRoles.some((item) => item.value === config.role)) {
    errors.push("Select a supported presenter role.");
  }
  if (!vowHumanPlacements.some((item) => item.value === config.placement)) {
    errors.push("Select a supported lesson placement.");
  }

  return errors;
}

function toBoolean(value: unknown, fallback: boolean) {
  if (value === true || value === 1 || value === "1") return true;
  if (value === false || value === 0 || value === "0") return false;
  return fallback;
}

function toStringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

export function normalizeVowHumanPresenter(
  input: Record<string, unknown>,
): VowHumanPresenterConfig | undefined {
  const enabled = toBoolean(input.vowhuman_enabled ?? input.enabled, false);
  const embedUrl = toStringValue(input.vowhuman_embed_url ?? input.embedUrl);
  const roleValue = toStringValue(input.vowhuman_role ?? input.role, "presenter");
  const placementValue = toStringValue(
    input.vowhuman_placement ?? input.placement,
    "before-content",
  );

  const role = vowHumanRoles.some((item) => item.value === roleValue)
    ? (roleValue as VowHumanRole)
    : "presenter";
  const placement = vowHumanPlacements.some((item) => item.value === placementValue)
    ? (placementValue as VowHumanPlacement)
    : "before-content";

  const config: VowHumanPresenterConfig = {
    enabled,
    embedUrl,
    presenterName: toStringValue(
      input.vowhuman_presenter_name ?? input.presenterName,
      emptyVowHumanPresenter.presenterName,
    ),
    introduction: toStringValue(
      input.vowhuman_intro ?? input.introduction,
      emptyVowHumanPresenter.introduction,
    ),
    placement,
    role,
    expertise: toStringValue(input.vowhuman_expertise ?? input.expertise),
    cameraEnabled: toBoolean(
      input.vowhuman_camera_enabled ?? input.cameraEnabled,
      true,
    ),
    microphoneEnabled: toBoolean(
      input.vowhuman_microphone_enabled ?? input.microphoneEnabled,
      true,
    ),
  };

  if (validateVowHumanPresenter(config).length > 0) return undefined;
  return config;
}
