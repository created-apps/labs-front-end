import type { ApplySection } from "@/lib/types";
import { CtaLink } from "@/components/ui/CtaLink";
import { Icon } from "@/components/ui/Icon";
import type { SectionCtx } from "./context";

export function Apply({ s, ctx }: { s: ApplySection; ctx: SectionCtx }) {
  return (
    <section className="section" id={s.anchorId || undefined} aria-labelledby={`${s._key}-h`}>
      <div className="container">
        <div className="section-head">
          {s.eyebrow && <p className="eyebrow">{s.eyebrow}</p>}
          <h2 id={`${s._key}-h`}>{s.heading}</h2>
          {s.intro && <p className="lede">{s.intro}</p>}
        </div>
        <ol className="steps">
          {s.steps.map((st, i) => (
            <li className="step glass" key={st._key}>
              <span className="step__meta" aria-hidden="true">
                <span className="step__idx">Step {String(i + 1).padStart(2, "0")}</span>
                <span className="step__bar">
                  {s.steps.map((_, k) => (
                    <i key={k} data-on={k <= i} />
                  ))}
                </span>
              </span>
              <h3>
                <span className="sr-only">Step {i + 1}: </span>
                {st.title}
              </h3>
              <p>{st.body}</p>
            </li>
          ))}
        </ol>
        {s.ideationBody && (
          <div className="ideation">
            <span className="ideation__icon" aria-hidden="true">
              <Icon name="flask" size={36} />
            </span>
            <div>
              <p className="tag">Pre-program ideation</p>
              {s.ideationTitle && <h3>{s.ideationTitle}</h3>}
              <p>{s.ideationBody}</p>
            </div>
          </div>
        )}
        {(s.deadlineNote || s.cta) && (
          <div className="deadline">
            {s.deadlineNote && <p>{s.deadlineNote}</p>}
            {s.cta && <CtaLink cta={s.cta} links={ctx.links} location="apply_section" />}
          </div>
        )}
        {!!s.nextPoints?.length && (
          <div className="next-steps glass apply__next">
            {s.nextTitle && <h3>{s.nextTitle}</h3>}
            <div>
              {s.nextIntro && <p>{s.nextIntro}</p>}
              <ul>
                {s.nextPoints.map((p) => (
                  <li key={p}>
                    <Icon name="mail" size={26} />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
