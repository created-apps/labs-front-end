"use client";
import { useSyncExternalStore } from "react";
import Link from "next/link";
import { AnimatePresence, m } from "motion/react";
import { GoogleAnalytics } from "@next/third-parties/google";

const KEY = "created-labs-consent";
const EVENT = "created-consent-change";
type Choice = "granted" | "denied" | "unset";

function read(): Choice {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : "unset";
  } catch {
    return "denied"; // storage blocked: never show the banner, never load analytics
  }
}
function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
function decide(c: Exclude<Choice, "unset">) {
  try {
    localStorage.setItem(KEY, c);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

// GA4 loads only after the visitor accepts. Nothing loads until a choice is made.
export function Analytics({ gaId }: { gaId?: string | null }) {
  const choice = useSyncExternalStore(subscribe, read, () => "denied" as Choice);
  if (!gaId) return null;
  return (
    <>
      {choice === "granted" && <GoogleAnalytics gaId={gaId} />}
      <AnimatePresence>
        {choice === "unset" && (
          <m.div
            className="consent"
            role="region"
            aria-label="Cookie preferences"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <p>
              We&apos;d like to use Google Analytics cookies to see which parts of this page help families most. No
              advertising cookies. <Link href="/privacy">Privacy &amp; cookies</Link>
            </p>
            <div className="btn-row">
              <button className="btn btn--sm" onClick={() => decide("granted")}>
                Accept analytics
              </button>
              <button className="btn btn--ghost btn--sm" onClick={() => decide("denied")}>
                Decline
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
