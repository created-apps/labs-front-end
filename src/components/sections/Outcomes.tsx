import Link from "next/link";
import type { OutcomesSection } from "@/lib/types";
import { Picture } from "@/components/ui/Picture";
import type { SectionCtx } from "./context";

export function Outcomes({ s, ctx }: { s: OutcomesSection; ctx: SectionCtx }) {
  const { projects, testimonials, achievements } = ctx.extras;
  return (
    <section className="section outcomes-sec" id={s.anchorId || undefined} aria-labelledby={`${s._key}-h`}>
      {s.bigLine && (
        <p className="bigline" aria-hidden="true">
          {s.bigLine}
        </p>
      )}
      <div className="container outcomes-sec__inner">
        <div className="outcomes-head">
          <div className="section-head" style={{ marginBottom: 0 }}>
            {s.eyebrow && <p className="eyebrow">{s.eyebrow}</p>}
            <h2 id={`${s._key}-h`}>{s.heading}</h2>
          </div>

        </div>
        <div className="outcomes">
          {s.items.map((o, i) => (
            <div className="outcome" key={o._key}>
              <span className="outcome__k">Outcome {i + 1}</span>
              <h3>{o.title}</h3>
              <p>{o.body}</p>
              {!!o.links?.length && (
                <div className="outcome__links">
                  {o.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener" className={l.logo ? "outcome__logo" : undefined}>
                      {l.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element -- official logo at its own proportions
                        <img src={l.logo.src} width={l.logo.width} height={l.logo.height} alt={l.label} loading="lazy" decoding="async" />
                      ) : (
                        l.label
                      )}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {s.showAchievements && achievements.length > 0 && (
          <div className="proof">
            <h3>Achievements</h3>
            <ul className="achievements">
              {achievements.map((a) => (
                <li key={a._id}>
                  <span>{a.year}</span>
                  <div>
                    <strong>{a.title}</strong>
                    {a.detail && <p style={{ color: "var(--muted)" }}>{a.detail}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {s.showProjects && projects.length > 0 && (
          <div className="proof">
            <h3>Student projects</h3>
            <div className="cards-3">
              {projects.map((p) => (
                <Link className="project-card" key={p._id} href={`/projects/${p.slug}`}>
                  {p.cover && (
                    <div className="frame">
                      <Picture img={p.cover} sizes="(max-width: 899px) 100vw, 33vw" />
                    </div>
                  )}
                  <div className="project-card__body">
                    <h4 style={{ margin: 0, fontSize: "1.125rem" }}>{p.title}</h4>
                    <p>{p.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {s.showTestimonials && testimonials.length > 0 && (
          <div className="proof">
            <h3>In their words</h3>
            <div className="cards-3">
              {testimonials.map((t) => (
                <figure className="quote" key={t._id}>
                  <blockquote>“{t.quote}”</blockquote>
                  <figcaption>
                    <strong>{t.name}</strong>
                    {t.role ? ` · ${t.role}` : ""}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
