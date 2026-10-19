"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import createdLogo from "@/assets/images/brand/created-logo.png";
import Link from "next/link";
import { AnimatePresence, m } from "motion/react";
import type { SiteSettings } from "@/lib/types";
import { CtaLink } from "@/components/ui/CtaLink";
import { Icon } from "@/components/ui/Icon";

export type NavItem = { href: string; label: string };

export function Header({ nav, links }: { nav: NavItem[]; links: Pick<SiteSettings, "applyUrl" | "consultationUrl" | "primaryEmail" | "brochure"> }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-header" data-scrolled={scrolled || open}>
      <div className="container site-header__inner">
        <Link href="/" className="brand" aria-label="CreatED Labs home">
          <Image src={createdLogo} alt="CreatED" preload sizes="110px" />
          <span className="brand__labs" aria-hidden="true">
            Labs
          </span>
        </Link>
        <nav className="nav" aria-label="Main">
          {nav.map((n) => (
            <a key={n.href} href={n.href}>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="header-ctas">
          <CtaLink cta={{ label: "Book a Consultation", kind: "consult" }} links={links} variant="ghost" size="sm" location="header" arrow={false} />
          <CtaLink cta={{ label: "Apply Now", kind: "apply" }} links={links} size="sm" location="header" arrow={false} />
        </div>
        <button
          className="menu-btn"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? "close" : "menu"} size={22} />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            className="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav aria-label="Mobile">
              {nav.map((n, i) => (
                <m.a
                  key={n.href}
                  href={n.href}
                  style={{ display: "block" }}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i + 0.05 }}
                  onClick={() => setOpen(false)}
                >
                  {n.label}
                </m.a>
              ))}
            </nav>
            <div className="btn-row">
              <CtaLink cta={{ label: "Book a Consultation", kind: "consult" }} links={links} variant="ghost" location="mobile_menu" />
              <CtaLink cta={{ label: "Apply Now", kind: "apply" }} links={links} location="mobile_menu" />
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
