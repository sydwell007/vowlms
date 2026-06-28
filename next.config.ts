import type { NextConfig } from "next";

function getBridgeOrigin(): string | null {
  const url = process.env.BRIDGE_BASE_URL;
  if (!url) return null;
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    const bridgeOrigin = getBridgeOrigin();

    const rules = [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        ],
      },
    ];

    if (bridgeOrigin) {
      rules.push({
        source: "/api/(.*)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: bridgeOrigin },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type,Authorization,X-Bridge-Key" },
        ],
      });
    }

    return rules;
  },
};

export default nextConfig;
