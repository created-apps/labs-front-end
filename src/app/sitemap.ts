import type { MetadataRoute } from "next";
import { getHomeProgram, getProgramSlugs, getProjectSlugs, getSettings } from "@/lib/content";

// Regenerated whenever programs or projects are published (same cache tags as the pages).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, home, programs, projects] = await Promise.all([getSettings(), getHomeProgram(), getProgramSlugs(), getProjectSlugs()]);
  const base = settings.siteUrl.replace(/\/$/, "");
  return [
    { url: `${base}/`, lastModified: home.updatedAt ? new Date(home.updatedAt) : new Date(), changeFrequency: "weekly", priority: 1 },
    ...programs.map((p) => ({ url: `${base}/programs/${p.slug}`, lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined, priority: 0.8 })),
    ...projects.map((p) => ({ url: `${base}/projects/${p.slug}`, lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined, priority: 0.6 })),
    { url: `${base}/privacy`, priority: 0.2 },
  ];
}
