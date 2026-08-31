import type { MetadataRoute } from "next";
import { getAcademies, getCourses, getSkillPathways } from "@/lib/data";
import { siteConfig } from "@/lib/site";

const publicRoutes = [
  "",
  "/academies",
  "/courses",
  "/find-my-path",
  "/learn",
  "/learn/pathways",
  "/practice",
  "/apply",
  "/rewards",
  "/opportunities",
  "/learning-hubs",
  "/vr-practice",
  "/support",
  "/ecosystem",
  "/about",
  "/impact",
  "/team",
  "/careers",
  "/investors",
  "/innovation-labs",
  "/vowtools",
  "/skillsshop",
  "/cheforder",
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
    url: `${siteConfig.url}/academies/${academy.category}`,
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
  const pathwayEntries: MetadataRoute.Sitemap = getSkillPathways().map((pathway) => ({
    url: `${siteConfig.url}/learn/pathways/${pathway.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...baseEntries, ...academyEntries, ...pathwayEntries, ...courseEntries];
}
