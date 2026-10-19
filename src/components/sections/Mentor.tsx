"use client";
import { useEffect, useRef } from "react";
import type { MentorSection } from "@/lib/types";
import { LoopVideo } from "@/components/ui/LoopVideo";
import { Picture } from "@/components/ui/Picture";
import { MentorArt } from "@/components/ui/MentorArt";

// 2:1 Mentorship, editorial: the promise and the numbers beside real session footage (each piece
// tagged with what it shows), then the three stages of the mentorship, each with a vector diagram.
// Motion is limited to the clips playing while visible and the stages settling in once.
export function Mentor({ s }: { s: MentorSection }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const steps = Array.from(el.querySelectorAll<HTMLElement>(".mstep"));
    el.dataset.ready = "true";
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          (e.target as HTMLElement).dataset.on = "true";
          io.unobserve(e.target);
        }),
      { rootMargin: "0px 0px -18% 0px" },
    );
    steps.forEach((st) => io.observe(st));
    return () => io.disconnect();
  }, []);

  const hasMedia = s.clip || s.clip2 || s.photo;
  return (
    <section className="mentor" ref={ref} id={s.anchorId || undefined} aria-labelledby={`${s._key}-h`}>
      <div className="mentor__panel">
        <div className="mentor__intro">
          <div className="mentor__copy">
            {s.eyebrow && <p className="eyebrow">{s.eyebrow}</p>}
            <h2 id={`${s._key}-h`}>{s.heading}</h2>
            <p className="mentor__body">{s.body}</p>
            {!!s.stats?.length && (
              <dl className="mentor__stats">
                {s.stats.map((st) => (
                  <div key={st._key}>
                    <dd>{st.value}</dd>
                    <dt>{st.label}</dt>
                  </div>
                ))}
              </dl>
            )}
          </div>
          {hasMedia && (
            <div className="mentor__reel">
              {s.clip && (
                <figure className="mreel mreel--main">
                  <LoopVideo clip={s.clip} />
                  {s.clipTag && <figcaption className="mreel__tag">{s.clipTag}</figcaption>}
                </figure>
              )}
              {s.clip2 && (
                <figure className="mreel mreel--side">
                  <LoopVideo clip={s.clip2} />
                  {s.clip2Tag && <figcaption className="mreel__tag">{s.clip2Tag}</figcaption>}
                </figure>
              )}
              {s.photo && (
                <figure className="mreel mreel--photo">
                  <Picture img={s.photo} sizes="(max-width: 899px) 45vw, 220px" />
                  {s.photoTag && <figcaption className="mreel__tag">{s.photoTag}</figcaption>}
                </figure>
              )}
              <p className="mreel__credit">Real footage from CreatED Labs sessions</p>
            </div>
          )}
        </div>
        {!!s.steps?.length && (
          <div className="mentor__loop">
            {s.stepsTitle && <h3 className="mentor__loop-title">{s.stepsTitle}</h3>}
            <ol className="mentor__steps">
              {s.steps.map((st, i) => (
                <li key={st._key} className="mstep" style={{ "--i": i } as React.CSSProperties}>
                  <div className="mstep__art">
                    <MentorArt name={st.art} />
                  </div>
                  <p className="mstep__label">
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    {st.label}
                  </p>
                  <h4>{st.title}</h4>
                  <p>{st.body}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}
