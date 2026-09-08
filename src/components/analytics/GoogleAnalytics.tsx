import Script from "next/script";

// VowLMS's Google Analytics 4 property (analytics.google.com), created for
// https://vowlms.vercel.app/. Only the measurement ID — not a secret, this is
// the exact public value Google's own "Install manually" setup step hands out
// to be pasted into every page.
const GA_MEASUREMENT_ID = "G-N90ZDPP9QZ";

/**
 * Loads gtag.js on every page, matching Google's own "Install manually"
 * snippet exactly (so its own tag-verification check recognizes it).
 * `afterInteractive` is Next.js's documented strategy for Analytics: scripts
 * load after the page is interactive rather than blocking initial render,
 * while still firing early enough to catch normal navigation.
 *
 * Production only, mirroring the `NODE_ENV === "production"` convention
 * already used throughout this codebase (see src/lib/security.ts et al.) —
 * keeps local development and test runs out of VowLMS's real analytics data.
 */
export function GoogleAnalytics() {
  if (process.env.NODE_ENV !== "production") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
