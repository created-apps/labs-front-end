import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/content";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { siteUrl } = await getSettings();
  const isProduction = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : true;
  return {
    // Preview deployments are never indexed
    rules: isProduction ? [{ userAgent: "*", allow: "/", disallow: ["/studio", "/api/"] }] : [{ userAgent: "*", disallow: "/" }],
    sitemap: `${siteUrl.replace(/\/$/, "")}/sitemap.xml`,
  };
}
