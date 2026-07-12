/**
 * Afrihost PHP Bridge Client
 *
 * Calls the PHP REST API on Afrihost. Falls back to mock data in development
 * when BRIDGE_BASE_URL is not set.
 *
 * Auth flow: JWT stored in httpOnly cookie "vowlms_token" is forwarded
 * as a Bearer token on every authenticated bridge request.
 */

import { cookies } from "next/headers";

const BASE = (process.env.BRIDGE_BASE_URL ?? "").replace(/\/$/, "");
const API_KEY = process.env.BRIDGE_API_KEY ?? "";

export type BridgeEnvelope<T = unknown> = {
  ok: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
};

export class BridgeError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "BridgeError";
  }
}

export function isBridgeConfigured() {
  // Production fails closed instead of exposing development mock data when
  // backend configuration is missing.
  return BASE.length > 0 || process.env.NODE_ENV === "production";
}

async function getAuthToken(): Promise<string | undefined> {
  try {
    const store = await cookies();
    return store.get("vowlms_token")?.value;
  } catch {
    return undefined;
  }
}

function buildHeaders(token?: string): HeadersInit {
  const h: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Bridge-Key": API_KEY,
  };
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
}

async function resolveToken(opts?: BridgeOpts): Promise<string | undefined> {
  if (opts?.noAuth) return undefined;
  return opts?.token ?? (await getAuthToken());
}

type BridgeOpts = {
  token?: string;
  noAuth?: boolean;
};

export async function bridgeGet<T>(path: string, opts?: BridgeOpts): Promise<T> {
  const token = await resolveToken(opts);
  let res: Response;

  try {
    res = await fetch(`${BASE}${path}`, {
      method: "GET",
      headers: buildHeaders(token),
      cache: "no-store",
    });
  } catch {
    throw new BridgeError("Backend service unavailable", 503);
  }

  const json: BridgeEnvelope<T> = await res.json().catch(() => ({
    ok: false,
    error: "Invalid JSON from bridge",
    timestamp: new Date().toISOString(),
  }));

  if (!json.ok || res.status >= 400) {
    throw new BridgeError(json.error ?? `Bridge HTTP ${res.status}`, res.status);
  }

  return json.data as T;
}

export async function bridgePost<T>(
  path: string,
  body: unknown,
  opts?: BridgeOpts,
): Promise<T> {
  const token = await resolveToken(opts);
  let res: Response;

  try {
    res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: buildHeaders(token),
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    throw new BridgeError("Backend service unavailable", 503);
  }

  const json: BridgeEnvelope<T> = await res.json().catch(() => ({
    ok: false,
    error: "Invalid JSON from bridge",
    timestamp: new Date().toISOString(),
  }));

  if (!json.ok || res.status >= 400) {
    throw new BridgeError(json.error ?? `Bridge HTTP ${res.status}`, res.status);
  }

  return json.data as T;
}

export async function bridgeUpload<T>(
  path: string,
  body: FormData,
  opts?: BridgeOpts,
): Promise<T> {
  const token = await resolveToken(opts);
  const headers: Record<string, string> = {
    Accept: "application/json",
    "X-Bridge-Key": API_KEY,
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers,
      body,
      cache: "no-store",
    });
  } catch {
    throw new BridgeError("Backend service unavailable", 503);
  }

  const json: BridgeEnvelope<T> = await res.json().catch(() => ({
    ok: false,
    error: "Invalid JSON from bridge",
    timestamp: new Date().toISOString(),
  }));
  if (!json.ok || res.status >= 400) {
    throw new BridgeError(json.error ?? `Bridge HTTP ${res.status}`, res.status);
  }

  return json.data as T;
}

export async function bridgeDelete<T>(path: string, opts?: BridgeOpts): Promise<T> {
  const token = await resolveToken(opts);
  let res: Response;

  try {
    res = await fetch(`${BASE}${path}`, {
      method: "DELETE",
      headers: buildHeaders(token),
      cache: "no-store",
    });
  } catch {
    throw new BridgeError("Backend service unavailable", 503);
  }

  const json: BridgeEnvelope<T> = await res.json().catch(() => ({
    ok: false,
    error: "Invalid JSON from bridge",
    timestamp: new Date().toISOString(),
  }));
  if (!json.ok || res.status >= 400) {
    throw new BridgeError(json.error ?? `Bridge HTTP ${res.status}`, res.status);
  }

  return json.data as T;
}

/** Sets the JWT cookie in a Next.js response */
export function setAuthCookie(response: Response, token: string): Response {
  const res = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: new Headers(response.headers),
  });
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.headers.append(
    "Set-Cookie",
    `vowlms_token=${token}; HttpOnly${secure}; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 30}`,
  );
  return res;
}

/** Clears the JWT cookie */
export function clearAuthCookie(response: Response): Response {
  const res = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: new Headers(response.headers),
  });
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.headers.append(
    "Set-Cookie",
    `vowlms_token=; HttpOnly${secure}; SameSite=Lax; Path=/; Max-Age=0`,
  );
  return res;
}
