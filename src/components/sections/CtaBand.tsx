"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import type { CtaSection } from "@/lib/types";
import { CtaLink } from "@/components/ui/CtaLink";
import { Icon } from "@/components/ui/Icon";
import type { SectionCtx } from "./context";

function formatFee(amount: number, currency = "INR") {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

// Pallet Ross "Gateway" banner: a big rounded photo carousel with floating tags and the main actions.
export function CtaBand({ s, ctx }: { s: CtaSection; ctx: SectionCtx }) {
  const images = s.images ?? [];
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (images.length < 2 || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((v) => (v + 1) % images.length), 5000);
    return () => clearInterval(id);
  }, [images.length, paused]);

  const fee = ctx.program.fee;
  const showFee = fee?.show && typeof fee.amount === "number";
  return (
    <section className="section gateway" id={s.anchorId || undefined} aria-labelledby={`${s._key}-h`}>
      <div className="container">
        <h2 id={`${s._key}-h`} className="gateway__title">
          {s.heading}
        </h2>
        <div className="gateway__banner" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)}>
          {images.map((img, k) => (
            <div className="gateway__slide" data-on={k === i} key={img.src} aria-hidden={k !== i}>
              <Image src={img.src} alt={img.alt} fill sizes="(max-width: 1240px) 100vw, 1240px" style={img.focus ? { objectPosition: `${img.focus.x * 100}% ${img.focus.y * 100}%` } : undefined} />
            </div>
          ))}
          <div className="gateway__shade" aria-hidden="true" />
          <div className="gateway__content">
            {s.body && <p>{s.body}</p>}
            <div className="btn-row">
              <CtaLink cta={s.primaryCta} links={ctx.links} location="gateway" />
              {s.secondaryCta && <CtaLink cta={s.secondaryCta} links={ctx.links} variant="glass" location="gateway" />}
            </div>
            <p className="fee-line">
              {showFee ? `Program fee: ${formatFee(fee!.amount!, fee!.currency || "INR")}${fee?.note ? ` · ${fee.note}` : ""}` : fee?.note}
            </p>
            {s.showBrochure && ctx.links.brochure?.url && (
              <CtaLink cta={{ label: "Download the brochure", kind: "brochure" }} links={ctx.links} variant="glass" size="sm" location="gateway" />
            )}
          </div>
          {images.length > 1 && (
            <div className="gateway__dots">
              <button className="icon-btn icon-btn--glass" onClick={() => setPaused((p) => !p)} aria-label={paused ? "Play slideshow" : "Pause slideshow"}>
                <Icon name={paused ? "play" : "pause"} size={14} />
              </button>
              {images.map((img, k) => (
                <button key={img.src} className="dot" aria-label={`Show photo ${k + 1}`} aria-current={k === i} onClick={() => setI(k)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
