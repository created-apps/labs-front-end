"use client";
import { useEffect, useState, type FormEvent } from "react";
import { Icon } from "./Icon";

/**
 * Collects a name/email/phone before handing over the brochure. Ported from the
 * created-labs intake: same fields, same validation, same endpoint — only the
 * classes are this site's own (.glass / .btn / .icon-btn) so nothing looks new.
 */
export function BrochureModal({ url, filename, onClose }: { url: string; filename?: string; onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [school, setSchool] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error" | "done">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function startDownload() {
    const a = document.createElement("a");
    a.href = url;
    if (filename) a.download = filename;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/brochure-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, school }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("done");
      startDownload();
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="brochure-modal-title">
        <button className="icon-btn icon-btn--glass modal-close" aria-label="Close" onClick={onClose} type="button">
          <Icon name="close" size={14} />
        </button>

        {status === "done" ? (
          <>
            <h3 id="brochure-modal-title">You&apos;re all set</h3>
            <p className="form-success">
              The brochure download should have started. If it didn&apos;t,{" "}
              <a href={url} {...(filename ? { download: filename } : {})}>
                click here
              </a>
              .
            </p>
          </>
        ) : (
          <>
            <h3 id="brochure-modal-title">Get the Brochure</h3>
            <p className="lede">Share a few details and we&apos;ll send the CreatED Labs brochure your way.</p>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="bm-name">Full name</label>
                <input id="bm-name" type="text" placeholder="John Smith" required minLength={2} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              </div>
              <div className="field">
                <label htmlFor="bm-email">Email</label>
                <input id="bm-email" type="email" placeholder="hi@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              </div>
              <div className="field">
                <label htmlFor="bm-phone">Phone</label>
                <input id="bm-phone" type="tel" placeholder="+91XXXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
              </div>
              <div className="field">
                <label htmlFor="bm-school">School</label>
                <input
                  id="bm-school"
                  type="text"
                  placeholder="Delhi Public School"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  autoComplete="organization"
                />
              </div>
              {status === "error" && <p className="form-error">{error}</p>}
              <div className="modal-actions">
                <button type="submit" className="btn" disabled={status === "submitting"}>
                  {status === "submitting" ? "Sending…" : "Get Brochure"}
                  <Icon name="download" size={18} />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
