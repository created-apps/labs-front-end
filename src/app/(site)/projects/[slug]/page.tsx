import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, getProjectSlugs, getSettings } from "@/lib/content";
import { Picture } from "@/components/ui/Picture";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProjectSlugs()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [settings, project] = await Promise.all([getSettings(), getProject(slug)]);
  if (!project) return {};
  return buildMetadata({
    settings,
    seo: project.seo ?? (project.cover ? { image: project.cover } : null),
    fallbackTitle: `${project.title} | CreatED Labs project`,
    fallbackDescription: project.summary,
    path: `/projects/${slug}`,
  });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const [settings, project] = await Promise.all([getSettings(), getProject(slug)]);
  if (!project) notFound();
  const url = `${settings.siteUrl}/projects/${slug}`;
  return (
    <article className="section page-top">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.title,
          abstract: project.summary,
          url,
          ...(project.cover ? { image: project.cover.src } : {}),
          ...(project.paperUrl ? { sameAs: project.paperUrl } : {}),
          publisher: { "@type": "EducationalOrganization", name: "CreatED", url: settings.siteUrl },
        }}
      />
      <div className="container">
        <div className="prose">
          <p className="eyebrow">Student project{project.year ? ` · ${project.year}` : ""}</p>
          <h1>{project.title}</h1>
          <p className="lede">{project.summary}</p>
          {project.students && <p>By {project.students}</p>}
        </div>
        {project.cover && (
          <div className="project-hero">
            <Picture img={project.cover} sizes="(max-width: 1240px) 100vw, 1240px" preload />
          </div>
        )}
        <div className="prose">
          {project.body?.map((p, i) => <p key={i}>{p}</p>)}
          {!!project.awards?.length && (
            <>
              <h2>Awards</h2>
              <ul className="checks">
                {project.awards.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </>
          )}
          {project.paperUrl && (
            <p>
              <a className="btn" href={project.paperUrl} target="_blank" rel="noopener">
                Read the paper
              </a>
            </p>
          )}
        </div>
        {!!project.gallery?.length && (
          <div className="cards-3" style={{ marginTop: 40 }}>
            {project.gallery.map((g) => (
              <div className="frame" key={g.src} style={{ borderRadius: 22, overflow: "hidden" }}>
                <Picture img={g} sizes="(max-width: 899px) 100vw, 33vw" />
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
