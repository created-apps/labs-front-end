"use client";
import { useEffect, useRef } from "react";
import type { Img } from "@/lib/types";
import { Picture } from "@/components/ui/Picture";

/**
 * Coverflow of real student photos (after the "Overflow" gallery reference). The photos stand in a row
 * folded at an angle; the one in focus swings flat and faces you. On desktop it follows the pointer
 * across the row; on touch you drag; with the keyboard, the arrow keys step through. Nothing moves on
 * its own. Each card's pose is a pure function of a single "focus" value that eases towards its target.
 */
export function Coverflow({ photos, label }: { photos: Img[]; label: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>(".cflow__card"));
    const n = cards.length;
    if (!n) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let focus = (n - 1) / 2, target = focus, raf = 0;

    // The row stays anchored (as in the reference): the gaps either side of the open card widen and
    // the rest stay tight, so the photo opens where the pointer is rather than sliding to the centre.
    const xs: number[] = [];
    const pose = () => {
      const w = cards[0].offsetWidth;
      const near = w * 0.78, step = w * 0.27; // gap beside the open card, then the folded strips
      let sum = 0;
      xs[0] = 0;
      for (let j = 0; j < n - 1; j++) {
        const t = Math.abs(j + 0.5 - focus);
        sum += step + (near - step) * Math.min(1, Math.max(0, 1.5 - t));
        xs[j + 1] = sum;
      }
      cards.forEach((card, i) => {
        const d = i - focus, a = Math.abs(d), s = Math.sign(d), open = Math.min(a, 1);
        const x = xs[i] - sum / 2;
        card.style.transform = `translateX(${x.toFixed(1)}px) translateZ(${(-open * 90).toFixed(1)}px) rotateY(${(-s * open * 64).toFixed(2)}deg)`;
        card.style.zIndex = String(100 - Math.round(a * 10));
        card.dataset.active = String(a < 0.5);
      });
    };
    const tick = () => {
      raf = 0;
      focus += (target - focus) * (reduce ? 1 : 0.14);
      if (Math.abs(target - focus) < 0.002) focus = target;
      pose();
      if (focus !== target) raf = requestAnimationFrame(tick);
    };
    const go = (t: number) => {
      target = Math.min(n - 1, Math.max(0, t));
      if (!raf) raf = requestAnimationFrame(tick);
    };

    // pointer: hovering across the row scrubs it (mouse); dragging scrubs it (touch/pen)
    let drag: { x: number; from: number } | null = null;
    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      if (e.pointerType === "mouse" && !drag) {
        go(((e.clientX - r.left) / r.width) * (n - 1));
      } else if (drag) {
        go(drag.from - (e.clientX - drag.x) / (cards[0].offsetWidth * 0.5));
      }
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      drag = { x: e.clientX, from: target };
    };
    const onUp = () => {
      if (!drag) return;
      drag = null;
      go(Math.round(target)); // settle on a photo
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(Math.round(target) + 1);
      else if (e.key === "ArrowLeft") go(Math.round(target) - 1);
      else return;
      e.preventDefault();
    };
    const onClick = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>(".cflow__card");
      if (card) go(cards.indexOf(card));
    };
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    root.addEventListener("keydown", onKey);
    root.addEventListener("click", onClick);
    const ro = new ResizeObserver(pose);
    ro.observe(root);
    pose();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      root.removeEventListener("keydown", onKey);
      root.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div
      className="cflow"
      ref={rootRef}
      role="group"
      aria-roledescription="carousel"
      aria-label={`${label}. Move across the photos, drag, or use the arrow keys.`}
      tabIndex={0}
    >
      <ul className="cflow__row">
        {photos.map((img, i) => (
          <li key={img.src} className="cflow__card" style={{ "--i": i } as React.CSSProperties}>
            <Picture img={img} sizes="(max-width: 899px) 50vw, 280px" />
          </li>
        ))}
      </ul>
    </div>
  );
}
