import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { getSettings } from "@/lib/content";
import { OPENING_GATE } from "@/components/stage/gate";
import "./globals.css";

// Brand typeface from the CreatED deck, self-hosted by next/font (no layout shift, no Google request at runtime).
const vietnam = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-vietnam",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    metadataBase: new URL(settings.siteUrl),
    applicationName: settings.siteName,
    ...(settings.searchConsoleVerification ? { verification: { google: settings.searchConsoleVerification } } : {}),
  };
}

export const viewport: Viewport = {
  themeColor: "#F2FDFF",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // the hero-opening gate sets data-opening on <html> before paint
    <html lang="en-IN" className={vietnam.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: OPENING_GATE }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
