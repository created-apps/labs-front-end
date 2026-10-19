import { VisualEditing } from "next-sanity/visual-editing";
import { getHomeProgram, getSettings, isDraft } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { Analytics } from "@/components/analytics/Analytics";
import { navFromSections } from "@/components/sections/SectionRenderer";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, home, draft] = await Promise.all([getSettings(), getHomeProgram(), isDraft()]);
  // Menu anchors point at the home page so they also work from program and project pages.
  const nav = navFromSections(home.sections).map((n) => ({ ...n, href: `/${n.href}` }));
  const links = {
    applyUrl: settings.applyUrl,
    consultationUrl: settings.consultationUrl,
    primaryEmail: settings.primaryEmail,
    brochure: settings.brochure,
  };
  return (
    <MotionProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header nav={nav} links={links} />
      <main id="main">{children}</main>
      <Footer settings={settings} nav={nav} />
      <Analytics gaId={settings.gaMeasurementId} />
      {draft && (
        <>
          <VisualEditing />
          <p className="preview-bar" role="status">
            Previewing unpublished changes
            {/* Route handler, not a page: a full navigation is intended */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/api/draft-mode/disable">Exit preview</a>
          </p>
        </>
      )}
    </MotionProvider>
  );
}
