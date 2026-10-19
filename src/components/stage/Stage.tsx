"use client";
import { useEffect, useRef, useState } from "react";
import type { Stage as StageApi } from "./scene";
import createdLogo from "@/assets/images/brand/created-logo.png";
import workbenchHd from "@/assets/images/generated/workbench-hd.jpg";
import workbenchMd from "@/assets/images/generated/workbench-md.jpg";
import causticsSoft from "@/assets/images/generated/caustics-soft.jpg";
// stills of the scene (rendered by /stage-capture): first frame, settled frame, empty beaker
import opening from "@/assets/images/stage/opening.webp";
import openingMobile from "@/assets/images/stage/opening-mobile.webp";
import hero from "@/assets/images/stage/hero.webp";
import heroMobile from "@/assets/images/stage/hero-mobile.webp";
import heroStart from "@/assets/images/stage/hero-start.webp";
import heroStartMobile from "@/assets/images/stage/hero-start-mobile.webp";

/**
 * The hero's 3D scene. On every load (the gate in <head> sets html[data-opening="play"]) it starts on
 * the CreatED Labs logo and flows into the workbench (see docs/MOTION-AND-MEDIA.md); the hero copy comes
 * in as the camera settles, or straight away if the visitor scrolls. Deep links (#section) start at the
 * workbench. It starts as soon as the page has painted, with a still of the first frame underneath so
 * there's never a blank frame, and pauses when the hero is off screen. Reduced motion gets a still of the
 * finished hero.
 */
export function Stage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const root = rootRef.current, canvas = canvasRef.current;
    if (!root || !canvas) return;
    const html = document.documentElement;
    let opening = html.dataset.opening === "play";
    const settle = () => {
      if (html.dataset.opening === "play") html.dataset.opening = "done";
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData || !("WebGL2RenderingContext" in window)) {
      settle();
      return;
    }
    const mobile = window.matchMedia("(max-width: 899px), (pointer: coarse)").matches;
    let stage: StageApi | null = null;
    let disposed = false, visible = true, started = false;

    const sync = () => {
      if (!stage) return;
      if (visible && document.visibilityState === "visible") stage.start();
      else stage.stop();
    };
    // scrolling during the opening brings the hero copy in at once; the scene carries on
    const onScroll = () => window.scrollY > 40 && settle();
    if (opening) window.addEventListener("scroll", onScroll, { passive: true });
    // a slow device or connection: don't hold the hero back; play the workbench version instead
    const fallback = opening
      ? window.setTimeout(() => {
          if (started) return;
          opening = false;
          settle();
        }, 2600)
      : 0;

    const load = async () => {
      const [{ createStage }, logo] = await Promise.all([
        import("./scene"),
        opening ? import("./logo").then((m) => m.buildLogo(createdLogo.src).catch(() => null)) : null,
      ]);
      if (disposed) return;
      const withOpening = opening && !!logo;
      if (opening && !logo) settle();
      try {
        stage = createStage(canvas, {
          mobile,
          benchUrl: mobile ? workbenchMd.src : workbenchHd.src,
          causticsUrl: causticsSoft.src,
          opening: withOpening ? logo! : undefined,
          onFirstFrame: () => {
            started = true;
            setLive(true);
          },
          onSettle: settle,
        });
      } catch {
        settle(); // no usable WebGL: the still remains
        return;
      }
      sync();
    };
    // start as soon as the page has painted; no interaction needed
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    if (ric) ric(() => void load(), { timeout: 300 });
    else window.setTimeout(() => void load(), 60);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    });
    io.observe(root);
    document.addEventListener("visibilitychange", sync);
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") stage?.setPointer((e.clientX / window.innerWidth - 0.5) * 2, (e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      disposed = true;
      clearTimeout(fallback);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pointermove", onMove);
      stage?.dispose();
    };
  }, []);

  return (
    <div className="hero__stage" ref={rootRef} data-live={live} aria-hidden="true">
      {/* first visit: the opening frame (the logo above the workbench) */}
      <picture className="hero__still hero__still--opening">
        <source media="(max-width: 899px)" srcSet={openingMobile.src} />
        {/* eager: it's the first thing a first-time visitor sees (31 KB; 10 KB on phones) */}
        <img src={opening.src} alt="" fetchPriority="high" decoding="async" />
      </picture>
      {/* repeat visits start at the workbench; reduced motion shows the finished hero */}
      <picture className="hero__still hero__still--base">
        <source media="(max-width: 899px) and (prefers-reduced-motion: reduce)" srcSet={heroMobile.src} />
        <source media="(prefers-reduced-motion: reduce)" srcSet={hero.src} />
        <source media="(max-width: 899px)" srcSet={heroStartMobile.src} />
        <img src={heroStart.src} alt="" loading="lazy" fetchPriority="high" decoding="async" />
      </picture>
      <canvas ref={canvasRef} />
      <div className="hero__vignette" />
    </div>
  );
}
