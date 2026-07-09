import { badRequest, ok, serverError, unauthorized } from "@/lib/api/responses";
import { bridgePost, isBridgeConfigured, setAuthCookie } from "@/lib/bridge";

type LoginResponse = {
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

  if (!payload || typeof payload.email !== "string" || typeof payload.password !== "string") {
    return badRequest("email and password are required");
  }

  if (!isBridgeConfigured()) {
    // Dev fallback — accept any credentials, encode user data in token for /api/auth/me
    const user = { id: "mock-1", name: "Dev User", email: payload.email, role: "learner" };
    const token = `dev.${Buffer.from(JSON.stringify(user)).toString("base64")}`;
    return setAuthCookie(ok(user), token);
  }

  try {
    const result = await bridgePost<LoginResponse>(
      "/auth/login",
      { email: payload.email, password: payload.password },
      { noAuth: true },
    );
    const response = ok(result.user);
    return setAuthCookie(response, result.token);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Login failed";
    if (msg.toLowerCase().includes("invalid") || msg.toLowerCase().includes("credentials")) {
      return unauthorized("Invalid email or password");
    }
    return serverError("Login service unavailable. Please try again.");
  }
}
