export function ok<T>(data: T, init?: ResponseInit) {
  return Response.json(
    {
      ok: true,
      data,
      timestamp: new Date().toISOString(),
    },
    init,
  );
}

export function created<T>(data: T) {
  return ok(data, { status: 201 });
}

export function badRequest(message: string) {
  return Response.json(
    {
      ok: false,
      error: message,
      timestamp: new Date().toISOString(),
    },
    { status: 400 },
  );
}
