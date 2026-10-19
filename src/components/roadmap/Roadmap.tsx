"use client";
import { useEffect, useRef } from "react";
import type { RoadmapSection } from "@/lib/types";
import { Picture } from "@/components/ui/Picture";
import { textures } from "@/content/images";

const ACCENT: Record<string, string> = { blue: "#649CF4", lime: "#95C623", flame: "#EC4E20", sun: "#F1CA01" };

type Geometry = {
  d: string;
  total: number;
  marks: { y: number; len: number; x: number; el: HTMLElement | null; end?: boolean }[];
  sample: (len: number) => { x: number; y: number; angle: number };
  height: number;
  x0: number;
};

/**
 * Builds the tube path from the live layout: marks sit level with each milestone's week label,
 * and on wide screens the tube bends around the one milestone photo placed in the tube column.
 * Re-runs on every resize, so CMS text changes never need animation rework.
 */
function measure(track: HTMLElement): Geometry | null {
  const tb = track.getBoundingClientRect();
  const items = Array.from(track.querySelectorAll<HTMLElement>(".milestone"));
  if (!items.length) return null;
  const firstBody = items[0].querySelector<HTMLElement>(".milestone__body");
  if (!firstBody) return null;
  const colW = firstBody.getBoundingClientRect().left - tb.left;
  const narrow = colW < 120;
  const x0 = narrow ? colW / 2 - 4 : colW / 2;
  const H = tb.height;

  const markYs = items.map((li) => {
    const w = li.querySelector<HTMLElement>(".milestone__weeks")!.getBoundingClientRect();
    return w.top + w.height / 2 - tb.top;
  });
  const lastBody = items[items.length - 1].querySelector<HTMLElement>(".milestone__body")!.getBoundingClientRect();
  const yEnd = Math.min(H - 4, lastBody.bottom - tb.top);

  // A photo that sits inside the tube column gets the bend.
  let detour: { top: number; bottom: number; xR: number } | null = null;
  if (!narrow) {
    const fig = track.querySelector<HTMLElement>(".milestone__media");
    if (fig) {
      const r = fig.getBoundingClientRect();
      if (r.right - tb.left < colW + 1) {
        detour = { top: r.top - tb.top - 40, bottom: r.bottom - tb.top + 34, xR: Math.min(r.right - tb.left + 46, colW - 16) };
      }
    }
  }

  // Build the tube as a polyline (straight runs + finely sampled rounded corners). Lengths and
  // positions are computed here directly, so layout changes never need slow SVG path queries.
  const R = 30;
  const pts: { x: number; y: number }[] = [{ x: x0, y: 0 }];
  const corner = (sx: number, sy: number, cx: number, cy: number, ex: number, ey: number) => {
    for (let i = 1; i <= 16; i++) {
      const t = i / 16, u = 1 - t;
      pts.push({ x: u * u * sx + 2 * u * t * cx + t * t * ex, y: u * u * sy + 2 * u * t * cy + t * t * ey });
    }
  };
  if (detour && detour.top > R && detour.bottom < yEnd - R) {
    const { top, bottom, xR } = detour;
    pts.push({ x: x0, y: top - R });
    corner(x0, top - R, x0, top, x0 + R, top);
    pts.push({ x: xR - R, y: top });
    corner(xR - R, top, xR, top, xR, top + R);
    pts.push({ x: xR, y: bottom - R });
    corner(xR, bottom - R, xR, bottom, xR - R, bottom);
    pts.push({ x: x0 + R, y: bottom });
    corner(x0 + R, bottom, x0, bottom, x0, bottom + R);
  }
  pts.push({ x: x0, y: yEnd });

  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  const total = cum[cum.length - 1];
  const d = "M " + pts.map((p) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" L ");

  // y never decreases along the tube, so the first segment reaching a mark's y gives its length.
  const lenAt = (y: number) => {
    for (let i = 1; i < pts.length; i++) {
      if (pts[i].y >= y) {
        const a = pts[i - 1], b = pts[i];
        const t = b.y > a.y ? (y - a.y) / (b.y - a.y) : 0;
        return cum[i - 1] + (cum[i] - cum[i - 1]) * Math.max(0, Math.min(1, t));
      }
    }
    return total;
  };
  const sample = (len: number) => {
    const L = Math.max(0, Math.min(total, len));
    let lo = 1, hi = cum.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] < L) lo = mid + 1;
      else hi = mid;
    }
    const a = pts[lo - 1], b = pts[lo];
    const seg = cum[lo] - cum[lo - 1] || 1;
    const t = (L - cum[lo - 1]) / seg;
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, angle: Math.atan2(b.y - a.y, b.x - a.x) };
  };

  const marks: Geometry["marks"] = markYs.map((y, i) => {
    const len = lenAt(y);
    return { y, len, x: sample(len).x, el: items[i] };
  });
  marks.push({ y: yEnd, len: total, x: x0, el: null, end: true });
  return { d, total, marks, sample, height: H, x0 };
}

function draw(svg: SVGSVGElement, g: Geometry, endLabel: string) {
  const w = svg.getBoundingClientRect().width;
  svg.setAttribute("viewBox", `0 0 ${w} ${g.height}`);
  const ticks: string[] = [];
  // Minor graduations every 28px along the tube
  for (let l = 40; l < g.total - 10; l += 28) {
    const p = g.sample(l);
    const nx = -Math.sin(p.angle), ny = Math.cos(p.angle);
    ticks.push(`<line x1="${p.x + nx * 12}" y1="${p.y + ny * 12}" x2="${p.x + nx * 17}" y2="${p.y + ny * 17}" class="t-minor"/>`);
  }
  const marks = g.marks
    .map((m, i) => {
      const p = g.sample(m.len);
      const nx = -Math.sin(p.angle), ny = Math.cos(p.angle);
      return `<g class="t-mark" data-i="${i}">
        <line x1="${p.x - nx * 22}" y1="${p.y - ny * 22}" x2="${p.x - nx * 12}" y2="${p.y - ny * 12}"/>
        <line x1="${p.x + nx * 12}" y1="${p.y + ny * 12}" x2="${p.x + nx * 22}" y2="${p.y + ny * 22}"/>
        <circle cx="${p.x}" cy="${p.y}" r="15" class="t-ring"/>
      </g>`;
    })
    .join("");
  const end = g.marks[g.marks.length - 1];
  svg.innerHTML = `
    <defs>
      <linearGradient id="liq" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${g.height}">
        <stop offset="0" stop-color="#FFE36A"/><stop offset=".55" stop-color="#F1CA01"/><stop offset="1" stop-color="#E2AE00"/>
      </linearGradient>
    </defs>
    <style>
      .t-minor{stroke:rgba(238,247,248,.28);stroke-width:1}
      .t-mark line{stroke:rgba(238,247,248,.55);stroke-width:1.6;transition:stroke .4s}
      .t-mark .t-ring{fill:none;stroke:#F1CA01;stroke-width:1.5;opacity:0;transform-box:fill-box;transform-origin:center;transform:scale(.4);transition:opacity .5s,transform .7s cubic-bezier(.22,1,.36,1)}
      .t-mark.on line{stroke:#F1CA01}
      .t-mark.on .t-ring{opacity:.0}
      .t-mark.ping .t-ring{opacity:.9;transform:scale(1)}
      .t-label{fill:rgba(238,247,248,.6);font-size:11px;letter-spacing:.16em;font-weight:300}
    </style>
    <path d="${g.d}" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="30" stroke-linecap="round"/>
    <path d="${g.d}" fill="none" stroke="rgba(255,255,255,.42)" stroke-width="20" stroke-linecap="round"/>
    <path d="${g.d}" fill="none" stroke="rgba(16,19,20,.92)" stroke-width="17" stroke-linecap="round"/>
    <path class="liq-glow" d="${g.d}" fill="none" stroke="#F1CA01" stroke-opacity=".16" stroke-width="28" stroke-linecap="butt"/>
    <path class="liq" d="${g.d}" fill="none" stroke="url(#liq)" stroke-width="11" stroke-linecap="butt"/>
    <path d="${g.d}" fill="none" stroke="rgba(255,255,255,.38)" stroke-width="1.6" transform="translate(-5 -5)" stroke-dasharray="${g.total - 30} 9999"/>
    <circle cx="${g.x0}" cy="0" r="16" fill="rgba(16,19,20,.92)" stroke="rgba(255,255,255,.42)" stroke-width="1.5"/>
    <circle cx="${g.x0}" cy="0" r="10" fill="url(#liq)"/>
    ${ticks.join("")}
    ${marks}
    <text class="t-label" x="${end.x - 30}" y="${end.y + 4}" text-anchor="end">${endLabel}</text>
    <g class="men" opacity="0">
      <circle cx="-3" cy="0" r="18" fill="#F1CA01" fill-opacity=".16"/>
      <path d="M 0.5 -6 Q -8 0 0.5 6 Z" fill="rgba(16,19,20,.95)"/>
      <path d="M 0 -5.6 Q -8 0 0 5.6" fill="none" stroke="#FFF6C2" stroke-width="2.6" stroke-linecap="round"/>
      <circle cx="-0.5" cy="-5.2" r="1.6" fill="#ffffff"/>
      <circle cx="-0.5" cy="5.2" r="1.6" fill="#ffffff"/>
    </g>`;
}

export function Roadmap({ s }: { s: RoadmapSection }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const last = s.milestones[s.milestones.length - 1];
  const endLabel = `WEEK ${last?.weekEnd ?? ""}`;

  useEffect(() => {
    const track = trackRef.current;
    const svg = svgRef.current;
    if (!track || !svg) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let geo: Geometry | null = null;
    let reading = reduce ? Infinity : 0; // reading line, in px from the top of the track
    let rebuildRaf = 0;
    const reached = new Set<number>();

    const apply = () => {
      if (!geo) return;
      const { marks, total } = geo;
      // Piecewise map: reading line between two marks' y → liquid length between their lengths.
      const pts = [{ y: 0, len: 0 }, ...marks];
      let len = total;
      if (reading <= 0) len = 0;
      else
        for (let i = 1; i < pts.length; i++) {
          if (reading <= pts[i].y) {
            const a = pts[i - 1], b = pts[i];
            const t = (reading - a.y) / Math.max(1, b.y - a.y);
            len = a.len + (b.len - a.len) * t;
            break;
          }
        }
      len = Math.max(0, Math.min(total, len));
      svg.querySelectorAll<SVGPathElement>(".liq, .liq-glow").forEach((p) => p.setAttribute("stroke-dasharray", `${len} ${total + 40}`));
      const men = svg.querySelector<SVGGElement>(".men");
      if (men) {
        const p = geo.sample(len);
        men.setAttribute("transform", `translate(${p.x} ${p.y}) rotate(${(p.angle * 180) / Math.PI})`);
        men.setAttribute("opacity", len > 2 && len < total - 2 ? "1" : "0");
      }
      marks.forEach((m, i) => {
        const on = len >= m.len - 1;
        const g = svg.querySelector(`.t-mark[data-i="${i}"]`);
        g?.classList.toggle("on", on);
        if (on && !reached.has(i)) {
          reached.add(i);
          if (!reduce) {
            g?.classList.add("ping");
            setTimeout(() => g?.classList.remove("ping"), 700);
          }
        } else if (!on) reached.delete(i);
        if (m.el) m.el.dataset.reached = String(on);
      });
    };

    const rebuild = () => {
      rebuildRaf = 0;
      geo = measure(track);
      if (!geo) return;
      draw(svg, geo, endLabel);
      apply();
    };
    const ro = new ResizeObserver(() => {
      if (!rebuildRaf) rebuildRaf = requestAnimationFrame(rebuild);
    });
    ro.observe(track);
    rebuild();

    if (reduce) {
      track.dataset.static = "true";
      return () => ro.disconnect();
    }
    track.dataset.anim = "true";

    // GSAP loads only when the roadmap approaches the viewport.
    let killed = false;
    let kill: (() => void) | undefined;
    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
        if (killed) return;
        gsap.registerPlugin(ScrollTrigger);
        const proxy = { p: 0 };
        const tween = gsap.to(proxy, {
          p: 1,
          ease: "none",
          scrollTrigger: { trigger: track, start: "top 68%", end: "bottom 68%", scrub: 0.7, invalidateOnRefresh: true },
          onUpdate: () => {
            reading = proxy.p * (geo?.height ?? 0);
            apply();
          },
        });
        const refresh = () => ScrollTrigger.refresh();
        window.addEventListener("load", refresh);
        kill = () => {
          window.removeEventListener("load", refresh);
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(track);

    return () => {
      killed = true;
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(rebuildRaf);
      kill?.();
    };
  }, [endLabel]);

  return (
    <section className="section roadmap" id={s.anchorId || undefined} aria-labelledby={`${s._key}-h`}>
      <div className="roadmap__texture" aria-hidden="true">
        <Picture img={textures.caustics} sizes="100vw" decorative />
      </div>
      <div className="container">
        <div className="section-head">
          {s.eyebrow && <p className="eyebrow">{s.eyebrow}</p>}
          <h2 id={`${s._key}-h`}>{s.heading}</h2>
          {s.intro && <p className="lede">{s.intro}</p>}
        </div>
        {(s.formatTitle || !!s.formatPoints?.length) && (
          <div className="format-strip">
            {s.formatTitle && <p className="format-strip__title">{s.formatTitle}</p>}
            {!!s.formatPoints?.length && (
              <ul>
                {s.formatPoints.map((p) => (
                  <li key={p._key}>
                    <strong>{p.label}</strong> {p.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <div className="track" ref={trackRef}>
          <svg className="tube" ref={svgRef} aria-hidden="true" focusable="false" />
          <ol className="milestones">
            {s.milestones.map((m) => (
              <li className="milestone" key={m._key} style={{ ["--accent" as string]: ACCENT[m.accent] ?? ACCENT.sun }}>
                {m.image && (
                  <figure className="milestone__media">
                    <div className="frame">
                      <Picture img={m.image} sizes="(max-width: 899px) 90vw, 280px" />
                    </div>
                    {m.image.caption && <figcaption>{m.image.caption}</figcaption>}
                  </figure>
                )}
                <div className="milestone__body">
                  <p className="milestone__weeks">
                    <span className="milestone__dot" aria-hidden="true" />
                    Weeks {m.weekStart}–{m.weekEnd}
                    {m.months ? ` · ${m.months}` : ""}
                  </p>
                  <h3>{m.title}</h3>
                  <p className="milestone__summary">{m.summary}</p>
                  {m.activities.length > 0 && (
                    <ul>
                      {m.activities.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  )}
                  {!!m.photos?.length && (
                    <div className="milestone__photos">
                      {m.photos.map((ph) => (
                        <figure key={ph.src}>
                          <Picture img={ph} sizes="(max-width: 899px) 45vw, 240px" />
                        </figure>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
