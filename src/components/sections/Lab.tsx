"use client";
import { useEffect, useRef } from "react";
import type { LabSection } from "@/lib/types";
import { Picture } from "@/components/ui/Picture";
import { LoopVideo } from "@/components/ui/LoopVideo";
import { MentorArt } from "@/components/ui/MentorArt";

// Program structure: the one timeline on the page. A pill of week numbers fills with Sunglow as you
// scroll, with the active week lifted into a capsule. The three phases are bracketed beneath it, each
// with its vector illustration; the lab-visit phase is highlighted. Real clips and photos follow.
export function Lab({ s }: { s: LabSection }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const weeks = s.totalWeeks ?? 10;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const set = (p: number) => {
      const f = Math.max(0, Math.min(1, p));
      track.style.setProperty("--fill", f.toFixed(4));
      const active = Math.min(weeks, Math.max(1, Math.ceil(f * weeks)));
      track.dataset.active = String(active);
      track.querySelectorAll<HTMLElement>("[data-week]").forEach((el) => {
        const w = Number(el.dataset.week);
        el.dataset.state = w < active ? "done" : w === active ? "now" : "next";
      });
      track.querySelectorAll<HTMLElement>("[data-from]").forEach((el) => {
        el.dataset.on = String(active >= Number(el.dataset.from));
      });
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      set(1);
      return;
    }
    set(0.08);
    let kill: (() => void) | undefined;
    let dead = false;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (dead) return;
      gsap.registerPlugin(ScrollTrigger);
      const st = ScrollTrigger.create({
        trigger: track,
        start: "top 85%",
        end: "bottom 35%",
        scrub: 0.6,
        onUpdate: (self) => set(0.08 + self.progress * 0.92),
      });
      kill = () => st.kill();
    })();
    return () => {
      dead = true;
      kill?.();
    };
  }, [weeks]);

  return (
    <section className="section labx" id={s.anchorId || undefined} aria-labelledby={`${s._key}-h`}>
      <div className="container">
        <div className="labx__head">
          <div className="section-head" style={{ marginBottom: 0 }}>
            {s.eyebrow && <p className="eyebrow">{s.eyebrow}</p>}
            <h2 id={`${s._key}-h`}>{s.heading}</h2>
          </div>
          <div className="labx__intro">
            <p>{s.body}</p>
            {!!s.points?.length && (
              <ul className="tags">
                {s.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="weeks" ref={trackRef} style={{ "--n": weeks } as React.CSSProperties}>
          <div className="weeks__pill">
            <span className="weeks__label">Week</span>
            <ol className="weeks__row">
              <span className="weeks__fill" aria-hidden="true" />
              {Array.from({ length: weeks }, (_, i) => (
                <li key={i} data-week={i + 1} data-state="next">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                </li>
              ))}
            </ol>
          </div>
          <ol className="weeks__stages">
            {s.stages.map((st, i) => (
              <li
                key={st._key}
                data-from={st.weekStart}
                data-on="false"
                className={st.highlight ? "is-key" : undefined}
                // stages share their boundary week, so each runs up to the next stage's first week
                style={{ "--col": `${st.weekStart} / ${i === s.stages.length - 1 ? st.weekEnd + 1 : Math.max(st.weekStart + 1, st.weekEnd)}` } as React.CSSProperties}
              >
                <span className="weeks__bracket" aria-hidden="true" />
                {st.art && (
                  <div className="weeks__art">
                    <MentorArt name={st.art} />
                  </div>
                )}
                <p className="weeks__range">
                  Weeks {st.weekStart}–{st.weekEnd}
                </p>
                <h3>{st.title}</h3>
                <p>{st.detail}</p>
              </li>
            ))}
          </ol>
        </div>

        {(!!s.images?.length || !!s.clips?.length) && (
          <div className="labx__photos" style={{ "--count": (s.clips?.length ?? 0) + (s.images?.length ?? 0) } as React.CSSProperties}>
            {s.clips?.map((c) => (
              <figure key={c.src}>
                <LoopVideo clip={c} />
              </figure>
            ))}
            {s.images?.map((img) => (
              <figure key={img.src}>
                <Picture img={img} sizes="(max-width: 899px) 33vw, 20vw" />
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
