import { cookies } from "next/headers";
import { ok, serverError } from "@/lib/api/responses";
import { bridgeGet, BridgeError, isBridgeConfigured } from "@/lib/bridge";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("vowlms_token")?.value;
  if (!token) return ok(null);

  if (!isBridgeConfigured()) {
    if (!token.startsWith("dev.")) return ok(null);
    try {
      const user = JSON.parse(Buffer.from(token.slice(4), "base64").toString("utf8"));
      return user?.id && user?.name && user?.email && user?.role ? ok(user) : ok(null);
    } catch {
      return ok(null);
    }
  }

  try {
    return ok(await bridgeGet<unknown>("/auth/me"));
  } catch (error) {
    if (error instanceof BridgeError && error.status === 401) return ok(null);
    return serverError("Session could not be restored");
  }
}
