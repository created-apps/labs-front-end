import { defineArrayMember, defineField, defineType } from "sanity";

export const figure = defineType({
  name: "figure",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description: "Describe what the photo shows for screen readers and search engines. Don't name students unless they have consented.",
      validation: (r) => r.required().max(140),
    }),
    defineField({ name: "caption", type: "string", validation: (r) => r.max(140) }),
  ],
});

export const seo = defineType({
  name: "seo",
  title: "Search & sharing",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "title", title: "Page title", type: "string", description: "Shown in Google results and browser tabs. Aim for 50–60 characters.", validation: (r) => r.max(70).warning("Long titles are cut off in search results") }),
    defineField({ name: "description", title: "Meta description", type: "text", rows: 3, description: "Aim for 140–160 characters.", validation: (r) => r.max(170).warning("Long descriptions are cut off in search results") }),
    defineField({ name: "image", title: "Social sharing image", type: "figure", description: "1200 × 630 px works best." }),
    defineField({ name: "noIndex", title: "Hide from search engines", type: "boolean", initialValue: false }),
  ],
});

export const cta = defineType({
  name: "cta",
  title: "Button",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (r) => r.required().max(28) }),
    defineField({
      name: "kind",
      title: "Goes to",
      type: "string",
      options: {
        list: [
          { title: "Application form (from Site settings)", value: "apply" },
          { title: "Book a consultation (from Site settings)", value: "consult" },
          { title: "Brochure download", value: "brochure" },
          { title: "Custom link", value: "custom" },
        ],
        layout: "radio",
      },
      initialValue: "apply",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "href",
      title: "Custom link",
      type: "url",
      hidden: ({ parent }) => parent?.kind !== "custom",
      validation: (r) => r.uri({ allowRelative: true, scheme: ["https", "http", "mailto"] }),
    }),
  ],
  preview: { select: { title: "label", subtitle: "kind" } },
});

/* ---------- shared section fields ---------- */
const sectionBase = [
  defineField({ name: "hidden", title: "Hide this section", type: "boolean", initialValue: false, description: "Hidden sections stay saved but don't appear on the site." }),
  defineField({ name: "navLabel", title: "Menu label", type: "string", description: "Fill this in to add the section to the top menu.", group: "advanced", validation: (r) => r.max(16) }),
  defineField({ name: "anchorId", title: "Link anchor", type: "slug", description: "Lets you link straight to this section, e.g. #faq.", group: "advanced" }),
];
const groups = [{ name: "content", title: "Content", default: true }, { name: "advanced", title: "Menu & anchor" }];
const eyebrow = defineField({ name: "eyebrow", title: "Small label above heading", type: "string", group: "content", validation: (r) => r.max(40) });
const heading = (max = 70) => defineField({ name: "heading", type: "string", group: "content", validation: (r) => r.required().max(max) });
const preview = (title: string) => ({
  select: { heading: "heading", hidden: "hidden" },
  prepare: ({ heading, hidden }: { heading?: string; hidden?: boolean }) => ({
    title: heading || title,
    subtitle: `${title}${hidden ? " · hidden" : ""}`,
  }),
});

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero (3D desk)",
  type: "object",
  groups,
  fields: [
    defineField({ name: "announcement", type: "string", group: "content", validation: (r) => r.max(70) }),
    heading(60),
    defineField({ name: "kicker", title: "Line under heading", type: "string", group: "content", validation: (r) => r.max(90) }),
    defineField({ name: "body", type: "text", rows: 4, group: "content", validation: (r) => r.required().max(420) }),
    defineField({ name: "applyNote", title: "Small note under buttons", type: "string", group: "content", validation: (r) => r.max(60) }),
    defineField({ name: "primaryCta", title: "Main button", type: "cta", group: "content", validation: (r) => r.required() }),
    defineField({ name: "secondaryCta", title: "Second button", type: "cta", group: "content" }),
    ...sectionBase,
  ],
  preview: preview("Hero"),
});

export const keyDatesSection = defineType({
  name: "keyDatesSection",
  title: "Key dates",
  type: "object",
  groups,
  fields: [
    defineField({ name: "heading", type: "string", group: "content" }),
    defineField({ name: "eligibility", title: "Who can apply", type: "string", group: "content", description: "Shown prominently above the dates, e.g. Students in Grades 9–12", validation: (r) => r.max(60) }),
    defineField({
      name: "dates",
      type: "array",
      group: "content",
      validation: (r) => r.min(1).max(5),
      of: [
        defineArrayMember({
          type: "object",
          name: "dateItem",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required().max(30) }),
            defineField({ name: "value", title: "Date", type: "string", validation: (r) => r.required().max(30) }),
            defineField({ name: "detail", type: "string", validation: (r) => r.max(40) }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        }),
      ],
    }),
    defineField({ name: "note", type: "text", rows: 2, group: "content", validation: (r) => r.max(220) }),
    defineField({
      name: "format",
      title: "How the program runs (online sessions + lab visit)",
      type: "object",
      group: "content",
      fields: [
        defineField({ name: "onlineTitle", title: "Online heading", type: "string", validation: (r) => r.required().max(50) }),
        defineField({
          name: "sessions",
          type: "array",
          validation: (r) => r.max(3),
          of: [
            defineArrayMember({
              type: "object",
              name: "session",
              fields: [
                defineField({ name: "label", type: "string", description: "e.g. Session 1", validation: (r) => r.required().max(20) }),
                defineField({ name: "title", type: "string", validation: (r) => r.required().max(40) }),
                defineField({ name: "body", type: "text", rows: 2, validation: (r) => r.required().max(160) }),
              ],
              preview: { select: { title: "title", subtitle: "label" } },
            }),
          ],
        }),
        defineField({ name: "labTitle", title: "Lab heading", type: "string", validation: (r) => r.required().max(40) }),
        defineField({ name: "labStat", title: "Lab highlight", type: "string", description: "e.g. 1 day · Jaipur", validation: (r) => r.max(24) }),
        defineField({ name: "labBody", title: "Lab text", type: "text", rows: 3, validation: (r) => r.required().max(220) }),
      ],
    }),
    ...sectionBase,
  ],
  preview: preview("Key dates"),
});

export const glanceSection = defineType({
  name: "glanceSection",
  title: "At a glance (fan of fact cards)",
  type: "object",
  groups,
  fields: [
    eyebrow,
    heading(),
    defineField({
      name: "items",
      type: "array",
      group: "content",
      validation: (r) => r.min(3).max(8),
      of: [
        defineArrayMember({
          type: "object",
          name: "glanceItem",
          fields: [
            defineField({
              name: "icon",
              type: "string",
              options: { list: ["seats", "calendar", "mentor", "flask", "paper", "trophy"] },
              validation: (r) => r.required(),
            }),
            defineField({ name: "stat", title: "Big figure", type: "string", validation: (r) => r.required().max(8) }),
            defineField({ name: "title", type: "string", validation: (r) => r.required().max(36) }),
            defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required().max(200) }),
          ],
          preview: { select: { title: "title", subtitle: "stat" } },
        }),
      ],
    }),
    ...sectionBase,
  ],
  preview: preview("At a glance"),
});


export const audienceSection = defineType({
  name: "audienceSection",
  title: "Who it's for",
  type: "object",
  groups,
  fields: [
    eyebrow,
    heading(),
    defineField({ name: "intro", type: "text", rows: 3, group: "content", validation: (r) => r.required() }),
    defineField({ name: "criteria", type: "array", group: "content", of: [defineArrayMember({ type: "string" })], validation: (r) => r.min(2).max(6) }),
    defineField({ name: "reassuranceTitle", type: "string", group: "content" }),
    defineField({ name: "reassurance", type: "text", rows: 3, group: "content" }),
    defineField({ name: "photos", title: "Photo deck (fans out under the heading)", type: "array", group: "content", of: [defineArrayMember({ type: "figure" })], options: { layout: "grid" }, validation: (r) => r.max(8) }),
    ...sectionBase,
  ],
  preview: preview("Who it's for"),
});

export const applySection = defineType({
  name: "applySection",
  title: "Application steps & ideation",
  type: "object",
  groups,
  fields: [
    eyebrow,
    heading(),
    defineField({ name: "intro", type: "text", rows: 2, group: "content" }),
    defineField({
      name: "steps",
      type: "array",
      group: "content",
      validation: (r) => r.min(1).max(5),
      of: [
        defineArrayMember({
          type: "object",
          name: "step",
          fields: [
            defineField({ name: "title", type: "string", validation: (r) => r.required().max(50) }),
            defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required().max(240) }),
          ],
        }),
      ],
    }),
    defineField({ name: "ideationTitle", title: "Pre-program ideation title", type: "string", group: "content" }),
    defineField({ name: "ideationBody", title: "Pre-program ideation text", type: "text", rows: 3, group: "content" }),
    defineField({ name: "deadlineNote", type: "text", rows: 2, group: "content" }),
    defineField({ name: "cta", title: "Button", type: "cta", group: "content" }),
    defineField({ name: "nextTitle", title: "After you apply: heading", type: "string", group: "content" }),
    defineField({ name: "nextIntro", title: "After you apply: intro", type: "string", group: "content" }),
    defineField({ name: "nextPoints", title: "After you apply: points", type: "array", group: "content", of: [defineArrayMember({ type: "string" })] }),
    ...sectionBase,
  ],
  preview: preview("Application steps"),
});

export const roadmapSection = defineType({
  name: "roadmapSection",
  title: "Roadmap (capillary tube)",
  type: "object",
  groups,
  fields: [
    eyebrow,
    heading(),
    defineField({ name: "intro", type: "text", rows: 2, group: "content" }),
    defineField({ name: "formatTitle", title: "Delivery summary heading", type: "string", group: "content", validation: (r) => r.max(90) }),
    defineField({
      name: "formatPoints",
      title: "Delivery summary points",
      type: "array",
      group: "content",
      validation: (r) => r.max(5),
      of: [
        defineArrayMember({
          type: "object",
          name: "formatPoint",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required().max(30) }),
            defineField({ name: "text", type: "string", validation: (r) => r.required().max(120) }),
          ],
          preview: { select: { title: "label", subtitle: "text" } },
        }),
      ],
    }),
    defineField({
      name: "milestones",
      type: "array",
      group: "content",
      description: "The tube's measurement marks follow these automatically. Add a photo to one phase to give the tube its bend.",
      validation: (r) => r.min(2).max(5),
      of: [
        defineArrayMember({
          type: "object",
          name: "milestone",
          fields: [
            defineField({ name: "weekStart", title: "From week", type: "number", validation: (r) => r.required().min(0).max(52) }),
            defineField({ name: "weekEnd", title: "To week", type: "number", validation: (r) => r.required().min(0).max(52) }),
            defineField({ name: "months", type: "string", validation: (r) => r.max(30) }),
            defineField({ name: "title", type: "string", validation: (r) => r.required().max(50) }),
            defineField({ name: "summary", type: "string", validation: (r) => r.required().max(90) }),
            defineField({ name: "activities", type: "array", of: [defineArrayMember({ type: "string" })], validation: (r) => r.max(6) }),
            defineField({
              name: "accent",
              title: "Phase colour",
              type: "string",
              options: { list: [{ title: "Cornflower blue", value: "blue" }, { title: "Lemon lime", value: "lime" }, { title: "Flame", value: "flame" }, { title: "Sunglow", value: "sun" }], layout: "radio", direction: "horizontal" },
              initialValue: "blue",
            }),
            defineField({ name: "image", title: "Photo the tube bends around (optional)", type: "figure" }),
            defineField({ name: "photos", title: "Extra photos (up to 2)", type: "array", of: [defineArrayMember({ type: "figure" })], validation: (r) => r.max(2) }),
          ],
          preview: {
            select: { title: "title", a: "weekStart", b: "weekEnd", media: "image" },
            prepare: ({ title, a, b, media }) => ({ title, subtitle: `Weeks ${a}–${b}`, media }),
          },
        }),
      ],
    }),
    ...sectionBase,
  ],
  preview: preview("Roadmap"),
});

export const outcomesSection = defineType({
  name: "outcomesSection",
  title: "Outcomes",
  type: "object",
  groups,
  fields: [
    eyebrow,
    heading(),
    defineField({ name: "bigLine", title: "Giant line", type: "string", group: "content", description: "Large statement above the outcomes.", validation: (r) => r.max(40) }),
    defineField({
      name: "items",
      type: "array",
      group: "content",
      validation: (r) => r.min(1).max(4),
      of: [
        defineArrayMember({
          type: "object",
          name: "outcome",
          fields: [
            defineField({ name: "title", type: "string", validation: (r) => r.required().max(40) }),
            defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required().max(300) }),
            defineField({
              name: "links",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "link",
                  fields: [
                    defineField({ name: "label", type: "string", description: "Also the logo's accessible name" }),
                    defineField({ name: "href", type: "url" }),
                    defineField({ name: "logo", title: "Official logo (optional)", type: "image", description: "Use the organisation's own logo file; it's shown at its original proportions." }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({ name: "showProjects", title: "Show published student projects", type: "boolean", initialValue: true, group: "content", description: "Only appears once at least one project is published." }),
    defineField({ name: "showAchievements", title: "Show achievements", type: "boolean", initialValue: true, group: "content" }),
    defineField({ name: "showTestimonials", title: "Show testimonials", type: "boolean", initialValue: true, group: "content" }),
    ...sectionBase,
  ],
  preview: preview("Outcomes"),
});

export const nextStepsSection = defineType({
  name: "nextStepsSection",
  title: "Next steps",
  type: "object",
  groups,
  fields: [
    heading(),
    defineField({ name: "intro", type: "string", group: "content" }),
    defineField({ name: "points", type: "array", group: "content", of: [defineArrayMember({ type: "string" })] }),
    ...sectionBase,
  ],
  preview: preview("Next steps"),
});

export const faqSection = defineType({
  name: "faqSection",
  title: "FAQ",
  type: "object",
  groups,
  fields: [
    eyebrow,
    heading(),
    defineField({
      name: "items",
      title: "Questions",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          name: "faqItem",
          fields: [
            defineField({ name: "question", type: "string", validation: (r) => r.required().max(120) }),
            defineField({ name: "answer", type: "text", rows: 4, validation: (r) => r.required().max(700) }),
          ],
          preview: { select: { title: "question" } },
        }),
      ],
    }),
    defineField({ name: "contactNote", type: "string", group: "content" }),
    defineField({ name: "image", type: "figure", group: "content" }),
    ...sectionBase,
  ],
  preview: preview("FAQ"),
});

export const ctaSection = defineType({
  name: "ctaSection",
  title: "Call-to-action band",
  type: "object",
  groups,
  fields: [
    heading(80),
    defineField({ name: "body", type: "text", rows: 2, group: "content" }),
    defineField({ name: "primaryCta", title: "Main button", type: "cta", group: "content", validation: (r) => r.required() }),
    defineField({ name: "secondaryCta", title: "Second button", type: "cta", group: "content" }),
    defineField({ name: "showBrochure", title: "Show brochure download (if uploaded)", type: "boolean", initialValue: true, group: "content" }),
    defineField({ name: "images", title: "Banner photos (slideshow)", type: "array", group: "content", of: [defineArrayMember({ type: "figure" })], options: { layout: "grid" }, validation: (r) => r.max(6) }),
    ...sectionBase,
  ],
  preview: preview("Call to action"),
});

export const richTextSection = defineType({
  name: "richTextSection",
  title: "Text block",
  type: "object",
  groups,
  fields: [
    defineField({ name: "heading", type: "string", group: "content" }),
    defineField({ name: "paragraphs", type: "array", group: "content", of: [defineArrayMember({ type: "text", rows: 4 })] }),
    ...sectionBase,
  ],
  preview: preview("Text block"),
});

export const videoSection = defineType({
  name: "videoSection",
  title: "Video",
  type: "object",
  groups,
  fields: [
    defineField({ name: "heading", type: "string", group: "content" }),
    defineField({ name: "video", type: "file", group: "content", options: { accept: "video/mp4,video/webm" }, description: "MP4, under 20 MB. Plays muted and only when tapped.", validation: (r) => r.required() }),
    defineField({ name: "poster", title: "Cover image", type: "figure", group: "content" }),
    defineField({ name: "caption", type: "string", group: "content" }),
    ...sectionBase,
  ],
  preview: preview("Video"),
});






export const videoClip = defineType({
  name: "videoClip",
  title: "Video clip",
  type: "object",
  fields: [
    defineField({ name: "file", title: "Video (MP4, under 2 MB, muted)", type: "file", options: { accept: "video/mp4" }, validation: (r) => r.required() }),
    defineField({ name: "poster", title: "Still frame", type: "image" }),
    defineField({ name: "alt", title: "What the clip shows", type: "string", validation: (r) => r.max(140) }),
  ],
  preview: { select: { title: "alt" }, prepare: ({ title }) => ({ title: title || "Video clip" }) },
});

export const notebookSection = defineType({
  name: "notebookSection",
  title: "Program deliverables (notebook checklist)",
  type: "object",
  groups,
  fields: [
    defineField({ ...eyebrow, title: "Heading", description: "Shown as the page's title, e.g. Program Deliverables." }),
    defineField({ name: "heading", title: "Line under the heading (optional)", type: "string", group: "content", validation: (r) => r.max(80) }),
    defineField({
      name: "notes",
      title: "Checklist",
      type: "array",
      group: "content",
      validation: (r) => r.min(2).max(5),
      of: [
        defineArrayMember({
          type: "object",
          name: "note",
          fields: [
            defineField({ name: "qty", title: "Number (circled)", type: "string", validation: (r) => r.max(4) }),
            defineField({ name: "title", type: "string", validation: (r) => r.required().max(40) }),
            defineField({ name: "body", title: "Description", type: "text", rows: 3, validation: (r) => r.max(200) }),
            defineField({
              name: "links",
              title: "Links (e.g. competition logos)",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "link",
                  fields: [
                    defineField({ name: "label", type: "string", description: "Also the logo's accessible name" }),
                    defineField({ name: "href", type: "url" }),
                    defineField({ name: "logo", title: "Official logo", type: "image" }),
                  ],
                }),
              ],
            }),
          ],
          preview: { select: { title: "title", subtitle: "qty" } },
        }),
      ],
    }),
    ...sectionBase,
  ],
  preview: preview("Program deliverables"),
});

export const statementSection = defineType({
  name: "statementSection",
  title: "Program description (photos & clips)",
  type: "object",
  groups,
  fields: [
    eyebrow,
    defineField({ name: "statement", title: "Headline (optional)", type: "string", group: "content", validation: (r) => r.max(60) }),
    defineField({ name: "body", type: "text", rows: 5, group: "content", validation: (r) => r.required().max(480) }),
    defineField({
      name: "media",
      title: "Photos and clips (4 work best)",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "figure" }), defineArrayMember({ type: "videoClip" })],
      validation: (r) => r.max(4),
    }),
    ...sectionBase,
  ],
  preview: preview("Program description"),
});

export const labSection = defineType({
  name: "labSection",
  title: "Laboratory experience (Week 1–10 track)",
  type: "object",
  groups,
  fields: [
    eyebrow,
    heading(60),
    defineField({ name: "body", type: "text", rows: 4, group: "content", validation: (r) => r.required().max(400) }),
    defineField({ name: "points", title: "Tags", type: "array", group: "content", of: [defineArrayMember({ type: "string" })], validation: (r) => r.max(4) }),
    defineField({ name: "totalWeeks", title: "Number of weeks", type: "number", group: "content", initialValue: 10, validation: (r) => r.min(4).max(16) }),
    defineField({
      name: "stages",
      type: "array",
      group: "content",
      validation: (r) => r.min(1).max(5),
      of: [
        defineArrayMember({
          type: "object",
          name: "labStage",
          fields: [
            defineField({ name: "weekStart", title: "From week", type: "number", validation: (r) => r.required().min(1) }),
            defineField({ name: "weekEnd", title: "To week", type: "number", validation: (r) => r.required().min(1) }),
            defineField({ name: "title", type: "string", validation: (r) => r.required().max(40) }),
            defineField({ name: "detail", type: "text", rows: 3, validation: (r) => r.required().max(220) }),
            defineField({ name: "highlight", title: "Highlight (e.g. the lab visit)", type: "boolean", initialValue: false }),
            defineField({
              name: "art",
              title: "Illustration",
              type: "string",
              options: { list: [{ title: "Question (journal and magnifier)", value: "question" }, { title: "Method (beaker, pipette, flask)", value: "method" }, { title: "Paper (chart into paper)", value: "paper" }] },
            }),
          ],
          preview: { select: { title: "title", a: "weekStart", b: "weekEnd" }, prepare: ({ title, a, b }) => ({ title, subtitle: `Weeks ${a}–${b}` }) },
        }),
      ],
    }),
    defineField({ name: "clips", title: "Clips (shown first in the media row)", type: "array", group: "content", of: [defineArrayMember({ type: "videoClip" })], validation: (r) => r.max(2) }),
    defineField({ name: "images", title: "Photos", type: "array", group: "content", of: [defineArrayMember({ type: "figure" })], options: { layout: "grid" }, validation: (r) => r.max(4) }),
    ...sectionBase,
  ],
  preview: preview("Laboratory experience"),
});

export const mentorSection = defineType({
  name: "mentorSection",
  title: "Mentorship (video)",
  type: "object",
  groups,
  fields: [
    eyebrow,
    heading(40),
    defineField({ name: "body", type: "text", rows: 4, group: "content", validation: (r) => r.required().max(360) }),
    defineField({
      name: "stats",
      type: "array",
      group: "content",
      validation: (r) => r.max(3),
      of: [
        defineArrayMember({
          type: "object",
          name: "stat",
          fields: [
            defineField({ name: "value", type: "string", validation: (r) => r.required().max(6) }),
            defineField({ name: "label", type: "string", validation: (r) => r.required().max(24) }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
    }),
    defineField({ name: "clip", title: "Main clip (real footage)", type: "videoClip", group: "content" }),
    defineField({ name: "clipTag", title: "Main clip tag", type: "string", group: "content", description: "One word for what it shows, e.g. Measure", validation: (r) => r.max(20) }),
    defineField({ name: "clip2", title: "Second clip", type: "videoClip", group: "content" }),
    defineField({ name: "clip2Tag", title: "Second clip tag", type: "string", group: "content", validation: (r) => r.max(20) }),
    defineField({ name: "photo", title: "Photo", type: "figure", group: "content" }),
    defineField({ name: "photoTag", title: "Photo tag", type: "string", group: "content", validation: (r) => r.max(20) }),
    defineField({ name: "stepsTitle", title: "Stages heading", type: "string", group: "content", validation: (r) => r.max(60) }),
    defineField({
      name: "steps",
      title: "Mentorship stages",
      type: "array",
      group: "content",
      validation: (r) => r.max(3),
      of: [
        defineArrayMember({
          type: "object",
          name: "mentorStep",
          fields: [
            defineField({ name: "label", type: "string", description: "e.g. Weeks 1–4", validation: (r) => r.required().max(20) }),
            defineField({ name: "title", type: "string", validation: (r) => r.required().max(40) }),
            defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required().max(180) }),
            defineField({
              name: "art",
              title: "Illustration",
              type: "string",
              options: { list: [{ title: "Question (journal and magnifier)", value: "question" }, { title: "Method (beaker, pipette, flask)", value: "method" }, { title: "Paper (chart into paper)", value: "paper" }] },
              initialValue: "question",
            }),
          ],
          preview: { select: { title: "title", subtitle: "label" } },
        }),
      ],
    }),
    ...sectionBase,
  ],
  preview: preview("Mentorship"),
});

export const sectionTypes = [
  "heroSection",
  "keyDatesSection",
  "glanceSection",
  "audienceSection",
  "applySection",
  "roadmapSection",
  "outcomesSection",
  "nextStepsSection",
  "faqSection",
  "ctaSection",
  "richTextSection",
  "videoSection",
  "statementSection",
  "labSection",
  "mentorSection",
  "notebookSection",
];
