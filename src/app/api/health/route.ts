import { ok } from "@/lib/api/responses";

export async function GET() {
  return ok({
    service: "VowLMS",
    status: "healthy",
    version: "0.1.0",
    checks: {
      app: "ok",
      mockData: "ok",
      prisma: "schema-ready",
      pwa: "service-worker-ready",
      integrations: "placeholder",
    },
  });
}
