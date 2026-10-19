import { defineArrayMember, defineField, defineType } from "sanity";
import { sectionTypes } from "./objects";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "links", title: "Buttons & contact", default: true },
    { name: "seo", title: "Search & analytics" },
    { name: "general", title: "General" },
  ],
  fields: [
    defineField({ name: "siteName", type: "string", group: "general", validation: (r) => r.required() }),
    defineField({ name: "tagline", type: "string", group: "general" }),
    defineField({ name: "siteUrl", title: "Website address", type: "url", group: "general", description: "e.g. https://labs.create-ed.in", validation: (r) => r.required() }),
    defineField({ name: "applyUrl", title: "Application form link", type: "url", group: "links", description: "Every 'Apply Now' button uses this link.", validation: (r) => r.required() }),
    defineField({ name: "consultationUrl", title: "Book a consultation link", type: "url", group: "links", description: "Your Calendly link. If empty, consultation buttons open an email to the address below." }),
    defineField({ name: "primaryEmail", title: "Contact email", type: "string", group: "links", validation: (r) => r.required().email() }),
    defineField({ name: "brochure", title: "Brochure (PDF)", type: "file", group: "links", options: { accept: "application/pdf" } }),
    defineField({ name: "footerNote", type: "string", group: "general" }),
    defineField({ name: "defaultSeo", title: "Default search & sharing", type: "seo", group: "seo" }),
    defineField({ name: "gaMeasurementId", title: "Google Analytics 4 ID", type: "string", group: "seo", description: "Looks like G-XXXXXXXXXX.", validation: (r) => r.regex(/^G-[A-Z0-9]+$/, { name: "GA4 ID" }) }),
    defineField({ name: "searchConsoleVerification", title: "Google Search Console verification code", type: "string", group: "seo", description: "Only the content=\"…\" value from the HTML tag method." }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});

export const program = defineType({
  name: "program",
  title: "Program page",
  type: "document",
  groups: [
    { name: "page", title: "Page sections", default: true },
    { name: "details", title: "Program details" },
    { name: "seo", title: "Search & sharing" },
  ],
  fields: [
    defineField({ name: "title", type: "string", group: "details", validation: (r) => r.required().max(60) }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      group: "details",
      options: { source: "title", maxLength: 60 },
      description: "The page lives at /programs/your-slug.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "isHome", title: "Use as the home page", type: "boolean", group: "details", initialValue: false, description: "Only one program should have this switched on." }),
    defineField({ name: "summary", type: "text", rows: 3, group: "details", description: "Used in search results and structured data.", validation: (r) => r.required().max(300) }),
    defineField({ name: "startDate", type: "date", group: "details" }),
    defineField({ name: "endDate", type: "date", group: "details" }),
    defineField({ name: "seats", type: "number", group: "details" }),
    defineField({
      name: "fee",
      title: "Program fee",
      type: "object",
      group: "details",
      fields: [
        defineField({ name: "show", title: "Show fee on the page", type: "boolean", initialValue: false }),
        defineField({ name: "amount", type: "number" }),
        defineField({ name: "currency", type: "string", initialValue: "INR", options: { list: ["INR", "USD"] } }),
        defineField({ name: "note", title: "Note (shown when fee is hidden, or below the fee)", type: "string" }),
      ],
    }),
    defineField({
      name: "sections",
      title: "Page sections",
      type: "array",
      group: "page",
      description: "Drag to reorder. Use the ⋯ menu to duplicate or remove. Switch on 'Hide this section' to take a section off the page without deleting it.",
      of: sectionTypes.map((type) => defineArrayMember({ type })),
    }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "title", slug: "slug.current", isHome: "isHome" },
    prepare: ({ title, slug, isHome }) => ({ title, subtitle: isHome ? "Home page" : `/programs/${slug ?? ""}` }),
  },
});

export const project = defineType({
  name: "project",
  title: "Student project",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required().max(90) }),
    defineField({ name: "slug", title: "Web address", type: "slug", options: { source: "title", maxLength: 80 }, validation: (r) => r.required() }),
    defineField({ name: "year", type: "string" }),
    defineField({ name: "summary", type: "text", rows: 3, validation: (r) => r.required().max(260) }),
    defineField({
      name: "students",
      title: "Student names",
      type: "string",
      description: "Only add names when the students and their parents have agreed to publication.",
    }),
    defineField({
      name: "consent",
      title: "Students and parents have consented to this page being published",
      type: "boolean",
      initialValue: false,
      validation: (r) => r.custom((v) => (v ? true : "Consent is required before publishing a student project")),
    }),
    defineField({ name: "cover", title: "Cover photo", type: "figure", validation: (r) => r.required() }),
    defineField({ name: "body", title: "Project description", type: "array", of: [defineArrayMember({ type: "text", rows: 5 })] }),
    defineField({ name: "gallery", type: "array", of: [defineArrayMember({ type: "figure" })], options: { layout: "grid" } }),
    defineField({ name: "paperUrl", title: "Link to published paper", type: "url" }),
    defineField({ name: "awards", type: "array", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "program", type: "reference", to: [{ type: "program" }] }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: { select: { title: "title", subtitle: "year", media: "cover" } },
});

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "quote", type: "text", rows: 4, validation: (r) => r.required().max(400) }),
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", title: "Role (e.g. Parent, Cohort 1 student)", type: "string" }),
    defineField({
      name: "consent",
      title: "This person agreed to be quoted on the website",
      type: "boolean",
      initialValue: false,
      validation: (r) => r.custom((v) => (v ? true : "Consent is required before publishing a testimonial")),
    }),
    defineField({ name: "order", type: "number", hidden: true }),
  ],
  orderings: [{ title: "Manual order", name: "manual", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "quote" } },
});

export const achievement = defineType({
  name: "achievement",
  title: "Achievement",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", description: "e.g. CREST Gold Award", validation: (r) => r.required() }),
    defineField({ name: "detail", type: "string", description: "What was achieved, and by which project (no student names without consent)." }),
    defineField({ name: "year", type: "string" }),
    defineField({ name: "order", type: "number", hidden: true }),
  ],
  preview: { select: { title: "title", subtitle: "detail" } },
});

export const redirect = defineType({
  name: "redirect",
  title: "Redirect",
  type: "document",
  fields: [
    defineField({ name: "from", type: "string", description: "Old path, e.g. /summer-lab", validation: (r) => r.required().regex(/^\/[^\s]*$/, { name: "path starting with /" }) }),
    defineField({ name: "to", type: "string", description: "New path or full URL", validation: (r) => r.required() }),
    defineField({ name: "permanent", type: "boolean", initialValue: true }),
  ],
  preview: { select: { title: "from", subtitle: "to" } },
});
