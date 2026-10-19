"use client";
import { useEffect, useRef, useState } from "react";
import type { Clip } from "@/lib/types";

// Short, muted, looping clip that only plays while on screen. Reduced motion shows the poster.
// The poster is attached as the clip nears the viewport, so it never competes with the hero for bandwidth.
export function LoopVideo({ clip, className }: { clip: Clip; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nearIo = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setNear(true);
        nearIo.disconnect();
      },
      { rootMargin: "800px 0px" },
    );
    nearIo.observe(v);
    if (reduce) return () => nearIo.disconnect();
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (v.preload !== "auto") v.preload = "auto";
          v.play().catch(() => {});
        } else v.pause();
      },
      { rootMargin: "120px" },
    );
    io.observe(v);
    return () => {
      nearIo.disconnect();
      io.disconnect();
    };
  }, []);
  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      preload="none"
      poster={near ? (clip.poster ?? undefined) : undefined}
      aria-label={clip.alt || undefined}
      aria-hidden={clip.alt ? undefined : true}
    >
      <source src={clip.src} type="video/mp4" />
    </video>
  );
}
