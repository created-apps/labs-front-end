# Motion choreography and media map

The site has two signature motion moments, and both are continuous transitions of one object:

1. The CreatED Labs wordmark becomes the liquid that fills the hero beaker.
2. The hero notebook turns to a fresh page, which becomes the Program Deliverables page.

Everything else stays quiet so these two read clearly.

## 1. Opening: wordmark → beaker (one 3D scene, in the hero)

There is no splash screen. The opening is the first state of the hero's own Three.js scene. The wordmark, pipette, workbench, stirrer and beaker share one space, one light and one camera.

**Set-up.**
- **Wordmark:** the existing CreatED logo, unchanged and with the same dark-background treatment as the header, plus the header's `| LABS` lockup. It hangs in the air above the workbench.
- **Placement:** the D's light-bulb base sits directly above the beaker's pour point.
- **Pipette:** a glass Pasteur pipette holds hot-pink liquid above the E.

The logo already contains a tube. The E's middle bar is a double line that ends in an arrow pointing into the bulb. The motion uses that tube.

| Beat | Time | What happens |
| --- | --- | --- |
| Wordmark | 0.0 – 0.5 s | Camera level with the wordmark, drifting in slowly. The bulb is empty. A Sunglow drop swells at the pipette tip. |
| Feed | 0.5 – 1.2 s | The drop falls into the E's tube. The liquid travels along it, through the arrow and into the bulb. The pipette lifts away. |
| Fill | 1.1 – 2.1 s | The bulb fills with the pink liquid from the bottom, with a slight meniscus wobble, then lights up to the logo's own Sunglow. The logo is now exactly the brand logo. |
| Pour and descent | 1.7 – 3.3 s | A stream leaves the bulb's base. The camera follows its leading edge down, so the wordmark passes out of the top of the frame while staying in the same space and reflected in the epoxy. The camera eases into the hero framing. |
| Beaker | 2.4 – 3.6 s | The same hot-pink stream lands in the beaker. The level rises with ripples, then the stream's tail lifts away. |
| Stir | 3.3 – 4.6 s | The stirrer spins up and the vortex forms. |
| Settle | 3.0 – 3.8 s | The heading, deliverables, notebook sheet, card and buttons rise in. |

**Loading and fallbacks.**
- **First paint:** a pre-rendered still of the opening frame, so there is never a blank frame.
- **3D start:** the scene loads at once, with no interaction needed, and crossfades in when ready.
- **Scrolling:** never locked. Scrolling reveals the hero copy immediately.
- **Every load and refresh:** the opening plays. Deep links (`/#faq`) start at the hero framing instead.
- **Reduced motion:** the fully composed static hero.

## 2. Notepad: hero tear-off → Program Deliverables

The description sits on the top sheet of a notepad resting on the workbench, at a gentle, readable angle.

The tear waits until the notepad has been fully on screen; it starts once the pad's top reaches the top of the screen. On phones the pad begins below the fold, so visitors can read it first. Then, scroll-scrubbed and reversible:

1. The sheet lifts from its bottom edge towards you, hinged at the perforated top.
2. It tears off along the perforation and is tossed up and aside, fading out. Its text stays on it, and it never crosses the beaker.
3. A torn stub stays on the pad.
4. The fresh sheet underneath comes off next, with a torn top edge, and lands as the Program Deliverables page.

Once it has landed, the three lines write themselves in with pen circles and ticks, once each.

## 3. Supporting motion (kept subtle)

- **Week 1–10 track:** fills with Sunglow on scroll.
- **Who it's for coverflow** (after the Overflow reference): the photo under the pointer opens flat while the rest stay folded and the row stays anchored. Drag on touch, arrow keys on a keyboard. Nothing moves on its own.
- **Fan cards:** hover (desktop only).
- **Clips:** play muted, only while on screen.

## Page structure (after the scroll audit, 2026-10-19)

Each fact now has one home. The page dropped from 18.5 to 13 screens on desktop and from 25 to 17.7 on phones.

| Section | What it owns |
| --- | --- |
| Hero | The logo opening, the heading, the three deliverables in brief, and the description on the notebook page |
| Program Deliverables | The deliverables in full: descriptions, the peer-review and judging disclosure, and the CREST and IRIS logos |
| Key Dates | Dates, rolling admission, and the delivery format (two online sessions a week, one Jaipur lab day) |
| Program at a Glance | The seven-fact summary fan |
| Program Structure | The only timeline: the Week 1–10 track, the three phases with their illustrations, the lab day, clips and photos |
| 2:1 Mentorship | Who the mentors are, the stats and the session footage |
| Who it's for | Fit, reassurance and the coverflow of student photos |
| Application Process | The steps, ideation, the deadline and "After you apply" |
| FAQ, Gateway, Footer | Unchanged |

Removed and merged:
- **Program Description:** repeated the hero notebook text.
- **The capillary-tube Program Structure:** a third copy of the timeline.
- **Outcomes:** a fourth copy of the deliverables.
- **The standalone "After you apply" section.**

Their components remain in the code and in the Studio, so any of them can be added back as a block.

## Media map (each file used once)

| Section | Photos | Clips |
| --- | --- | --- |
| Program Structure | hotplate-stir, biosafety-cabinet, foil-beaker | lab-amber-stir (IMG_4293), lab-stirrer-boy (IMG_4286) |
| 2:1 Mentorship | sample-vial (WhatsApp 2026-10-11) | lab-weighing (IMG_4428), lab-labelling (IMG_4416) |
| Who it's for (coverflow, 16) | sample-series, stirrer-adjust, bench-portrait, reflux-setup, tweezers-sample, balance, stirrer-beaker, pipette-amber, blue-film, sample-measurement, stirrer-observe, sample-prep-foil, foil-tweezers (IMG_8820), laptop-writing (IMG_4411), sample-hold (3881acac), bench-cutting | — |
| FAQ | incubator | — |
| Gateway slideshow | oven, stirrer-pipette, light-inspection, yellow-beaker (d14b9e1e) | — |

All 25 photos in `Student Pictures` are used, each exactly once. The site files are renamed copies, with EXIF and location data stripped, and students are never named. 

**Clips not used:** IMG_3332, IMG_4343, IMG_4337 and the two WhatsApp clips. They're available if a section needs more footage. The encoded files `lab-pipette-dark` and `lab-bench-pipette` are also spare.

**Mentorship illustrations:** these are hand-built vector SVGs (`components/ui/MentorArt.tsx`) in the brand palette. The Gemini key ran out of prepaid credit, so they weren't generated. They show generic scientific motifs only.

**Competition logos:** `public/images/logos/crest-awards.webp` and `iris-national-fair.webp` come from the official logo files supplied in the project folder. They're trimmed of white margin, never resampled or stretched, and shown on white tiles linking to each competition's site.
