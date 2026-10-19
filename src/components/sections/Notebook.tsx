"use client";
import { useEffect, useRef } from "react";
import type { NotebookSection } from "@/lib/types";

/**
 * Program Deliverables: the next page of the notebook from the hero workbench.
 *
 * As the visitor scrolls out of the hero, the description sheet on the notepad lifts from the bottom,
 * tears off along the perforation and is tossed aside (its text stays on it), leaving a torn stub. The
 * fresh sheet underneath comes off next and travels down onto this section, scrubbed by scroll (and
 * reversible), where it becomes the checklist: each line appears with its quantity circled and its box
 * ticked in pen, once. Without the hero (or with reduced motion) the page simply sits here.
 */
export function Notebook({ s }: { s: NotebookSection }) {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    const items = Array.from(page.querySelectorAll<HTMLElement>(".check"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      items.forEach((i) => (i.dataset.on = "true"));
      return;
    }

    page.dataset.ready = "true"; // items start hidden only once script is running
    // the checklist fills in as each line reaches the reading zone (only once the page has landed)
    let landed = true;
    const seen = new Set<Element>();
    const tick = () => landed && seen.forEach((el) => ((el as HTMLElement).dataset.on = "true"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && seen.add(e.target));
        tick();
      },
      { rootMargin: "0px 0px -28% 0px" },
    );
    items.forEach((i) => io.observe(i));

    const leaf = document.getElementById("hero-leaf");
    const fresh = document.getElementById("fresh-sheet");
    const pad = leaf?.closest<HTMLElement>(".pad");
    if (!leaf || !fresh || !pad) return () => io.disconnect();

    // the flight: a copy of the fresh page in a fixed layer above the page
    const flight = document.createElement("div");
    flight.className = "flight";
    flight.setAttribute("aria-hidden", "true");
    const paper = fresh.cloneNode(true) as HTMLElement;
    paper.removeAttribute("id");
    paper.classList.add("flight__paper");
    // the page's heading arrives with it (laid out at the final width and scaled, so nothing reflows);
    // the checklist itself is written only once the page has landed
    const pageCopy = document.createElement("div");
    pageCopy.className = "flight__page";
    Array.from(page.children)
      .filter((c) => !c.classList.contains("deliver__list"))
      .forEach((c) => pageCopy.appendChild(c.cloneNode(true)));
    pageCopy.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
    paper.appendChild(pageCopy);
    flight.appendChild(paper);
    document.body.appendChild(flight);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const clamp = (x: number) => Math.min(1, Math.max(0, x));
    const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
    const LIFT = 0.3; // the sheet lifts from the bottom, hinged at the perforation
    const TORN = 0.5; // by here it has torn off and been tossed aside
    let raf = 0, last = -1;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const to = page.getBoundingClientRect();
      // The tear waits until the notepad has been fully on screen: it starts once the pad's top edge
      // has scrolled up to 6% of the screen (on phones the pad starts below the fold, so the visitor
      // can read it first), and the fresh sheet has landed once this page's top reaches 20%.
      const sy = window.scrollY;
      const start = Math.max(0, pad.getBoundingClientRect().top + sy - vh * 0.06);
      const end = to.top + sy - vh * 0.2;
      const p = end <= start ? (sy >= end ? 1 : 0) : clamp((sy - start) / (end - start));
      if (p === last) return;
      last = p;
      // 1. the description sheet lifts, tears along the perforation and is tossed aside
      const raise = ease(clamp(p / LIFT));
      const toss = ease(clamp((p - LIFT * 0.8) / (TORN - LIFT * 0.8)));
      pad.style.setProperty("--lift", (raise * 64).toFixed(2));
      pad.style.setProperty("--toss", toss.toFixed(3));
      pad.style.setProperty("--shade", raise.toFixed(3));
      pad.dataset.torn = String(p > LIFT * 0.8);
      // 2. the fresh sheet underneath comes off and travels down to become this page
      const flying = p > TORN && p < 0.999;
      pad.dataset.lifted = String(p > TORN);
      page.dataset.landing = String(p < 0.999);
      flight.dataset.on = String(flying);
      if (landed !== p >= 0.999) {
        landed = p >= 0.999;
        tick();
      }
      if (!flying) return;
      const from = fresh.getBoundingClientRect();
      const travel = ease(clamp((p - TORN) / (1 - TORN)));
      const lift = Math.sin(Math.PI * travel);
      const x = lerp(from.left, to.left, travel), y = lerp(from.top, to.top, travel);
      const w = lerp(from.width, to.width, travel), h = lerp(from.height, to.height, travel);
      flight.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      flight.style.width = `${w}px`;
      flight.style.height = `${h}px`;
      paper.style.transform = `perspective(1400px) rotateX(${lerp(14, 0, travel) - 6 * lift}deg) rotateZ(${lerp(-3, 0, travel)}deg) translateZ(${lift * 36}px)`;
      paper.style.setProperty("--fade", String(1 - clamp((travel - 0.35) / 0.3)));
      paper.style.setProperty("--shadow", String(0.35 + lift * 0.4));
      pageCopy.style.width = `${to.width}px`;
      pageCopy.style.transform = `scale(${w / to.width})`;
      pageCopy.style.opacity = String(clamp((travel - 0.45) / 0.4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      flight.remove();
      pad.dataset.lifted = "false";
      pad.dataset.torn = "false";
      ["--lift", "--toss", "--shade"].forEach((v) => pad.style.removeProperty(v));
    };
  }, []);

  return (
    <section className="deliver" id={s.anchorId || undefined} aria-labelledby={`${s._key}-h`}>
      <div className="container">
        <div className="sheet deliver__page" ref={pageRef}>
          <div className="sheet__head" aria-hidden="true">
            <span>CreatED Labs</span>
            <span>Research notebook</span>
          </div>
          <h2 className="deliver__title" id={`${s._key}-h`}>
            {s.eyebrow || "Program Deliverables"}
          </h2>
          {s.heading && <p className="deliver__lede">{s.heading}</p>}
          <ol className="deliver__list">
            {s.notes.map((n, i) => (
              <li key={n._key} className="check" style={{ "--i": i } as React.CSSProperties}>
                <span className="check__box" aria-hidden="true">
                  <svg viewBox="0 0 40 40">
                    <path className="check__tick" pathLength={1} d="M8 21 C 11 24, 14 28, 16 31 C 21 20, 27 12, 35 6" />
                  </svg>
                </span>
                {n.qty && (
                  <span className="check__qty">
                    {n.qty}
                    <svg viewBox="0 0 60 60" aria-hidden="true">
                      <path className="check__ring" pathLength={1} d="M33 7 C 16 5, 6 18, 8 32 C 10 47, 27 55, 41 49 C 53 43, 56 26, 47 15 C 42 9, 33 6, 24 9" />
                    </svg>
                  </span>
                )}
                <span className="check__text">
                  <span className="check__title">{n.title}</span>
                  {n.body && <span className="check__note">{n.body}</span>}
                  {!!n.links?.length && (
                    <span className="check__links">
                      {n.links.map((l) => (
                        <a key={l.href} href={l.href} target="_blank" rel="noopener" className={l.logo ? "check__logo" : undefined}>
                          {l.logo ? (
                            // eslint-disable-next-line @next/next/no-img-element -- official logo at its own proportions
                            <img src={l.logo.src} width={l.logo.width} height={l.logo.height} alt={l.label} loading="lazy" decoding="async" />
                          ) : (
                            l.label
                          )}
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      ))}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
