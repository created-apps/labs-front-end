import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getExtras, getProgram, getProgramSlugs, getSettings } from "@/lib/content";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata, programJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProgramSlugs()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [settings, program] = await Promise.all([getSettings(), getProgram(slug)]);
  if (!program) return {};
  return buildMetadata({ settings, seo: program.seo, fallbackTitle: `${program.title} | CreatED`, fallbackDescription: program.summary, path: `/programs/${slug}` });
}

export default async function ProgramPage({ params }: Props) {
  const { slug } = await params;
  const [settings, program, extras] = await Promise.all([getSettings(), getProgram(slug), getExtras()]);
  if (!program) notFound();
  if (program.isHome) permanentRedirect("/");
  const links = { applyUrl: settings.applyUrl, consultationUrl: settings.consultationUrl, primaryEmail: settings.primaryEmail, brochure: settings.brochure };
  return (
    <>
      <JsonLd data={programJsonLd(program, settings, `${settings.siteUrl}/programs/${slug}`)} />
      <SectionRenderer sections={program.sections} ctx={{ links, settings, program, extras }} />
    </>
  );
}
