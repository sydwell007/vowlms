const integrationEnv: Record<string, { url: string; key: string }> = {
  vowrewards: { url: "VOWREWARDS_API_URL", key: "VOWREWARDS_API_KEY" },
  plugconnect: { url: "PLUGCONNECT_API_URL", key: "PLUGCONNECT_API_KEY" },
  vowsupport: { url: "VOWSUPPORT_API_URL", key: "VOWSUPPORT_API_KEY" },
  skillsshop: { url: "SKILLSSHOP_API_URL", key: "SKILLSSHOP_API_KEY" },
  vowtools: { url: "VOWTOOLS_API_URL", key: "VOWTOOLS_API_KEY" },
  cheforder: { url: "CHEFORDER_API_URL", key: "CHEFORDER_API_KEY" },
};

export type IntegrationName = keyof typeof integrationEnv;

export async function runIntegrationPlaceholder(name: IntegrationName, payload: unknown) {
  const env = integrationEnv[name];

  return {
    integration: name,
    mode: "placeholder",
    configured: Boolean(process.env[env.url] && process.env[env.key]),
    env,
    payload,
    nextStep: "Connect real API client, retries, request signing, and audit logging here.",
  };
}
