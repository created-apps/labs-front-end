// Launch content from "CreatED Lab launch document.md".
// Used when no Sanity project is connected, and imported into Sanity by scripts/seed-sanity.ts.
import type { Extras, Program, SiteSettings } from "@/lib/types";
import { labImages as L } from "./images";

export const APPLY_URL = "https://forms.gle/ppFQpxY1aHbJ3J8x7";

export const seedSettings: SiteSettings = {
  siteName: "CreatED Labs",
  tagline: "Inspiring the Innovators of Tomorrow",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://labs.create-ed.in",
  applyUrl: APPLY_URL,
  // Replace with the Calendly link in Site settings. Until then consultations go to email.
  consultationUrl: null,
  primaryEmail: "labs@create-ed.in",
  brochure: null,
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_ID || null,
  searchConsoleVerification: null,
  defaultSeo: {
    title: "CreatED Labs: 10-week wet lab research program for high school students",
    description:
      "Build an original wet lab prototype, publish a research paper and compete at CREST Gold and IRIS. 10 weeks, 2:1 IIT PhD mentorship, a one-day lab visit in Jaipur. 16 spots per cohort.",
  },
  footerNote: "CreatED Labs is a program by CreatED.",
};

export const seedProgram: Program = {
  _id: "program-created-labs",
  title: "CreatED Labs",
  slug: "created-labs",
  isHome: true,
  summary:
    "A selective 10-week research and innovation program where high school students synthesise a wet lab prototype, publish a research paper and compete in two global competitions.",
  startDate: "2027-06-12",
  endDate: "2027-09-12",
  seats: 16,
  fee: { amount: null, currency: "INR", note: "Fees are shared during your consultation.", show: false },
  seo: {
    title: "CreatED Labs: Synthesise an Original Lab Prototype",
    description:
      "A selective 10-week wet lab research program for high school students in chemical engineering, biotechnology and materials science. 2:1 IIT PhD mentorship, a one-day Jaipur lab visit, a published paper.",
  },
  sections: [
    {
      _type: "heroSection",
      _key: "hero",
      announcement: "Applications open September 15 · Only 16 spots per cohort",
      heading: "Synthesise an Original Lab Prototype.",
      kicker: "Publish a Research Paper · Build an Original Wet Lab Prototype · Apply to Two Competitions",
      body: "A selective, 10-week research and innovation program. Students work in pairs with a dedicated IIT PhD mentor in Chemical Engineering, Biotechnology or Materials Science. Through guided research, experimentation and hands-on lab testing, students take an idea, synthesise a prototype and publish a research paper.",
      applyNote: "Apply individually or in teams of two.",
      primaryCta: { label: "Apply Now", kind: "apply" },
      secondaryCta: { label: "Book a Consultation", kind: "consult" },
    },
    {
      _type: "notebookSection",
      _key: "notebook",
      eyebrow: "Program Deliverables",
      heading: "Build it. Publish it. Compete with it.",
      notes: [
        { _key: "n1", qty: "1", title: "Original Wet Lab Prototype", body: "An original experimental prototype, developed through scientific design and tested by hand in the Jaipur lab." },
        { _key: "n2", qty: "1", title: "Published Research Paper", body: "An original research manuscript, written with the aim of journal publication. Acceptance depends on each journal's independent peer review." },
        {
          _key: "n3", qty: "2", title: "Competitions",
          body: "Applications to the CREST Gold Award and the IRIS National Science Fair. Awards are decided by each competition's independent judging.",
          links: [
            { label: "CREST Awards", href: "https://www.crestawards.org/", logo: { src: "/images/logos/crest-awards.webp", width: 503, height: 397 } },
            { label: "IRIS National Fair", href: "https://www.irisnationalfair.org/", logo: { src: "/images/logos/iris-national-fair.webp", width: 315, height: 427 } },
          ],
        },
      ],
    },
    {
      _type: "keyDatesSection",
      _key: "dates",
      heading: "Key dates",
      eligibility: "Open to students in Grades 9–12",
      dates: [
        { _key: "d1", label: "Applications", value: "Open now", detail: "Rolling admission · Grades 9–12" },
        { _key: "d2", label: "Registrations close", value: "7 April 2027" },
        { _key: "d3", label: "Summer Cohort 1", value: "12 Jun – 20 Aug 2027" },
        { _key: "d4", label: "Summer Cohort 2", value: "3 Jul – 12 Sep 2027" },
      ],
      note: "Admission is on a rolling basis.",
      format: {
        onlineTitle: "Two live online sessions each week",
        sessions: [
          { _key: "fs1", label: "Session 1", title: "Sunday Cohort Session", body: "A live online group session focused on developing the research paper, including academic writing, structure, and scientific communication." },
          { _key: "fs2", label: "Session 2", title: "Personalized Research Session", body: "A live online session with your dedicated mentor, focused on designing, developing, and executing your pair's specific research experiment." },
        ],
        labTitle: "One in-person lab visit",
        labStat: "1 day · Jaipur",
        labBody: "Students attend a one-day laboratory visit in Jaipur for hands-on experimentation. All regular learning and research sessions take place online; only this lab visit takes place in person.",
      },
    },
    {
      _type: "glanceSection",
      _key: "glance",
      anchorId: "program",
      navLabel: "Program",
      heading: "Program at a Glance",
      items: [
        { _key: "g1", icon: "calendar", stat: "10", title: "10-Week Research Program", body: "Structured online sessions to learn the science and design your experiment." },
        { _key: "g2", icon: "seats", stat: "16", title: "16 Limited Spots", body: "A small cohort, so every student gets real mentor time." },
        { _key: "g3", icon: "calendar", stat: "2", title: "Two Summer Cohorts", body: "Choose June to August or July to September 2027." },
        { _key: "g4", icon: "mentor", stat: "2:1", title: "2:1 IIT PhD Mentorship", body: "Two students work together with one dedicated IIT PhD mentor." },
        { _key: "g5", icon: "flask", stat: "Jaipur", title: "In-Person Lab Experience", body: "One day in our Jaipur lab to make and test your samples." },
        { _key: "g6", icon: "paper", stat: "1", title: "One Research Paper", body: "Leave with a finished, formatted academic paper." },
        { _key: "g7", icon: "trophy", stat: "2", title: "Two Competitions", body: "Apply to the CREST Gold Award and IRIS National Science Fair." },
      ],
    },
    {
      _type: "labSection",
      _key: "lab",
      anchorId: "roadmap",
      navLabel: "Roadmap",
      eyebrow: "Program Structure",
      heading: "Ten weeks, three phases.",
      body: "Two live online sessions every week, and one day of hands-on experimentation in our Jaipur lab between Weeks 4 and 8. Every other session is online.",
      points: ["Weeks 1–10", "2 live online sessions a week", "1 lab day in Jaipur"],
      totalWeeks: 10,
      stages: [
        { _key: "ls1", weekStart: 1, weekEnd: 4, art: "question", title: "Research Foundations", detail: "Your mentor guides your literature review, helps refine your initial idea into a focused, testable research question, and supports you in completing the introduction to your research paper." },
        { _key: "ls2", weekStart: 4, weekEnd: 8, art: "method", highlight: true, title: "Experimental Design & Execution", detail: "Design your experiment, finalize materials and methods, write the methodology section of your paper, and conduct your planned experiments during your one day in the Jaipur lab." },
        { _key: "ls3", weekStart: 8, weekEnd: 10, art: "paper", title: "Results & Discussion", detail: "Analyze your experimental results and complete the results and discussion sections of your research paper, interpreting your findings in relation to your original research question." },
      ],
      clips: [
        { src: "/media/lab-amber-stir.mp4", poster: "/media/lab-amber-stir.jpg", alt: "A CreatED Labs student pipetting into an amber solution on a stirrer" },
        { src: "/media/lab-stirrer-boy.mp4", poster: "/media/lab-stirrer-boy.jpg", alt: "A CreatED Labs student adding a reagent to a beaker on a magnetic stirrer" },
      ],
      images: [{ ...L.hotplateStir, focus: { x: 0.5, y: 0.2 } }, L.biosafety, L.foilBeaker], // keep the student's face in frame
    },
    {
      _type: "mentorSection",
      _key: "mentor",
      eyebrow: "2:1 Mentorship",
      heading: "Built with IIT PhDs.",
      body: "Every student pair works with a dedicated IIT PhD mentor specializing in chemical engineering, biotechnology, or materials science. Mentors guide students through research ideation, literature review, experimental design, laboratory work, and scientific writing.",
      stats: [
        { _key: "st1", value: "2:1", label: "Students per mentor" },
        { _key: "st2", value: "PhD", label: "From IIT" },
        { _key: "st3", value: "16", label: "Spots per cohort" },
      ],
      clip: { src: "/media/lab-weighing.mp4", poster: "/media/lab-weighing.jpg", alt: "A CreatED Labs student weighing out a sample at the lab bench" },
      clipTag: "Measure",
      clip2: { src: "/media/lab-labelling.mp4", poster: "/media/lab-labelling.jpg", alt: "A CreatED Labs student labelling a prepared sample" },
      clip2Tag: "Record",
      photo: L.sampleVial,
      photoTag: "Result",
    },
    {
      _type: "audienceSection",
      _key: "audience",
      eyebrow: "Who it's for",
      heading: "Who is CreatED Labs for?",
      intro: "CreatED Labs is designed for high school students in Grades 9–12 interested in chemical engineering, biotechnology and biochemistry, or materials science. You would be a great fit if:",
      criteria: [
        "You want to do hands-on lab work.",
        "You have a rough idea or a problem at the intersection of biology, chemistry and the life sciences that you want to investigate.",
        "You want to publish an academic research paper, from start to finish.",
        "You want to compete in high-impact international STEM competitions.",
      ],
      reassuranceTitle: "New to research? Don't worry.",
      photos: [L.sampleSeries, L.stirrerAdjust, L.benchPortrait, L.refluxSetup, L.tweezersSample, L.balance, L.stirrerBeaker, L.pipetteAmber, L.blueFilm, L.sampleMeasurement, L.stirrerObserve, L.samplePrepFoil, L.foilTweezers, L.laptopWriting, L.sampleHold, L.benchCutting],
      reassurance: "No prior experience is required to enroll. The program helps you with everything, from an initial rough idea to a formal academic paper, with expert guidance at every step.",
    },
    {
      _type: "applySection",
      _key: "apply",
      anchorId: "apply",
      navLabel: "Apply",
      heading: "Application Process",
      intro: "We're looking for interested, enthusiastic students who value learning. Apply through the Google Form.",
      steps: [
        { _key: "s1", title: "Tell us about you.", body: "Tell us about your academic interests, share your grades, and highlight any previous projects or research experience." },
        { _key: "s2", title: "Already have an idea? Tell us more.", body: "Having your own idea isn't necessary, but if you already have an interest, we'd love to help you bring it to life." },
        { _key: "s3", title: "Apply solo or in pairs.", body: "Apply individually, or team up with a partner to work on the same project. If you apply individually, we'll pair you with a partner." },
      ],
      ideationTitle: "Before Week 1: shape your idea",
      ideationBody: "Tell us your domain of interest and a starting idea. Your mentor helps you refine it into a workable research question before your sessions begin, so you start the 10 weeks with a clear direction.",
      deadlineNote: "Spots are filled on a rolling basis. Early applications have a real advantage, so apply before 7 April 2027.",
      cta: { label: "Apply Now", kind: "apply" },
      nextTitle: "After you apply",
      nextIntro: "Once you submit your application, you'll receive an email confirming:",
      nextPoints: ["We've received your application.", "What to expect next, including additional information and timelines for review."],
    },
    {
      _type: "ctaSection",
      _key: "cta",
      heading: "Your gateway to real research.",
      body: "Spots are filled on a rolling basis. Apply before 7 April 2027, or book a consultation to talk it through first.",
      primaryCta: { label: "Apply Now", kind: "apply" },
      secondaryCta: { label: "Book a Consultation", kind: "consult" },
      showBrochure: true,
      images: [L.oven, L.stirrerPipette, L.lightInspection, L.yellowBeaker],
    },
    {
      _type: "faqSection",
      _key: "faq",
      anchorId: "faq",
      navLabel: "FAQ",
      eyebrow: "FAQ",
      heading: "Questions parents and students ask.",
      contactNote: "Anything else? Write to us.",
      image: L.incubator,
      items: [
        { _key: "f1", question: "Do I need prior research experience to apply?", answer: "No. CreatED Labs is designed to take you from a rough idea to a formatted academic paper. Your mentor guides you through every stage of the research process. We only want you to bring curiosity and commitment." },
        { _key: "f2", question: "Is CreatED Labs only for people interested in biology?", answer: "No. CreatED Labs is not a pure biology research program. It develops projects for students interested in chemical engineering, biotechnology and materials science, including biochemistry and new material development." },
        { _key: "f3", question: "How is CreatED Labs different from the Research and Build Program?", answer: "CreatED Labs is a shorter, personally mentored research program structured over 10 weeks, designed specifically for Indian high school students in Grades 9–12 with an interest in chemical engineering, biotechnology or materials science. Students work in pairs, two students with one dedicated IIT PhD mentor." },
        { _key: "f4", question: "Can I apply with a friend?", answer: "Yes. You can apply individually or in pairs. If you apply as a pair, you'll work on the same project together and share sessions with your mentor. If you apply individually, we'll pair you with a partner who is keen on the same project topic." },
        { _key: "f5", question: "Can I apply solo and be matched with someone to do the project in a pair?", answer: "Yes, as long as both students are willing to work together on the same project." },
        { _key: "f6", question: "Who are the mentors?", answer: "Every student pair works with a dedicated mentor with a PhD from IIT, specializing in chemical engineering, biotechnology, or materials science. Two students work together with one mentor throughout the 10 weeks." },
        { _key: "f7", question: "What does a typical week look like?", answer: "You attend two live online sessions each week: a Sunday cohort session (morning or evening) focused on research writing, and a session for your pair with your mentor, focused on your experiment, at a mutually convenient time. The only in-person part of the program is a one-day lab visit in Jaipur." },
        { _key: "f8", question: "What happens during the Jaipur lab trip?", answer: "Between Weeks 4 and 8, you'll spend one day at our Jaipur lab facility running hands-on experiments and collecting data for your project. This is where your research moves from theory into testing." },
        { _key: "f9", question: "What will I actually walk away with?", answer: "An original wet lab prototype, a completed research paper covering your literature review, methods, results and discussion, and applications to two competitions. Journal acceptance and competition awards depend on independent peer review and judging." },
        { _key: "f10", question: "What's included in the program fee, and what's billed separately?", answer: "Your program fee covers mentorship, theory sessions, cohort sessions and access to the one-day Jaipur laboratory visit. Additional costs may include materials specific to your project, travel to Jaipur, and publishing costs depending on the journal you apply to." },
        { _key: "f11", question: "How does the application and selection process work?", answer: "You'll share your academic grades, current subjects and your project idea (if you have one; it isn't mandatory). Spots are offered on a rolling, first-come-first-served basis, so applying early gives you the best chance of a spot." },
        { _key: "f12", question: "How many spots are available?", answer: "Just 16 spots for each cohort, kept small so every student pair gets real time with their mentor." },
        { _key: "f13", question: "What if I don't have a fully formed idea yet?", answer: "That's completely fine. Tell us your domain of interest and a starting idea; your mentor helps you refine it into a workable research question before you start your sessions." },
        { _key: "f14", question: "Can I submit my paper for publication?", answer: "Yes. Publication is the program's aim for every paper, and acceptance depends on the journal's peer review. Publication costs are separate from the program fee and depend on the journal." },
        { _key: "f15", question: "What if I need to miss a session?", answer: "Sunday cohort sessions are mandatory. They're scheduled in a morning and an evening slot, so you can pick the one that suits you. If you still can't attend, we'll send you the recording after the session." },
        { _key: "f16", question: "Is there a refund policy?", answer: "We do not offer refunds, except under special circumstances. To request an exception, please email info@create-ed.in." },
        { _key: "f17", question: "How do I apply?", answer: "Click Apply Now and fill out the application form with your academic details and project idea. You'll receive a confirmation email immediately, followed by next steps and timelines." },
      ],
    },
  ],
};

export const seedExtras: Extras = { projects: [], testimonials: [], achievements: [] };
