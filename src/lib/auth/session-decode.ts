import type { Role } from "@/types/lms";

export type DecodedSessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar_url?: string | null;
};

/**
 * Decodes a dev-mode `dev.<base64 JSON>` cookie token (minted by
 * `/api/auth/login` when the PHP bridge isn't configured) into its embedded
 * user payload. Returns `null` for a bridge-issued token or a malformed one.
 * Shared by `/api/auth/me` and `getServerRole()` so the two never drift.
 */
export function decodeDevToken(token: string): DecodedSessionUser | null {
  if (!token.startsWith("dev.")) return null;
  try {
    const user = JSON.parse(Buffer.from(token.slice(4), "base64").toString("utf8"));
    if (user?.id && user?.name && user?.email && user?.role) {
      return user as DecodedSessionUser;
    }
    return null;
  } catch {
    return null;
  }
}
