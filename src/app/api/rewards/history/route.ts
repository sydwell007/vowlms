import { serverError, unauthorized, ok } from "@/lib/api/responses";
import { bridgeGet, BridgeError, isBridgeConfigured } from "@/lib/bridge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") ?? "all";
  const page = searchParams.get("page") ?? "1";
  const limit = searchParams.get("limit") ?? "20";

  if (!isBridgeConfigured()) {
    return ok({
      balance: 0,
      events: [],
      page: 1,
      limit: Number(limit),
      total: 0,
      hasMore: false,
    });
  }

  try {
    return ok(
      await bridgeGet(
        `/rewards/history?filter=${encodeURIComponent(filter)}&page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`,
      ),
    );
  } catch (e) {
    if (e instanceof BridgeError && e.status === 401) return unauthorized();
    if (e instanceof BridgeError) return serverError(e.message);
    return serverError("Failed to load VOWR transaction history");
  }
}
