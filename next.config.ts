import type { NextConfig } from "next";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  // PayFast's own /eng/process endpoint redirects through its load-balanced
  // hostnames (w1w/w2w) before landing on the actual payment page — CSP's
  // form-action is enforced against every hop of a redirect chain, not just
  // the initial submission target, so all of PayFast's real hostnames need
  // to be listed here or the browser silently blocks the whole checkout
  // partway through. Same hostname set payfast-notify.php's own
  // validPayfastSource() already recognizes as legitimate PayFast infra.
  "form-action 'self' https://sandbox.payfast.co.za https://www.payfast.co.za https://w1w.payfast.co.za https://w2w.payfast.co.za",
  "frame-ancestors 'self'",
  "object-src 'none'",
  // assets.lemonsqueezy.com is lemon.js, the SDK powering the Lemon Squeezy
  // overlay checkout — its own controlled embed, not a raw iframe attempt
  // (unlike PayFast, which explicitly blocks all embedding via
  // X-Frame-Options: DENY, confirmed directly against their live checkout).
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://js.paystack.co https://www.paypal.com https://www.paypalobjects.com https://assets.lemonsqueezy.com",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: blob: https://api.goalvow.com https://*.google-analytics.com https://www.googletagmanager.com https://www.paypalobjects.com",
  "media-src 'self' blob: https://api.goalvow.com https://goalvow.com",
  "connect-src 'self' https://api.goalvow.com https://vowhumans.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://api.paystack.co https://www.paypal.com https://www.sandbox.paypal.com https://*.lemonsqueezy.com",
  "frame-src 'self' https://vowhumans.com https://www.youtube.com https://www.youtube-nocookie.com https://js.paystack.co https://checkout.paystack.com https://www.paypal.com https://www.sandbox.paypal.com https://*.lemonsqueezy.com",
  "worker-src 'self' blob:",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.goalvow.com",
        pathname: "/uploads/avatars/**",
      },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    const rules = [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          {
            key: "Permissions-Policy",
            value:
              'camera=(self "https://vowhumans.com"), microphone=(self "https://vowhumans.com"), geolocation=(), payment=(self)',
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
      {
        source: "/dashboard/(.*)",
        headers: [
          { key: "Cache-Control", value: "private, no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        source: "/auth/(.*)",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        ],
      },
    ];

    if (process.env.NODE_ENV === "production") {
      rules.push({
        source: "/(.*)",
        headers: [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }],
      });
    }

    return rules;
  },
};

export default nextConfig;
