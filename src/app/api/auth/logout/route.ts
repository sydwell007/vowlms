import { ok } from "@/lib/api/responses";
import { clearAuthCookie } from "@/lib/bridge";

export async function POST() {
  return clearAuthCookie(ok({ loggedOut: true }));
}
