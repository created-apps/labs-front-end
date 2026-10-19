import type { Section } from "@/lib/types";
import type { SectionCtx } from "./context";
import { Hero } from "./Hero";
import { KeyDates } from "./KeyDates";
import { Glance } from "./Glance";
import { Audience } from "./Audience";
import { Apply } from "./Apply";
import { Roadmap } from "@/components/roadmap/Roadmap";
import { Outcomes } from "./Outcomes";
import { NextSteps } from "./NextSteps";
import { Faq } from "./Faq";
import { CtaBand } from "./CtaBand";
import { RichText, Video } from "./RichText";
import { Notebook } from "./Notebook";
import { Statement } from "./Statement";
import { Lab } from "./Lab";
import { Mentor } from "./Mentor";

// Maps each CMS section block to its component. Hidden sections never render.
export function SectionRenderer({ sections, ctx }: { sections: Section[]; ctx: Omit<SectionCtx, "first"> }) {
  const visible = sections.filter((s) => !s.hidden);
  return (
    <>
      {visible.map((s, i) => {
        const c = { ...ctx, first: i === 0 };
        switch (s._type) {
          case "heroSection":
            return <Hero key={s._key} s={s} ctx={c} />;
          case "keyDatesSection":
            return <KeyDates key={s._key} s={s} />;
          case "glanceSection":
            return <Glance key={s._key} s={s} />;
          case "audienceSection":
            return <Audience key={s._key} s={s} />;
          case "applySection":
            return <Apply key={s._key} s={s} ctx={c} />;
          case "roadmapSection":
            return s.milestones?.length ? <Roadmap key={s._key} s={s} /> : null;
          case "outcomesSection":
            return <Outcomes key={s._key} s={s} ctx={c} />;
          case "nextStepsSection":
            return <NextSteps key={s._key} s={s} />;
          case "faqSection":
            return <Faq key={s._key} s={s} email={ctx.settings.primaryEmail} />;
          case "ctaSection":
            return <CtaBand key={s._key} s={s} ctx={c} />;
          case "richTextSection":
            return <RichText key={s._key} s={s} />;
          case "videoSection":
            return s.video?.url ? <Video key={s._key} s={s} /> : null;
          case "notebookSection":
            return s.notes?.length ? <Notebook key={s._key} s={s} /> : null;
          case "statementSection":
            return <Statement key={s._key} s={s} />;
          case "labSection":
            return <Lab key={s._key} s={s} />;
          case "mentorSection":
            return <Mentor key={s._key} s={s} />;
          default:
            return null;
        }
      })}
    </>
  );
}

export function navFromSections(sections: Section[]) {
  return sections
    .filter((s) => !s.hidden && s.navLabel && s.anchorId)
    .map((s) => ({ href: `#${s.anchorId}`, label: s.navLabel as string }));
}
