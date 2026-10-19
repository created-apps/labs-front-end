"use client";
import { useId, useState } from "react";
import type { FaqSection } from "@/lib/types";
import { Picture } from "@/components/ui/Picture";
import { track } from "@/components/analytics/track";

// Plain, immediate accordion: answers stay in the HTML (search engines read them) and open instantly.
export function Faq({ s, email }: { s: FaqSection; email: string }) {
  const [open, setOpen] = useState<string | null>(s.items[0]?._key ?? null);
  const uid = useId();
  return (
    <section className="section" id={s.anchorId || undefined} aria-labelledby={`${s._key}-h`}>
      <div className="container faq">
        <div className="faq__aside">
          <div className="section-head" style={{ marginBottom: 0 }}>
            {s.eyebrow && <p className="eyebrow">{s.eyebrow}</p>}
            <h2 id={`${s._key}-h`}>{s.heading}</h2>
          </div>
          <div className="contact-card">
            {s.contactNote && <p>{s.contactNote}</p>}
            <a href={`mailto:${email}`} onClick={() => track("contact_email_click", { location: "faq" })}>
              {email}
            </a>
          </div>
          {s.image && (
            <div className="frame">
              <Picture img={s.image} sizes="(max-width: 899px) 100vw, 34vw" />
            </div>
          )}
        </div>
        <div className="accordion">
          {s.items.map((item) => {
            const isOpen = open === item._key;
            const pid = `${uid}-${item._key}`;
            return (
              <div className="acc-item" key={item._key}>
                <h3>
                  <button
                    className="acc-trigger"
                    aria-expanded={isOpen}
                    aria-controls={pid}
                    onClick={() => {
                      setOpen(isOpen ? null : item._key);
                      if (!isOpen) track("faq_open", { question: item.question.slice(0, 90) });
                    }}
                  >
                    <span>{item.question}</span>
                    <span className="acc-sign" aria-hidden="true">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                </h3>
                <div id={pid} role="region" className="acc-panel" hidden={!isOpen}>
                  <p>{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
