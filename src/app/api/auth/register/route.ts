import { badRequest, created, serverError } from "@/lib/api/responses";
import { bridgePost, isBridgeConfigured, setAuthCookie } from "@/lib/bridge";

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
      role: (payload.role ?? "learner") as string,
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
        role: payload.role ?? "learner",
      },
      { noAuth: true },
    );
    const response = created(result.user);
    return setAuthCookie(response, result.token);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.toLowerCase().includes("exists") || msg.toLowerCase().includes("duplicate")) {
      return badRequest("An account with this email already exists");
    }
    return serverError("Registration failed. Please try again.");
  }
}
