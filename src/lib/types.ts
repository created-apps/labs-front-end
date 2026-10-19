// Shapes the frontend renders. Sanity queries and the local seed content both resolve to these.

export type Img = {
  src: string;
  alt: string;
  width: number;
  height: number;
  lqip?: string | null;
  caption?: string | null;
  /** Focal point from the CMS hotspot tool, 0–1 */
  focus?: { x: number; y: number } | null;
};

export type Seo = {
  title?: string | null;
  description?: string | null;
  image?: Img | null;
  noIndex?: boolean | null;
};

export type Cta = { label: string; kind: "apply" | "consult" | "brochure" | "custom"; href?: string | null };

export type SiteSettings = {
  siteName: string;
  tagline: string;
  siteUrl: string;
  applyUrl: string;
  consultationUrl?: string | null;
  primaryEmail: string;
  primaryPhone?: string | null;
  brochure?: { url: string; filename?: string | null } | null;
  gaMeasurementId?: string | null;
  searchConsoleVerification?: string | null;
  defaultSeo: Seo;
  footerNote?: string | null;
};

type SectionBase = { _key: string; hidden?: boolean | null; anchorId?: string | null; navLabel?: string | null };

export type HeroSection = SectionBase & {
  _type: "heroSection";
  announcement?: string | null;
  heading: string;
  kicker?: string | null;
  body: string;
  applyNote?: string | null;
  primaryCta: Cta;
  secondaryCta?: Cta | null;
};

// How the program is delivered: weekly online sessions, and the single in-person lab day
export type DeliveryFormat = {
  onlineTitle: string;
  sessions: { _key: string; label: string; title: string; body: string }[];
  labTitle: string;
  labStat?: string | null;
  labBody: string;
};

export type KeyDatesSection = SectionBase & {
  _type: "keyDatesSection";
  heading?: string | null;
  /** who can apply, shown prominently above the dates, e.g. "Students in Grades 9–12" */
  eligibility?: string | null;
  dates: { _key: string; label: string; value: string; detail?: string | null }[];
  note?: string | null;
  format?: DeliveryFormat | null;
};

export type GlanceItem = {
  _key: string;
  icon: "seats" | "calendar" | "mentor" | "flask" | "paper" | "trophy";
  stat: string;
  title: string;
  body: string;
};
export type GlanceSection = SectionBase & {
  _type: "glanceSection";
  eyebrow?: string | null;
  heading: string;
  items: GlanceItem[];
};


export type Clip = { src: string; poster?: string | null; alt: string };
export type Media = { _key: string; kind: "image"; img: Img } | { _key: string; kind: "video"; clip: Clip };

// "Program description": copy with an editorial arrangement of real photos and short clips
export type StatementSection = SectionBase & {
  _type: "statementSection";
  eyebrow?: string | null;
  statement?: string | null;
  body: string;
  media?: Media[] | null;
};

// Week 1–10 timeline: stages span a range of weeks; one may be the highlighted lab visit
export type LabStage = {
  _key: string;
  weekStart: number;
  weekEnd: number;
  title: string;
  detail: string;
  highlight?: boolean | null;
  /** vector illustration for the phase */
  art?: "question" | "method" | "paper" | null;
};
export type LabSection = SectionBase & {
  _type: "labSection";
  eyebrow?: string | null;
  heading: string;
  body: string;
  points?: string[] | null;
  totalWeeks?: number | null;
  stages: LabStage[];
  /** real footage shown before the photos in the media row */
  clips?: Clip[] | null;
  images?: Img[] | null;
};

export type MentorSection = SectionBase & {
  _type: "mentorSection";
  eyebrow?: string | null;
  heading: string;
  body: string;
  stats?: { _key: string; value: string; label: string }[] | null;
  /** real footage: the main clip, a second smaller clip and a photo, each with a one-word tag */
  clip?: Clip | null;
  clipTag?: string | null;
  clip2?: Clip | null;
  clip2Tag?: string | null;
  photo?: Img | null;
  photoTag?: string | null;
  stepsTitle?: string | null;
  steps?: { _key: string; label: string; title: string; body: string; art: "question" | "method" | "paper" }[] | null;
};

// Program deliverables: a checklist on the notebook sheet that comes off the hero workbench
export type NotebookSection = SectionBase & {
  _type: "notebookSection";
  eyebrow?: string | null;
  heading?: string | null;
  notes: {
    _key: string;
    qty?: string | null;
    title: string;
    body?: string | null;
    links?: { label: string; href: string; logo?: { src: string; width: number; height: number } | null }[] | null;
  }[];
};

export type AudienceSection = SectionBase & {
  _type: "audienceSection";
  eyebrow?: string | null;
  heading: string;
  intro: string;
  criteria: string[];
  reassuranceTitle?: string | null;
  reassurance?: string | null;
  image?: Img | null;
  photos?: Img[] | null;
};

export type ApplySection = SectionBase & {
  _type: "applySection";
  eyebrow?: string | null;
  heading: string;
  intro?: string | null;
  steps: { _key: string; title: string; body: string }[];
  ideationTitle?: string | null;
  ideationBody?: string | null;
  deadlineNote?: string | null;
  cta?: Cta | null;
  /** "After you apply": what the confirmation email covers */
  nextTitle?: string | null;
  nextIntro?: string | null;
  nextPoints?: string[] | null;
};

export type Milestone = {
  _key: string;
  weekStart: number;
  weekEnd: number;
  months: string;
  title: string;
  summary: string;
  activities: string[];
  accent: "blue" | "lime" | "flame" | "sun";
  image?: Img | null;
  photos?: Img[] | null;
};
export type RoadmapSection = SectionBase & {
  _type: "roadmapSection";
  eyebrow?: string | null;
  heading: string;
  intro?: string | null;
  /** shown above the tube: e.g. "Two Live Online Sessions Every Week + One In-Person Laboratory Visit" */
  formatTitle?: string | null;
  formatPoints?: { _key: string; label: string; text: string }[] | null;
  milestones: Milestone[];
};

export type OutcomesSection = SectionBase & {
  _type: "outcomesSection";
  eyebrow?: string | null;
  heading: string;
  bigLine?: string | null;
  items: {
    _key: string;
    title: string;
    body: string;
    links?: { label: string; href: string; logo?: { src: string; width: number; height: number } | null }[] | null;
  }[];
  showProjects?: boolean | null;
  showTestimonials?: boolean | null;
  showAchievements?: boolean | null;
};

export type NextStepsSection = SectionBase & {
  _type: "nextStepsSection";
  heading: string;
  intro?: string | null;
  points: string[];
};

export type FaqSection = SectionBase & {
  _type: "faqSection";
  eyebrow?: string | null;
  heading: string;
  items: { _key: string; question: string; answer: string }[];
  contactNote?: string | null;
  image?: Img | null;
};

export type CtaSection = SectionBase & {
  _type: "ctaSection";
  heading: string;
  body?: string | null;
  primaryCta: Cta;
  secondaryCta?: Cta | null;
  showBrochure?: boolean | null;
  images?: Img[] | null;
};

export type RichTextSection = SectionBase & {
  _type: "richTextSection";
  heading?: string | null;
  paragraphs: string[];
};

export type VideoSection = SectionBase & {
  _type: "videoSection";
  heading?: string | null;
  caption?: string | null;
  video: { url: string; mimeType?: string | null };
  poster?: Img | null;
};

export type Section =
  | HeroSection
  | KeyDatesSection
  | GlanceSection
  | AudienceSection
  | ApplySection
  | RoadmapSection
  | OutcomesSection
  | NextStepsSection
  | FaqSection
  | CtaSection
  | RichTextSection
  | VideoSection
  | StatementSection
  | LabSection
  | MentorSection
  | NotebookSection;

export type Program = {
  _id: string;
  title: string;
  slug: string;
  isHome?: boolean | null;
  summary: string;
  startDate?: string | null;
  endDate?: string | null;
  seats?: number | null;
  fee?: { amount?: number | null; currency?: string | null; note?: string | null; show?: boolean | null } | null;
  seo?: Seo | null;
  sections: Section[];
  updatedAt?: string | null;
};

export type ProjectSummary = {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  cover?: Img | null;
  year?: string | null;
};

export type Project = ProjectSummary & {
  students?: string | null;
  body: string[];
  gallery?: Img[] | null;
  paperUrl?: string | null;
  awards?: string[] | null;
  seo?: Seo | null;
  updatedAt?: string | null;
};

export type Testimonial = { _id: string; quote: string; name: string; role?: string | null };
export type Achievement = { _id: string; title: string; detail?: string | null; year?: string | null };

export type Extras = { projects: ProjectSummary[]; testimonials: Testimonial[]; achievements: Achievement[] };
