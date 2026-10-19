import type { Extras, Program, SiteSettings } from "@/lib/types";

export type SectionCtx = {
  links: Pick<SiteSettings, "applyUrl" | "consultationUrl" | "primaryEmail" | "brochure">;
  settings: SiteSettings;
  program: Program;
  extras: Extras;
  /** True for the first section on the page; it gets the page's only h1 */
  first: boolean;
};
