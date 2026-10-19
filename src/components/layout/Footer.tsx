import Image from "next/image";
import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import type { NavItem } from "./Header";

export function Footer({ settings, nav }: { settings: SiteSettings; nav: NavItem[] }) {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link href="/" className="brand" aria-label="CreatED Labs home">
              <Image src="/images/created-logo.png" alt="CreatED" width={1945} height={586} sizes="120px" />
              <span className="brand__labs" aria-hidden="true">
                Labs
              </span>
            </Link>
            <p className="footer-tag">{settings.tagline}</p>
          </div>
          <div>
            <h2>On this page</h2>
            <ul>
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href}>{n.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Contact</h2>
            <ul>
              <li>
                <a href={`mailto:${settings.primaryEmail}`}>{settings.primaryEmail}</a>
              </li>
              <li>
                <a href={settings.applyUrl} target="_blank" rel="noopener">
                  Application form
                </a>
              </li>
              <li>
                <Link href="/privacy">Privacy &amp; cookies</Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="wordmark" aria-hidden="true">
          Creat<span>ED</span> Labs
        </p>
        <div className="footer-bottom">
          <span>
            © {year} CreatED. {settings.footerNote}
          </span>
          <span>Photos: CreatED Labs students at work.</span>
        </div>
      </div>
    </footer>
  );
}
