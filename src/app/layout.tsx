import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { AcademyTopBar } from "@/components/layout/AcademyTopBar";
import { EcosystemSidebar } from "@/components/layout/EcosystemSidebar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ServiceWorkerRegistration } from "@/components/pwa/ServiceWorkerRegistration";
import { visualAssets } from "@/lib/visual-assets";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: "VowLMS - GoalVow Holdings",
  title: {
    default: "VowLMS | GoalVow Learning Platform",
    template: "%s | VowLMS",
  },
  description: siteConfig.description,
  keywords: [
    "VowLMS", "GoalVow", "GoalVow Holdings", "LMS", "online learning", "Africa",
    "South Africa", "skills training", "academy", "PlugConnect", "VowRewards",
    "learn to earn", "learning ecosystem"
  ],
  metadataBase: new URL(siteConfig.url),
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    siteName: "VowLMS - GoalVow Holdings",
    title: "VowLMS | GoalVow Learning Platform",
    description: siteConfig.description,
    url: siteConfig.url,
    images: [{ url: visualAssets.ecosystemHero, width: 1728, height: 910, alt: "VowLMS learning platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VowLMS | GoalVow Learning Platform",
    description: siteConfig.description,
    images: [visualAssets.ecosystemHero],
  },
};

export const viewport: Viewport = {
  themeColor: "#1e3a8a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <AcademyTopBar />
        <Header />

        {/* Main layout with optional sidebar */}
        <div className="flex flex-1">
          <div id="main-content" tabIndex={-1} className="min-w-0 flex-1">
            {children}
          </div>
          <EcosystemSidebar />
        </div>

        <Footer />
        <ServiceWorkerRegistration />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              borderRadius: "12px",
              fontFamily: "var(--font-geist-sans)",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
