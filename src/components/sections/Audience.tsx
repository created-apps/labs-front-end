"use client";
import { useEffect, useRef, useState } from "react";
import type { AudienceSection } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";
import { Coverflow } from "@/components/ui/Coverflow";

// The heading resolves word by word as the section arrives; beneath it, a coverflow of real student
// photos (after the "Overflow" reference) that the visitor scrubs through.
export function Audience({ s }: { s: AudienceSection }) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const photos = s.photos ?? [];
  const words = s.heading.split(/\s+/);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOpen(true), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const n = photos.length;
  return (
    <section className="section who" id={s.anchorId || undefined} aria-labelledby={`${s._key}-h`}>
      <div className="container">
        <div className="who__head" ref={ref} data-open={open}>
          {s.eyebrow && <p className="eyebrow">{s.eyebrow}</p>}
          <h2 id={`${s._key}-h`} className="who__title">
            {words.map((w, i) => (
              <span key={i} style={{ "--i": i } as React.CSSProperties}>
                {w}{" "}
              </span>
            ))}
          </h2>
          {n > 0 && <Coverflow photos={photos} label="Students in the CreatED lab" />}
        </div>
        <div className="who__body">
          <p className="lede">{s.intro}</p>
          <ul className="who__checks">
            {s.criteria.map((c) => (
              <li key={c}>
                <Icon name="check" size={26} />
                <span>{c}</span>
              </li>
            ))}
          </ul>
          {s.reassurance && (
            <div className="reassure glass">
              {s.reassuranceTitle && <h3>{s.reassuranceTitle}</h3>}
              <p>{s.reassurance}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
