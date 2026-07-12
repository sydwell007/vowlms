import { badRequest, bridgeUnavailable, ok, serverError, unauthorized } from "@/lib/api/responses";
import { bridgeDelete, bridgeUpload, BridgeError, isBridgeConfigured } from "@/lib/bridge";

const MAX_AVATAR_BYTES = 4 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  if (!isBridgeConfigured()) return bridgeUnavailable();

  const formData = await request.formData().catch(() => null);
  const avatar = formData?.get("avatar");
  if (!(avatar instanceof File)) return badRequest("Choose an image to upload.");
  if (!ALLOWED_TYPES.has(avatar.type)) return badRequest("Use a JPG, PNG, or WebP image.");
  if (avatar.size < 1 || avatar.size > MAX_AVATAR_BYTES) {
    return badRequest("The image must be smaller than 4 MB.");
  }

  const upload = new FormData();
  upload.set("avatar", avatar, avatar.name);

  try {
    return ok(await bridgeUpload<{ avatar_url: string }>("/user/avatar", upload));
  } catch (error) {
    if (error instanceof BridgeError && error.status === 401) return unauthorized();
    if (error instanceof BridgeError && error.status < 500) {
      return Response.json({ ok: false, error: error.message }, { status: error.status });
    }
    if (error instanceof BridgeError) return serverError(error.message);
    return serverError("Avatar upload failed.");
  }
}

export async function DELETE() {
  if (!isBridgeConfigured()) return bridgeUnavailable();

  try {
    return ok(await bridgeDelete<{ avatar_url: null }>("/user/avatar"));
  } catch (error) {
    if (error instanceof BridgeError && error.status === 401) return unauthorized();
    if (error instanceof BridgeError) return serverError(error.message);
    return serverError("Could not remove profile photo.");
  }
}
