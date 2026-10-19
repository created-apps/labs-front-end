"use client";
// Sanity Studio, served at /studio.
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool, defineLocations } from "sanity/presentation";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

const singletons = new Set(["siteSettings"]);

export default defineConfig({
  name: "created-labs",
  title: "CreatED Labs",
  basePath: "/studio",
  projectId: projectId || "unconfigured",
  dataset,
  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev.filter((t) => !singletons.has(t.schemaType)),
      {
        id: "program-from-labs",
        title: "Program page (copy of the CreatED Labs layout)",
        schemaType: "program",
        value: async (_params: unknown, { getClient }: { getClient: (o: { apiVersion: string }) => { fetch: <T>(q: string) => Promise<T> } }) => {
          const sections = await getClient({ apiVersion }).fetch<unknown[] | null>(
            `*[_type == "program" && isHome == true][0].sections`,
          );
          return { isHome: false, sections: sections ?? [], fee: { show: false, currency: "INR" } };
        },
      },
    ],
  },
  document: {
    // Settings is a single document: no "create new" or "delete"
    actions: (prev, { schemaType }) =>
      singletons.has(schemaType) ? prev.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action)) : prev,
    newDocumentOptions: (prev) => prev.filter((item) => !singletons.has(item.templateId)),
  },
  plugins: [
    structureTool({ structure }),
    presentationTool({
      title: "Preview",
      previewUrl: { initial: "/", previewMode: { enable: "/api/draft-mode/enable" } },
      resolve: {
        locations: {
          program: defineLocations({
            select: { title: "title", slug: "slug.current", isHome: "isHome" },
            resolve: (doc) => ({
              locations: [{ title: doc?.title || "Program", href: doc?.isHome ? "/" : `/programs/${doc?.slug}` }],
            }),
          }),
          project: defineLocations({
            select: { title: "title", slug: "slug.current" },
            resolve: (doc) => ({ locations: [{ title: doc?.title || "Project", href: `/projects/${doc?.slug}` }] }),
          }),
        },
      },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
