import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VowLMS",
    short_name: "VowLMS",
    description: "GoalVow learning platform for courses, skills, VR practice, rewards, and opportunities.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#06111f",
    theme_color: "#06111f",
    icons: [
      {
        src: "/images/goalvow-logo.png",
        sizes: "1024x1024",
        type: "image/png",
      },
      {
        src: "/icons/vowlms-icon.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/icons/vowlms-maskable.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
