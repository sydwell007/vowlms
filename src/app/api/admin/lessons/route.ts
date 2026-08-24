import {
  bridgeUnavailable,
  forbidden,
  ok,
  serverError,
  unauthorized,
} from "@/lib/api/responses";
import { bridgeGet, BridgeError, isBridgeConfigured } from "@/lib/bridge";

function errorResponse(error: unknown) {
  if (error instanceof BridgeError && error.status === 401) return unauthorized();
  if (error instanceof BridgeError && error.status === 403) {
    return forbidden("Admin access required");
  }
  if (error instanceof BridgeError) return serverError(error.message);
  return serverError("Failed to load lesson presenter settings");
}

export async function GET(request: Request) {
  if (!isBridgeConfigured()) return bridgeUnavailable();

  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  const suffix = query ? `?q=${encodeURIComponent(query)}` : "";

  try {
    return ok(await bridgeGet(`/admin/lessons${suffix}`));
  } catch (error) {
    return errorResponse(error);
  }
}
