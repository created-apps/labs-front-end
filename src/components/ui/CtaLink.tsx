"use client";
import type { Cta, SiteSettings } from "@/lib/types";
import { track, type TrackedEvent } from "@/components/analytics/track";
import { Icon } from "./Icon";

type Links = Pick<SiteSettings, "applyUrl" | "consultationUrl" | "primaryEmail" | "brochure">;

export function resolveCta(cta: Cta, links: Links): { href: string | null; external: boolean; event?: TrackedEvent } {
  switch (cta.kind) {
    case "apply":
      return { href: links.applyUrl, external: true, event: "apply_click" };
    case "consult":
      return links.consultationUrl
        ? { href: links.consultationUrl, external: true, event: "consultation_click" }
        : {
            href: `mailto:${links.primaryEmail}?subject=${encodeURIComponent("CreatED Labs consultation")}`,
            external: false,
            event: "consultation_click",
          };
    case "brochure":
      return { href: links.brochure?.url ? `${links.brochure.url}?dl=` : null, external: false, event: "brochure_download" };
    default:
      return { href: cta.href || null, external: !!cta.href?.startsWith("http") };
  }
}

export function CtaLink({
  cta,
  links,
  variant = "primary",
  size,
  location,
  arrow = true,
  className = "",
}: {
  cta: Cta;
  links: Links;
  variant?: "primary" | "ghost" | "ink" | "glass";
  size?: "sm";
  location: string;
  arrow?: boolean;
  className?: string;
}) {
  const { href, external, event } = resolveCta(cta, links);
  if (!href) return null;
  const cls = ["btn", variant !== "primary" && `btn--${variant}`, size && `btn--${size}`, className].filter(Boolean).join(" ");
  return (
    <a
      className={cls}
      href={href}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      onClick={() => event && track(event, { location, label: cta.label })}
    >
      {cta.label}
      {arrow && <Icon name={cta.kind === "brochure" ? "download" : "arrow"} size={18} />}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
