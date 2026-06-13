import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AcademyTopBar } from "@/components/layout/AcademyTopBar";
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
  applicationName: "VowLMS",
  title: {
    default: "VowLMS | GoalVow Learning Platform",
    template: "%s | VowLMS",
  },
  description:
    "A premium GoalVow learning platform for skills, schools, business, VR practice, rewards, and opportunity pathways.",
  metadataBase: new URL("https://vowlms.co.za"),
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#06111f",
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
        {children}
        <Footer />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
