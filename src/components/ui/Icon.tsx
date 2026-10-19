// Custom icon set in the brand deck's "half-filled" bulb style: ink outline, Sunglow fill on one half.
import type { GlanceItem } from "@/lib/types";

type Name = GlanceItem["icon"] | "check" | "arrow" | "arrowLeft" | "plus" | "menu" | "close" | "mail" | "pause" | "play" | "download";

const SUN = "#F1CA01";

export function Icon({ name, size = 24, className }: { name: Name; size?: number; className?: string }) {
  const p = { width: size, height: size, viewBox: "0 0 48 48", fill: "none", className, "aria-hidden": true as const, focusable: false as const };
  const s = { stroke: "currentColor", strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "seats":
      return (
        <svg {...p}>
          <path d="M8 40V30a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v10Z" fill={SUN} />
          <circle cx="16" cy="15" r="6" fill={SUN} />
          <circle cx="16" cy="15" r="6" {...s} />
          <path d="M8 40V30a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v10" {...s} />
          <circle cx="32" cy="15" r="6" {...s} />
          <path d="M24 40V30a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v10" {...s} />
        </svg>
      );
    case "calendar":
      return (
        <svg {...p}>
          <path d="M8 18h32v20a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4Z" fill={SUN} />
          <rect x="8" y="10" width="32" height="32" rx="4" {...s} />
          <path d="M8 18h32M16 6v8M32 6v8" {...s} />
          <path d="M16 26h4M28 26h4M16 34h4" {...s} />
        </svg>
      );
    case "mentor":
      return (
        <svg {...p}>
          <path d="M24 6 4 15l20 9 20-9Z" fill={SUN} />
          <path d="M24 6 4 15l20 9 20-9Z" {...s} />
          <path d="M12 19v11c0 3 5.4 6 12 6s12-3 12-6V19" {...s} />
          <path d="M44 15v12" {...s} />
        </svg>
      );
    case "flask":
      return (
        <svg {...p}>
          <path d="M12.5 33h23l4.2 7.3A2.5 2.5 0 0 1 37.5 44h-27a2.5 2.5 0 0 1-2.2-3.7Z" fill={SUN} />
          <path d="M19 5h10M20 5v13L8.3 40.3A2.5 2.5 0 0 0 10.5 44h27a2.5 2.5 0 0 0 2.2-3.7L28 18V5" {...s} />
          <path d="M12.5 33h23" {...s} />
          <circle cx="22" cy="27" r="1.6" fill="currentColor" />
        </svg>
      );
    case "paper":
      return (
        <svg {...p}>
          <path d="M10 26h28v14a3 3 0 0 1-3 3H13a3 3 0 0 1-3-3Z" fill={SUN} />
          <path d="M28 5H13a3 3 0 0 0-3 3v32a3 3 0 0 0 3 3h22a3 3 0 0 0 3-3V15Z" {...s} />
          <path d="M28 5v10h10M17 23h14M17 30h14M17 37h8" {...s} />
        </svg>
      );
    case "trophy":
      return (
        <svg {...p}>
          <path d="M14 6h20v12a10 10 0 0 1-20 0Z" fill={SUN} />
          <path d="M14 6h20v12a10 10 0 0 1-20 0Z" {...s} />
          <path d="M14 10H7v3a7 7 0 0 0 7 7M34 10h7v3a7 7 0 0 1-7 7M24 28v8M16 42h16M18 42l2-6h8l2 6" {...s} />
        </svg>
      );
    case "check":
      return (
        <svg {...p}>
          <path d="M24 4a20 20 0 0 1 0 40Z" fill={SUN} />
          <circle cx="24" cy="24" r="20" {...s} />
          <path d="m15 24.5 6 6 12-13" {...s} />
        </svg>
      );
    case "arrow":
      return (
        <svg {...p}>
          <path d="M8 24h31M27 12l12 12-12 12" {...s} strokeWidth={3.4} />
        </svg>
      );
    case "arrowLeft":
      return (
        <svg {...p}>
          <path d="M40 24H9M21 12 9 24l12 12" {...s} strokeWidth={3.4} />
        </svg>
      );
    case "plus":
      return (
        <svg {...p}>
          <path d="M24 12v24M12 24h24" {...s} strokeWidth={3.4} />
        </svg>
      );
    case "menu":
      return (
        <svg {...p}>
          <path d="M10 17h28M10 31h28" {...s} strokeWidth={3.2} />
        </svg>
      );
    case "close":
      return (
        <svg {...p}>
          <path d="m14 14 20 20M34 14 14 34" {...s} strokeWidth={3.2} />
        </svg>
      );
    case "mail":
      return (
        <svg {...p}>
          <rect x="6" y="11" width="36" height="26" rx="4" {...s} />
          <path d="m7 13 17 13 17-13" {...s} />
        </svg>
      );
    case "pause":
      return (
        <svg {...p}>
          <path d="M17 12v24M31 12v24" {...s} strokeWidth={4} />
        </svg>
      );
    case "play":
      return (
        <svg {...p}>
          <path d="M16 11v26l21-13Z" fill="currentColor" />
        </svg>
      );
    case "download":
      return (
        <svg {...p}>
          <path d="M24 8v22M14 21l10 10 10-10M10 40h28" {...s} strokeWidth={3.2} />
        </svg>
      );
  }
}
