# CreatED Labs website

The landing page for **CreatED Labs**, at `labs.create-ed.in`.

- **Frontend:** Next.js 16 (App Router). Pages are pre-rendered static HTML.
- **CMS:** Sanity. The editor runs at `/studio` and content is hosted by Sanity.
- **Hosting:** Vercel. Publishing in the CMS refreshes the live site within seconds, with no redeploy.

Until a Sanity project is connected, the site renders the launch content bundled in `src/content/seed.ts`. It is fully usable for review in that state.

---

## 1. Run it locally

Requires Node 20.12+ (22 recommended).

```bash
cd site
npm install
cp .env.example .env.local   # fill in values as you go; all are optional for a first run
npm run dev                  # http://localhost:3000
```

Production check: `npm run build && npm start`.

## 2. Accounts to create (all owned by CreatED)

Create each account with a shared CreatED address, for example `tech@create-ed.in`, not a personal email. Invite the developer as a member, so access can be removed later without losing anything.

| Service | Plan | What it holds |
| --- | --- | --- |
| GitHub | Free | Source code (this folder) |
| Vercel | Pro, $20/month | Hosting, domain, preview deployments |
| Sanity | Free to start | Content, images, revision history, editor logins |
| Google Analytics 4 | Free | Visits and button-click events |
| Google Search Console | Free | Indexing and search performance |

## 3. Connect the CMS (once)

1. **Create the project.** Run `npx sanity@latest login`, then create a project at [sanity.io/manage](https://www.sanity.io/manage) with a dataset called `production`.
2. **Set up CORS.** In the project, open **API → CORS origins** and add `http://localhost:3000` and `https://labs.create-ed.in`, both with *Allow credentials* ticked.
3. **Create a token.** Go to **API → Tokens** and create a **Viewer** token. This becomes `SANITY_API_READ_TOKEN`; it's used only for draft preview.
4. **Fill in `.env.local`.** Set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `SANITY_API_READ_TOKEN`. Set `SANITY_REVALIDATE_SECRET` to any long random string, e.g. from `openssl rand -hex 32`.
5. **Import the launch content and photos:**
   ```bash
   npx sanity exec scripts/seed-sanity.ts --with-user-token
   ```
6. **Invite editors.** Under **Members**, invite your editors with the *Editor* role. They log in at `/studio`.

## 4. Deploy to Vercel

1. Push this folder to a GitHub repository, then import it in Vercel. The framework (Next.js) is detected automatically.
2. Add the environment variables from `.env.example` for both Production and Preview. Don't add `GEMINI_API_KEY`; the site doesn't use it.
3. Add the domain `labs.create-ed.in` under **Settings → Domains**, then create the DNS record Vercel shows (a CNAME to `cname.vercel-dns.com`) wherever `create-ed.in` DNS is managed.
4. Set up the publish webhook. In [sanity.io/manage](https://www.sanity.io/manage), go to **API → Webhooks → Create** and fill in:
   - **URL:** `https://labs.create-ed.in/api/revalidate`
   - **Dataset:** `production`
   - **Trigger on:** Create, Update, Delete
   - **Filter:** `_type in ["siteSettings","program","project","testimonial","achievement","redirect"]`
   - **Projection:** `{_type}`
   - **HTTP method:** POST
   - **Secret:** the same value as `SANITY_REVALIDATE_SECRET`

From then on, **publishing** in the Studio updates the live page and `sitemap.xml` within a few seconds. Code changes deploy automatically when they're pushed to `main`.

## 5. Search and analytics setup

- **GA4:** create a property and copy its ID (`G-…`) into Studio → **Site settings → Search & analytics**. Analytics load only after a visitor accepts the cookie banner. Custom events: `apply_click`, `consultation_click`, `brochure_download`, `faq_open`, `contact_email_click` (each carries a `location` parameter). In GA4, mark `apply_click` and `consultation_click` as **key events**.
- **Search Console:** add `https://labs.create-ed.in` as a URL-prefix property and choose the *HTML tag* method. Paste only the `content="…"` value into Site settings and publish, then click Verify. Finally, submit `https://labs.create-ed.in/sitemap.xml`.
- **Already built in:** canonical URLs, Open Graph and Twitter cards, structured data (EducationalOrganization, Course, FAQPage, and CreativeWork for projects), `robots.txt` that blocks `/studio` and `/api`, `noindex` on preview deployments, and CMS-managed redirects.

## 6. Recurring costs

| Item | Monthly |
| --- | --- |
| Vercel Pro (1 member) | $20 |
| Sanity Free. Upgrade to Growth (about $15 per editor) for longer history and scheduled publishing; check current limits on sanity.io/pricing. | $0–45 |
| GA4, Search Console, subdomain | $0 |
| **Typical total** | **≈ $20–65** |

## 7. Publishing, recovery and portability

- **Workflow:** edits save as drafts. **Preview** shows the real page with the draft applied, and **Publish** makes it live. See `docs/EDITOR-GUIDE.md`.
- **Undo:** every document has a full change history in the Studio (⋯ → *Review changes* → restore any version).
- **Backups:** `.github/workflows/content-backup.yml` exports all content and images every Monday and keeps each export for 90 days. It needs the repository secrets `SANITY_PROJECT_ID` and `SANITY_AUTH_TOKEN` (a Viewer token).
- **Portability:** `npx sanity dataset export production` produces standard NDJSON plus image files. Nothing is locked to this codebase.

## 8. Maintenance

- **Quarterly (about an hour):** run `npm outdated`, update, and run `npm run build` and `npm run lint`; Vercel previews every branch before it goes live.
- **Monthly:** glance at Search Console → *Pages* and *Core Web Vitals*.
- Routine content never needs a developer.

## 9. Verified before handover (local production build, Lighthouse 12)

| | Performance | Accessibility | Best practices | SEO | Blocking time | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| Desktop (with the opening) | 100 | 100 | 100 | 100 | 30 ms | 0 |
| Mobile (simulated slow 4G, with the opening) | 86 | 100 | 100 | 100 | 270 ms | 0 |

Mobile performance is lower than before because the 3D opening now starts as soon as the page paints, instead of waiting for the first interaction.

Also checked:

- There's no horizontal scrolling at 1440, 820 and 390 px, and no card text overflows.
- The mobile menu works and closes with Escape.
- Reduced motion shows the fully composed hero (no opening), a filled week track and tube, a ticked deliverables page, and video posters instead of clips.
- The opening plays on every load and refresh, hands over to the hero copy by about 3–4 s, is skipped on deep links, and never locks scrolling.
- On scroll the hero notepad sheet lifts and tears off (its text stays on it), and the fresh sheet underneath travels down to become the deliverables checklist.
- The Sanity schema validates with 0 errors.
- The revalidation webhook rejects unsigned calls.
- `/studio` and `/api` send `noindex`.

## 10. How the code is organised

```
src/
  app/(site)/          pages: home, /programs/[slug], /projects/[slug], /privacy, CMS redirects
  app/studio/          embedded Sanity Studio
  app/api/             revalidate webhook, draft-mode on/off
  components/sections/ one component per CMS section block (SectionRenderer maps them)
  components/stage/    the hero's 3D scene (Three.js): the logo opening, beaker, pour, stirrer and epoxy
                       reflection (scene.ts); logo preparation (logo.ts); the before-paint gate (gate.ts)
  components/sections/Notebook.tsx   the deliverables page and the tear-off from the hero notepad
  components/roadmap/  capillary-tube roadmap (SVG + GSAP ScrollTrigger)
  app/stage-capture/   development-only page used to render the stage stills
  content/             launch copy and image manifest (fallback + seed source)
  sanity/              schemas, queries, desk structure, client
scripts/               seed-sanity.ts, one-off Gemini/Veo generators
docs/MOTION-AND-MEDIA.md   the motion choreography and the one-use-per-file media map
```

**Animation libraries:** each one has a single job.

| Library | Used for | Loading |
| --- | --- | --- |
| Three.js | The hero scene: logo opening, pour, stir | Starts as soon as the page has painted (a still of the first frame shows until then). Paused off screen |
| GSAP + ScrollTrigger | The Week 1–10 track fill (and the capillary tube, if that block is re-added) | Lazy-loaded as the section approaches |
| Motion (`motion/react`) | Menu, cookie banner | Present on every page |

The notepad tear-off and the fresh sheet's travel are a small scroll-driven script (no library). Everything else (checklist ticks, the Who-it's-for coverflow, mentorship stages) is plain CSS triggered once by an IntersectionObserver. Looping clips (`components/ui/LoopVideo.tsx`) play only while on screen and load their posters as they approach.

With `prefers-reduced-motion`, Save-Data or no WebGL, the hero shows a still render (`public/images/stage/hero*.webp`); the tube and week track render full.

**Updating the hero stills** after changing the 3D scene: run `npm run dev -- -p 3101` and open these in a browser (the page renders the scene at time `t` and saves a WebP into `public/images/stage/`; both routes exist only in development):

- desktop window (about 1600×1000): `/stage-capture?t=10&name=hero&save=1` and `/stage-capture?t=0.02&name=hero-start&save=1`
- phone-sized window (430×932): the same two URLs with `&mobile=1`

- the opening frame: `/stage-capture?opening=1&t=0.01&name=opening&save=1` (desktop) and the same with `&mobile=1` at 430×932

`opening*` is the first frame of a first visit; `hero-start*` is the empty beaker for repeat visits; `hero*` is the settled frame used for reduced motion.

**Hero opening (every page load):** the hero's own 3D scene starts on the existing CreatED logo (unchanged, with the header's `| LABS`), which hangs above the workbench.

1. A pipette drops hot-pink liquid into the E's double-line tube.
2. The liquid runs through the arrow and fills the light-bulb D, which then lights up in the logo's Sunglow.
3. A stream leaves the bulb's base, and the camera follows it down.
4. The same stream fills the beaker, then the stirrer spins up.
5. The logo lifts out of view and the hero copy rises in, about 3–4 s after the page appears.

How it behaves:

- **Every load:** it plays every time the home page is loaded or refreshed.
- **Skipped:** for deep links (`/#faq`), inside the Studio preview, with reduced motion and with Save-Data.
- **Scrolling:** never locked. Scrolling brings the hero copy in immediately.
- **Slow devices:** if the 3D isn't running within 2.6 s, the workbench version plays instead. If scripts never load, the copy appears after 7 s.
- **Replay it:** refresh the page.

The full choreography is in `docs/MOTION-AND-MEDIA.md`.

**Images and video:** the student photos are real and stored in `public/images/lab` with EXIF and location data stripped. `public/media/lab-*.mp4` are short muted cuts of the students' own lab videos (originals untouched). The workbench and caustics textures in `public/images/generated` were made with Gemini (`scripts/generate-stage.mjs`), none of them contain people or projects. The mentorship diagrams are hand-built SVGs (`components/ui/MentorArt.tsx`), because the Gemini key's prepaid credit ran out.

> **Security:** the Gemini API key used during the build was shared in chat. Rotate it in Google AI Studio. It lives only in the git-ignored `.env.local` and is never used by the website.
