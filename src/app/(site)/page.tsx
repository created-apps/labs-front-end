import type { Metadata } from "next";
import { getExtras, getHomeProgram, getSettings } from "@/lib/content";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata, programJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, program] = await Promise.all([getSettings(), getHomeProgram()]);
  return buildMetadata({ settings, seo: program.seo, fallbackTitle: program.title, fallbackDescription: program.summary, path: "/" });
}

export default async function HomePage() {
  const [settings, program, extras] = await Promise.all([getSettings(), getHomeProgram(), getExtras()]);
  const links = { applyUrl: settings.applyUrl, consultationUrl: settings.consultationUrl, primaryEmail: settings.primaryEmail, brochure: settings.brochure };
  return (
    <>
      <JsonLd data={programJsonLd(program, settings, `${settings.siteUrl}/`)} />
      <SectionRenderer sections={program.sections} ctx={{ links, settings, program, extras }} />
    </>
  );
}
