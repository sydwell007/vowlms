import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { AcademyTopBar } from "@/components/layout/AcademyTopBar";
import { EcosystemSidebar } from "@/components/layout/EcosystemSidebar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ServiceWorkerRegistration } from "@/components/pwa/ServiceWorkerRegistration";
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
  applicationName: "VowLMS · GoalVow Holdings",
  title: {
    default: "VowLMS · Africa's Learn-to-Earn Ecosystem | GoalVow Holdings",
    template: "%s | VowLMS · GoalVow",
  },
  description:
    "GoalVow Holdings is Africa's Learn → Practice → Apply ecosystem. Connect academies, support systems, rewards, tools, learning hubs, VR simulations, and opportunity pathways — all on one platform.",
  keywords: [
    "VowLMS", "GoalVow", "GoalVow Holdings", "LMS", "online learning", "Africa",
    "South Africa", "skills training", "academy", "PlugConnect", "VowRewards",
    "learn to earn", "learning ecosystem"
  ],
  metadataBase: new URL("https://vowlms.vercel.app"),
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    siteName: "VowLMS · GoalVow Holdings",
    title: "VowLMS · Africa's Learn-to-Earn Ecosystem",
    description:
      "GoalVow connects academies, support, rewards, tools, hubs, simulations and opportunities so every African learner can build skills and apply them in the real world.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "VowLMS · GoalVow Holdings" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VowLMS · GoalVow Holdings",
    description: "Africa's Learn → Practice → Apply ecosystem.",
    images: ["/og-image.png"],
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
        <AcademyTopBar />
        <Header />

        {/* Main layout with optional sidebar */}
        <div className="flex flex-1">
          <div className="flex-1 min-w-0">{children}</div>
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
