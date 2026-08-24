import {
  badRequest,
  bridgeUnavailable,
  forbidden,
  ok,
  serverError,
  unauthorized,
} from "@/lib/api/responses";
import { bridgePut, BridgeError, isBridgeConfigured } from "@/lib/bridge";
import {
  normalizeVowHumanPresenter,
  validateVowHumanPresenter,
  vowHumanPlacements,
  vowHumanRoles,
} from "@/lib/vowhumans";

type RouteContext = { params: Promise<{ slug: string }> };

export async function PUT(request: Request, context: RouteContext) {
  if (!isBridgeConfigured()) return bridgeUnavailable();

  const raw = await request.json().catch(() => null);
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return badRequest("Presenter settings are required");
  }

  const presenterInput = raw as Record<string, unknown>;
  const role = presenterInput.role ?? presenterInput.vowhuman_role;
  const placement =
    presenterInput.placement ?? presenterInput.vowhuman_placement;
  if (
    typeof role !== "string" ||
    !vowHumanRoles.some((option) => option.value === role)
  ) {
    return badRequest("Select a supported presenter role");
  }
  if (
    typeof placement !== "string" ||
    !vowHumanPlacements.some((option) => option.value === placement)
  ) {
    return badRequest("Select a supported lesson placement");
  }

  const config = normalizeVowHumanPresenter(presenterInput);
  if (!config) return badRequest("Presenter settings are invalid");

  const validationErrors = validateVowHumanPresenter(config);
  if (validationErrors.length > 0) return badRequest(validationErrors[0]);

  const { slug } = await context.params;
  const payload = {
    vowhuman_enabled: config.enabled,
    vowhuman_embed_url: config.embedUrl,
    vowhuman_presenter_name: config.presenterName,
    vowhuman_intro: config.introduction,
    vowhuman_placement: config.placement,
    vowhuman_role: config.role,
    vowhuman_expertise: config.expertise,
    vowhuman_camera_enabled: config.cameraEnabled,
    vowhuman_microphone_enabled: config.microphoneEnabled,
  };

  try {
    return ok(await bridgePut(`/admin/lessons/${encodeURIComponent(slug)}`, payload));
  } catch (error) {
    if (error instanceof BridgeError && error.status === 401) return unauthorized();
    if (error instanceof BridgeError && error.status === 403) {
      return forbidden("Admin access required");
    }
    if (error instanceof BridgeError) return serverError(error.message);
    return serverError("Failed to update lesson presenter settings");
  }
}
