"use client";
import { useState, type ReactNode } from "react";
import { BrochureModal } from "./BrochureModal";

/**
 * Renders exactly the anchor it was given, but intercepts the click to collect
 * the visitor's details first (see BrochureModal). Keeping the anchor — rather
 * than a button — means every brochure link keeps its existing markup, styling
 * and right-click-to-save behaviour.
 */
export function BrochureGate({
  url,
  filename,
  className,
  children,
  onIntent,
}: {
  url: string;
  filename?: string;
  className?: string;
  children: ReactNode;
  /** only passed from client components (analytics) */
  onIntent?: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <a
        className={className}
        href={url}
        {...(filename ? { download: filename } : {})}
        onClick={(e) => {
          e.preventDefault();
          onIntent?.();
          setOpen(true);
        }}
      >
        {children}
      </a>
      {open && <BrochureModal url={url} filename={filename} onClose={() => setOpen(false)} />}
    </>
  );
}
