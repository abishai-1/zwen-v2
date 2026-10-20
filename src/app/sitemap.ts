import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { PROJECTS } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/archive", "/systems", "/origin", "/unit", "/transmit"];
  return [
    ...pages.map((p) => ({ url: `${SITE.url}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.8 })),
    ...PROJECTS.map((p) => ({ url: `${SITE.url}/archive/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
