import { badRequest, created, serverError } from "@/lib/api/responses";
import { BridgeError, bridgePost, isBridgeConfigured, setAuthCookie } from "@/lib/bridge";

type RegisterResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (
    !payload ||
    typeof payload.name !== "string" ||
    typeof payload.email !== "string" ||
    typeof payload.password !== "string"
  ) {
    return badRequest("name, email, and password are required");
  }

  if (payload.password.length < 8) {
    return badRequest("Password must be at least 8 characters");
  }

  if (!isBridgeConfigured()) {
    const user = {
      id: `mock-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      role: "learner",
    };
    // Encode user data in the mock token so /api/auth/me can return the real name
    const token = `dev.${Buffer.from(JSON.stringify(user)).toString("base64")}`;
    const mockResponse = created(user);
    return setAuthCookie(mockResponse, token);
  }

  try {
    const result = await bridgePost<RegisterResponse>(
      "/auth/register",
      {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        phone: payload.phone ?? null,
        role: "learner",
        city: payload.city ?? null,
        country: payload.country ?? "South Africa",
        preferredAcademy: payload.preferredAcademy ?? null,
      },
      { noAuth: true },
    );
    const response = created(result.user);
    return setAuthCookie(response, result.token);
  } catch (e: unknown) {
    if (e instanceof BridgeError) {
      if (e.status === 403) {
        return serverError("Bridge authorization failed. Check BRIDGE_API_KEY on Vercel and Afrihost.");
      }
      if (e.status === 409) {
        return badRequest("An account with this email already exists");
      }
      if (e.status === 503) {
        return serverError("Backend bridge is unavailable. Check BRIDGE_BASE_URL and bridge health.");
      }
      return serverError(e.message);
    }

    const msg = e instanceof Error ? e.message : "";
    if (msg.toLowerCase().includes("exists") || msg.toLowerCase().includes("duplicate")) {
      return badRequest("An account with this email already exists");
    }
    return serverError("Registration failed. Please try again.");
  }
}
