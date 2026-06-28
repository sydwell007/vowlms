function envelope<T>(ok: boolean, payload: Record<string, unknown> & { data?: T }) {
  return { ok, timestamp: new Date().toISOString(), ...payload };
}

export function ok<T>(data: T, init?: ResponseInit) {
  return Response.json(envelope(true, { data }), init);
}

export function created<T>(data: T) {
  return ok(data, { status: 201 });
}

export function badRequest(message: string) {
  return Response.json(envelope(false, { error: message }), { status: 400 });
}

export function unauthorized(message = "Unauthorized") {
  return Response.json(envelope(false, { error: message }), { status: 401 });
}

export function notFound(message = "Not found") {
  return Response.json(envelope(false, { error: message }), { status: 404 });
}

export function serverError(message = "Internal server error") {
  return Response.json(envelope(false, { error: message }), { status: 500 });
}

export function bridgeUnavailable() {
  return Response.json(
    envelope(false, { error: "Backend bridge is not configured. Set BRIDGE_BASE_URL." }),
    { status: 503 },
  );
}
