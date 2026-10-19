import type { HeroSection } from "@/lib/types";
import { CtaLink } from "@/components/ui/CtaLink";
import type { SectionCtx } from "./context";
import { Stage } from "@/components/stage/Stage";

// The last word glows Sunglow.
function Highlight({ text }: { text: string }) {
  const words = text.trim().split(/\s+/);
  if (words.length < 2) return <>{text}</>;
  return (
    <>
      {words.slice(0, -1).join(" ")} <span className="hl">{words[words.length - 1]}</span>
    </>
  );
}

// Cinematic hero: the 3D scene sits behind (its opening flows from the logo into the workbench);
// type and actions float over it, and the description rests on a notebook page.
export function Hero({ s, ctx }: { s: HeroSection; ctx: SectionCtx }) {
  const H = ctx.first ? "h1" : "h2";
  const kicker = s.kicker?.split("·").map((k) => k.trim()).filter(Boolean) ?? [];
  return (
    <section className="hero" id={s.anchorId || undefined} aria-labelledby={`${s._key}-h`}>
      <Stage />
      <div className="hero__inner">
        <H id={`${s._key}-h`} className="hero__title">
          <Highlight text={s.heading} />
        </H>
        {kicker.length > 0 && (
          <ul className="hero__kicker" aria-label="What you will do">
            {kicker.map((k, i) => (
              <li key={k}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {k}
              </li>
            ))}
          </ul>
        )}
        {/* a notepad resting on the workbench. On scroll the description sheet lifts, tears off along the
            perforation and is tossed away; the fresh sheet underneath comes off next and travels down to
            become Program Deliverables (Notebook.tsx) */}
        <div className="hero__sheet">
          <div className="pad">
            <span className="pad__base" aria-hidden="true" />
            <span className="pad__stub" aria-hidden="true" />
            <div className="sheet pad__fresh" id="fresh-sheet" aria-hidden="true">
              <div className="sheet__head">
                <span>CreatED Labs</span>
                <span>Research notebook</span>
              </div>
            </div>
            <div className="leaf" id="hero-leaf">
              <div className="sheet sheet--hero leaf__front">
                <div className="sheet__head" aria-hidden="true">
                  <span>CreatED Labs</span>
                  <span>Program description</span>
                </div>
                <p className="hero__body">{s.body}</p>
                <div className="sheet__foot" aria-hidden="true">
                  <span>10 weeks</span>
                  <span>IIT PhD mentors · Jaipur lab</span>
                </div>
              </div>
              <div className="sheet leaf__back" aria-hidden="true" />
            </div>
          </div>
        </div>
        <div className="hero__card glass">
          {s.announcement && (
            <p className="announce">
              <span className="announce__dot" aria-hidden="true" />
              {s.announcement}
            </p>
          )}
          <div className="btn-row">
            <CtaLink cta={s.primaryCta} links={ctx.links} location="hero" />
            {s.secondaryCta && <CtaLink cta={s.secondaryCta} links={ctx.links} variant="ghost" location="hero" />}
          </div>
          {s.applyNote && <p className="hero__note">{s.applyNote}</p>}
        </div>
      </div>
    </section>
  );
}
