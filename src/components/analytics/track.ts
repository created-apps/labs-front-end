// GA4 events. gtag only exists after the visitor accepts analytics cookies.
export type TrackedEvent = "apply_click" | "consultation_click" | "brochure_download" | "faq_open" | "contact_email_click";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: TrackedEvent, params: Record<string, string | number | undefined> = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", event, params);
}
