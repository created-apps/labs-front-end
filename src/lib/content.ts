import "server-only";
import { draftMode } from "next/headers";
import { client } from "@/sanity/lib/client";
import { isSanityConfigured, studioUrl } from "@/sanity/env";
import {
  extrasQuery,
  homeProgramQuery,
  programQuery,
  programSlugsQuery,
  projectQuery,
  projectSlugsQuery,
  redirectQuery,
  settingsQuery,
} from "@/sanity/lib/queries";
import { seedExtras, seedProgram, seedSettings } from "@/content/seed";
import type { Extras, Program, Project, SiteSettings } from "./types";

// Cache tags match document types, so the publish webhook can refresh exactly what changed.
type Tag = "siteSettings" | "program" | "project" | "testimonial" | "achievement" | "redirect";

async function isDraft() {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false; // outside a request, e.g. while generating static params
  }
}

async function sanityFetch<T>(query: string, params: Record<string, unknown>, tags: Tag[]): Promise<T> {
  if (await isDraft()) {
    return client
      .withConfig({
        token: process.env.SANITY_API_READ_TOKEN,
        perspective: "drafts",
        useCdn: false,
        stega: { enabled: true, studioUrl },
      })
      .fetch<T>(query, params, { cache: "no-store" });
  }
  return client.fetch<T>(query, params, { cache: "force-cache", next: { tags } });
}

const compact = <T extends object>(o: T | null | undefined) =>
  Object.fromEntries(Object.entries(o ?? {}).filter(([, v]) => v !== null && v !== undefined && v !== "")) as Partial<T>;

export async function getSettings(): Promise<SiteSettings> {
  if (!isSanityConfigured) return seedSettings;
  let s: Partial<SiteSettings> | null = null;
  try {
    s = await sanityFetch<Partial<SiteSettings> | null>(settingsQuery, {}, ["siteSettings"]);
  } catch (err) {
    // Settings feed every page's metadata and the Studio route; never let a CMS outage take those down.
    console.error("Sanity settings fetch failed; using defaults", err);
  }
  return {
    ...seedSettings,
    ...compact(s),
    defaultSeo: { ...seedSettings.defaultSeo, ...compact(s?.defaultSeo) },
  };
}

export async function getHomeProgram(): Promise<Program> {
  if (!isSanityConfigured) return seedProgram;
  return (await sanityFetch<Program | null>(homeProgramQuery, {}, ["program"])) ?? seedProgram;
}

export async function getProgram(slug: string): Promise<Program | null> {
  if (!isSanityConfigured) return slug === seedProgram.slug ? seedProgram : null;
  return sanityFetch<Program | null>(programQuery, { slug }, ["program"]);
}

export async function getProgramSlugs(): Promise<{ slug: string; updatedAt?: string }[]> {
  if (!isSanityConfigured) return [];
  return sanityFetch(programSlugsQuery, {}, ["program"]);
}

export async function getProject(slug: string): Promise<Project | null> {
  if (!isSanityConfigured) return null;
  return sanityFetch<Project | null>(projectQuery, { slug }, ["project"]);
}

export async function getProjectSlugs(): Promise<{ slug: string; updatedAt?: string }[]> {
  if (!isSanityConfigured) return [];
  return sanityFetch(projectSlugsQuery, {}, ["project"]);
}

export async function getExtras(): Promise<Extras> {
  if (!isSanityConfigured) return seedExtras;
  return sanityFetch<Extras>(extrasQuery, {}, ["project", "testimonial", "achievement"]);
}

export async function getRedirect(path: string): Promise<{ to: string; permanent?: boolean } | null> {
  if (!isSanityConfigured) return null;
  return sanityFetch(redirectQuery, { path }, ["redirect"]);
}

export { isDraft };
