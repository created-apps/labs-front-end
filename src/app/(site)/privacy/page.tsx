import type { Metadata } from "next";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: { absolute: "Privacy & cookies | CreatED Labs" },
  description: "How the CreatED Labs website uses analytics cookies and handles enquiries.",
  alternates: { canonical: "/privacy" },
};

export default async function PrivacyPage() {
  const s = await getSettings();
  return (
    <section className="section page-top">
      <div className="container prose">
        <p className="eyebrow">Privacy</p>
        <h1>Privacy &amp; cookies</h1>
        <p>This website doesn&apos;t ask you to create an account and doesn&apos;t sell or share personal data.</p>
        <h2>Analytics</h2>
        <p>
          If you accept analytics cookies, we use Google Analytics 4 to count visits and clicks on buttons such as Apply Now,
          Book a Consultation and brochure downloads. This helps us improve the page for families. If you decline, no
          analytics scripts are loaded. You can change your choice by clearing this site&apos;s data in your browser.
        </p>
        <h2>Applications and enquiries</h2>
        <p>
          Applications are submitted through Google Forms and consultations are booked through our scheduling tool. Their
          own privacy policies apply to the information you enter there.
        </p>
        <h2>Photographs</h2>
        <p>Photos on this site show students from previous CreatED Labs cohorts. To ask for a photo to be removed, email us.</p>
        <h2>Contact</h2>
        <p>
          Questions about your data: <a href={`mailto:${s.primaryEmail}`}>{s.primaryEmail}</a>
        </p>
      </div>
    </section>
  );
}
