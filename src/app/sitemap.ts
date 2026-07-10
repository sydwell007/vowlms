import type { MetadataRoute } from "next";
import { getAcademies, getCourses } from "@/lib/data";
import { siteConfig } from "@/lib/site";

const publicRoutes = [
  "",
  "/academies",
  "/courses",
  "/catalogue",
  "/learn",
  "/practice",
  "/apply",
  "/rewards",
  "/opportunities",
  "/learning-hubs",
  "/vr-practice",
  "/support",
  "/ecosystem",
  "/about",
  "/contact",
  "/pricing",
  "/privacy",
  "/terms",
  "/cookies",
  "/accessibility",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const baseEntries: MetadataRoute.Sitemap = publicRoutes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/courses" || route === "/academies" ? 0.9 : 0.6,
  }));
  const academyEntries: MetadataRoute.Sitemap = getAcademies().map((academy) => ({
    url: `${siteConfig.url}/academies/${academy.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  const courseEntries: MetadataRoute.Sitemap = getCourses().map((course) => ({
    url: `${siteConfig.url}/courses/${course.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...baseEntries, ...academyEntries, ...courseEntries];
}
