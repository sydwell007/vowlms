/**
 * Admin visibility overrides — lets the control center
 * (/dashboard/admin/visibility) flip an academy/course/service on or off for
 * learners without a code deploy. Proxies to a PHP/MySQL endpoint on the
 * Afrihost bridge that does not exist yet as of this writing; GET degrades
 * gracefully (returns `connected: false`, no overrides) instead of erroring
 * when the bridge or endpoint isn't reachable, so the page still renders the
 * Layer-1 code-level defaults read-only.
 *
 * PHP/MySQL contract to implement on Afrihost:
 *
 *   Table: site_visibility_overrides
 *     id                      BIGINT PK AUTO_INCREMENT
 *     entity_type             ENUM('academy','course','service')
 *     entity_key              VARCHAR(120)
 *     is_visible_to_learners  TINYINT(1) NOT NULL
 *     updated_by              VARCHAR(120) NULL
 *     updated_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
 *     UNIQUE KEY (entity_type, entity_key)
 *
 *   GET /admin/visibility
 *     -> { overrides: [{ entityType, entityKey, isVisibleToLearners }] }
 *     Admin-role-checked bridge-side (401/403 on failure).
 *
 *   PUT /admin/visibility
 *     body: { entityType, entityKey, isVisibleToLearners: boolean | null }
 *     null deletes the row (reverts to the Layer-1 default) — upsert
 *     otherwise. Admin-role-checked bridge-side.
 */
import {
  badRequest,
  forbidden,
  ok,
  serverError,
  unauthorized,
} from "@/lib/api/responses";
import { bridgePut, BridgeError, isBridgeConfigured } from "@/lib/bridge";
import { getServerRole } from "@/lib/auth/getServerRole";
import { fetchVisibilityOverrides } from "@/lib/admin/visibility-service";
import type { VisibilityEntityType } from "@/lib/visibility-overrides";

const ENTITY_TYPES: VisibilityEntityType[] = ["academy", "course", "service"];

export async function GET() {
  const role = await getServerRole();
  if (!role) return unauthorized();
  if (role !== "admin") return forbidden("Admin access required");

  return ok(await fetchVisibilityOverrides());
}

export async function PUT(request: Request) {
  const role = await getServerRole();
  if (!role) return unauthorized();
  if (role !== "admin") return forbidden("Admin access required");

  const raw = await request.json().catch(() => null);
  if (!raw || typeof raw !== "object") return badRequest("A visibility change is required");

  const { entityType, entityKey, isVisibleToLearners } = raw as Record<string, unknown>;
  if (typeof entityType !== "string" || !ENTITY_TYPES.includes(entityType as VisibilityEntityType)) {
    return badRequest("Unsupported entity type");
  }
  if (typeof entityKey !== "string" || entityKey.trim().length === 0) {
    return badRequest("entityKey is required");
  }
  if (isVisibleToLearners !== null && typeof isVisibleToLearners !== "boolean") {
    return badRequest("isVisibleToLearners must be a boolean or null");
  }

  if (!isBridgeConfigured()) {
    return serverError("Visibility backend is not connected yet — this change was not saved.");
  }

  try {
    await bridgePut("/admin/visibility", { entityType, entityKey, isVisibleToLearners });
    return ok({ entityType, entityKey, isVisibleToLearners });
  } catch (error) {
    if (error instanceof BridgeError && error.status === 401) return unauthorized();
    if (error instanceof BridgeError && error.status === 403) return forbidden("Admin access required");
    return serverError("Visibility backend is not connected yet — this change was not saved.");
  }
}
