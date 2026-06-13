import { badRequest, created } from "@/lib/api/responses";
import { runIntegrationPlaceholder, type IntegrationName } from "@/lib/integrations/placeholders";

const allowed = ["vowrewards", "plugconnect", "vowsupport", "skillsshop", "vowtools", "cheforder"] as const;

function isIntegrationName(name: string): name is IntegrationName {
  return (allowed as readonly string[]).includes(name);
}

export async function POST(request: Request, context: { params: Promise<{ name: string }> }) {
  const { name } = await context.params;

  if (!isIntegrationName(name)) {
    return badRequest("Unsupported integration");
  }

  const payload = await request.json().catch(() => ({}));
  const result = await runIntegrationPlaceholder(name, payload);

  return created(result);
}
