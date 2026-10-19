"use client";
import { useEffect, useRef, useState } from "react";
import type { GlanceSection } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";

const TONES = ["sun", "azure", "corn", "lime", "flame", "ink"] as const;

// Pallet Ross-style card fan: the six facts start as a stack and fan into an arc as the section
// arrives. Hover or focus lifts and straightens a card. On phones and tablets they stack vertically.
export function Glance({ s }: { s: GlanceSection }) {
  const ref = useRef<HTMLUListElement>(null);
  const [fanned, setFanned] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // With reduced motion the CSS drops the transition, so the fan simply appears
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setFanned(true), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const n = s.items.length;
  return (
    <section className="section fan-section" id={s.anchorId || undefined} aria-labelledby={`${s._key}-h`}>
      <div className="container">
        <div className="section-head section-head--center">
          {s.eyebrow && <p className="eyebrow">{s.eyebrow}</p>}
          <h2 id={`${s._key}-h`}>{s.heading}</h2>
        </div>
      </div>
      <ul className="fan" ref={ref} data-fanned={fanned}>
        {s.items.map((it, i) => {
          const o = i - (n - 1) / 2;
          return (
            <li
              key={it._key}
              className={`fan__card tone-${TONES[i % TONES.length]}`}
              tabIndex={0}
              style={
                {
                  "--o": o,
                  "--abs": Math.abs(o),
                  "--i": i,
                  "--jit": `${((i * 37) % 7) - 3}deg`,
                } as React.CSSProperties
              }
            >
              <div className="fan__top">
                <span className="fan__stat">{it.stat}</span>
                <Icon name={it.icon} size={40} />
              </div>
              <h3>{it.title}</h3>
              <p>{it.body}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
