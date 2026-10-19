import type { Metadata } from "next";
import type { FaqSection, Program, Seo, SiteSettings } from "./types";

export function buildMetadata({
  settings,
  seo,
  fallbackTitle,
  fallbackDescription,
  path,
}: {
  settings: SiteSettings;
  seo?: Seo | null;
  fallbackTitle?: string;
  fallbackDescription?: string;
  path: string;
}): Metadata {
  const title = seo?.title || fallbackTitle || settings.defaultSeo.title || settings.siteName;
  const description = seo?.description || fallbackDescription || settings.defaultSeo.description || undefined;
  const image = seo?.image || settings.defaultSeo.image;
  const images = image
    ? [{ url: image.src.startsWith("https://cdn.sanity.io") ? `${image.src}?w=1200&h=630&fit=crop` : image.src, width: 1200, height: 630, alt: image.alt }]
    : [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "CreatED Labs: Synthesise an Original Lab Prototype" }];
  return {
    title: { absolute: title as string },
    description,
    alternates: { canonical: path },
    robots: seo?.noIndex ? { index: false, follow: true } : undefined,
    openGraph: { title: title as string, description, url: path, siteName: settings.siteName, type: "website", locale: "en_IN", images },
    twitter: { card: "summary_large_image", title: title as string, description, images: images.map((i) => i.url) },
  };
}

export function programJsonLd(program: Program, settings: SiteSettings, url: string) {
  const faq = program.sections.find((s): s is FaqSection => s._type === "faqSection" && !s.hidden);
  const org = {
    "@type": "EducationalOrganization",
    "@id": `${settings.siteUrl}/#org`,
    name: "CreatED",
    url: settings.siteUrl,
    slogan: settings.tagline,
    email: settings.primaryEmail,
    logo: `${settings.siteUrl}/images/created-logo.png`,
  };
  const graph: Record<string, unknown>[] = [
    org,
    {
      "@type": "Course",
      "@id": `${url}#course`,
      name: program.title,
      description: program.summary,
      url,
      provider: { "@id": `${settings.siteUrl}/#org` },
      educationalLevel: "High school (Grades 8–12)",
      inLanguage: "en",
      hasCourseInstance: [
        {
          "@type": "CourseInstance",
          courseMode: "Blended",
          courseWorkload: "P10W",
          ...(program.startDate ? { startDate: program.startDate } : {}),
          ...(program.endDate ? { endDate: program.endDate } : {}),
          location: { "@type": "Place", name: "CreatED lab, Jaipur", address: { "@type": "PostalAddress", addressLocality: "Jaipur", addressCountry: "IN" } },
          ...(program.seats ? { maximumAttendeeCapacity: program.seats } : {}),
        },
      ],
      ...(program.fee?.show && program.fee.amount
        ? { offers: { "@type": "Offer", price: program.fee.amount, priceCurrency: program.fee.currency || "INR", category: "Paid" } }
        : {}),
    },
  ];
  if (faq?.items?.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: faq.items.map((q) => ({ "@type": "Question", name: q.question, acceptedAnswer: { "@type": "Answer", text: q.answer } })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}
