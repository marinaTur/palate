# Mobile Dashboard & Navigation UX — 2026 Research Snapshot

**Status:** Reference document. Input for updating `MOBILE_LAYOUT_CONVENTION.md` — not itself a
convention, and nothing here is binding on the codebase until a deliberate edit folds it into that
document (or `CLAUDE.md`).
**Compiled:** August 2026, while re-thinking Home's UI, on explicit instruction to research before
proposing anything.
**Produced alongside:** two Home concept mockups (a bento-grid dashboard, an editorial-hero layout)
shown earlier in the same session — those are the applied output; this document is the research
trail underneath them, kept separate so the reasoning survives independently of any one proposal.
**Scope:** mobile app home/dashboard screens and navigation specifically. A few sources found
during search skew enterprise or desktop dashboards — flagged explicitly in §2 rather than folded
in as if they were mobile-consumer findings.
**Source-quality note:** most of what's citable here is UI/UX agency blogs and design-tool
marketing content — the normal texture of this kind of search, not a flaw unique to this pull.
Where several independent sources converge on the same point it's noted as such; single-source
claims are flagged as such too, so nothing below reads more settled than it actually is. Every
claim below is attributed to a named publisher — see §4 for the full title, date, and URL behind
each name.
**Search queries used** (for reproducibility, so a future revisit can re-run the same ground):
mobile app dashboard design trends 2026 · bento grid UI mobile app design · thumb zone mobile UX
research 2026 · habit tracking learning app home screen design personalization · app home screen
personalized greeting good morning UI pattern · wine tasting education app UI design · mobile app
card UI rounded soft design trend 2026.

---

## 1. Findings

### 1.1 Bento-grid layouts — genuinely new; not currently in `MOBILE_LAYOUT_CONVENTION.md`

The most consistently repeated, multi-source-convergent finding of this whole pass. A bento grid
(named for the Japanese lunch box) arranges content into tiles of *deliberately varied* size on one
screen — the size of a tile is itself doing communicative work, not just filling space.

- The most directly useful single finding: bento grids are named as the right fit specifically for
  content-heavy apps, dashboards, and home screens with multiple distinct content types, and
  explicitly the *wrong* fit for transactional flows built around one focused action per screen
  (Intuitia). This maps cleanly onto Palate's own split — Home (many destinations) is a bento
  candidate, Planner's one-tap picker (one focused choice) correctly is not, matching what
  `MOBILE_LAYOUT_CONVENTION.md` §5–6 already established for a different reason.
- Mechanism: size variation creates a focal point without a label — a larger tile reads as "this
  matters more" before anyone reads its text (Jaco Verdini, Medium; Galaxy UX Studio).
- Real shipped adoption cited across very different product types: Apple's iOS widgets and product
  pages, Microsoft Surface/Office 365, Google Pixel/Material Design promo pages, Netflix, Samsung,
  and Notion (Galaxy UX Studio; Peterdraw Studio) — plus, closer to Palate's own category, a
  wellness/medication-tracking app example turned up in a general gallery search, suggesting the
  pattern already reaches habit- and health-adjacent apps, not just media or productivity ones
  (Behance gallery search).
- Relevant to this exact stack: bento layouts are described as having matured alongside CSS Grid,
  with utility frameworks — Tailwind specifically named — credited for making it fast to compose
  modular cards with consistent spacing across breakpoints (Peterdraw Studio). Palate already runs
  Tailwind 4.
- Mobile-specific behavior: bento grids are described as adapting cleanly on small screens —
  stacking or rearranging blocks without losing coherence — which is called out as a specific
  strength for phones rather than a compromise (Peterdraw Studio; Pixso).
- Maturity claim specific to 2026: bento is described as having moved past static landing pages
  into dashboards, mobile apps, and live/interactive surfaces, with real-time data and
  personalization making the grid "feel alive" rather than purely decorative (Peterdraw Studio).

**Confidence:** high — the one theme independently corroborated by the largest number of distinct
sources, including the more analytically framed ones.

### 1.2 Thumb zone & reachability — confirms the existing convention, adds sharper numbers

Nothing here overturns what `MOBILE_LAYOUT_CONVENTION.md` §3 and §8 already say. Worth folding in
as reinforcement, plus a few more precise figures than the doc currently cites:

- The underlying research is unchanged: Steven Hoober's field study (over 1,300 people observed in
  real settings — streets, airports, buses) is still the origin point for "thumb zone" as a design
  concept (Inkbot Design; Parachute Design).
- A sharper number worth adding: content sitting in the natural bottom-two-thirds reach zone is
  reported to draw roughly 80% more taps than the same content placed near the top of the screen
  (Sneh Sagar, Medium). Single-source claim — treat as directionally right, not as a precisely
  citable industry statistic.
- Roughly half of users (about 49%) hold their phone in one hand and operate it with that same
  thumb for everything, per Hoober's observed data (Inkbot Design); a separate source puts thumb
  contact at around 75% of all smartphone touches generally (Parachute Design, citing Smashing
  Magazine).
- Target sizing is confirmed at the numbers the convention doc already uses: 44×44 for iOS/WCAG,
  48dp for Android/Material (UXCam; Parachute Design).
- New precision worth adding: spacing between targets matters almost as much as their size —
  roughly 8pt between ordinary elements, and specifically 12pt around *navigation* elements, since
  a mistap there sends someone to the wrong screen entirely rather than just misfiring a minor
  action (Timothy Graf, citing MIT Touch Lab research on fingertip contact width).
- Large phones (iPhone Pro Max / Galaxy Ultra class, 6.7"+) are repeatedly described as making the
  one-handed reach problem worse, not better — directly backs the existing convention's §2 framing
  that "wide screen" should be read as a big phone, not a wider canvas (Parachute Design).

**Confidence:** high — this traces back to established human-factors research rather than a
fast-moving trend; the 2026 sources found are mostly restating the same Hoober-derived figures
rather than presenting genuinely new competing data.

### 1.3 Visual style: soft UI as an accent, restraint over decoration

A genuinely new theme for the convention doc, which currently covers layout and interaction
pattern, not visual texture. Whether this belongs in `MOBILE_LAYOUT_CONVENTION.md` at all, or in
`CLAUDE.md`'s Design System section instead, is flagged as an open question in §2 below — not
decided here.

- Soft UI (rounded corners, pill-shaped buttons, gentle shadows) is now described as something
  applied selectively to the elements that need to read as tappable, rather than as a full-app
  skin — the example given is a finance app keeping soft-raised cards for account summaries while
  its forms and tables stay flat (Designveloper).
- Restraint is described as the real story of 2026 more than any single new decorative technique —
  fewer controls on screen, but each one doing more visible work, rather than added ornament for
  its own sake (QicApp, Medium).
- Glassmorphism has a genuine 2026 resurgence, tied concretely to Apple's "Liquid Glass" translucent
  system spreading across macOS and iOS (UX Pilot) — but the more carefully argued sources are clear
  that it's being used narrowly: floating overlay cards, notification panels, contextual menus —
  not translucent-everything the way early glassmorphism was (Muzli).
- Rounded, softened edges generally are framed as a legibility and approachability choice as much
  as a stylistic one, cited for both Apple's and Google's own current systems (Fuse Lab Creative;
  Apurple).
- **Inconsistent across sources — flagged, not resolved:** neumorphism's actual 2026 status is
  described very differently depending on the source. Several list it as a rising trend in its own
  right (UIDesignz; Apurple; The Brands Bureau; World Flags 101 — and a habit-tracker UI template
  vendor, AIDesigner, is explicitly built around it as a selling point), while the source most
  explicitly framed around "what survived contact with real users" doesn't mention it as a current
  pattern at all (Muzli). Read this as genuinely contested rather than settled — not a reason to
  adopt or avoid it, just a reason not to cite it as though every source agrees.
- **Explicitly does not apply to Palate:** one source's recommendation toward bold, vibrant,
  gradient-heavy color schemes (The Brands Bureau) sits in direct tension with Palate's own locked,
  deliberately restrained palette and its explicit differentiation-from-Vivino constraint
  (`PROJECT_MEMORY.md` §5, §17). Noted here so a future reader doesn't mistake "vibrant color is a
  2026 trend" for license to revisit the locked palette — the trend and the project's own
  documented decision are two separate things, and the project's decision wins.

**Confidence:** medium — real and multi-source, but visual-style claims are inherently softer and
more taste-dependent than the thumb-zone or bento-grid findings above.

### 1.4 Card-based layouts and bottom navigation — confirms existing choices, nothing to change

- Card-based layout is repeatedly named as still the dominant mobile UI pattern, specifically
  because of the clean structure and content organization it gives for free (AppsChopper) —
  nothing found argues for moving away from cards.
- Bottom navigation bars are described as already present on nearly every major platform, with
  continued growth expected through 2026 (Fuse Lab Creative, "20 Mobile App Design Trends") —
  directly supports keeping `Layout.jsx`'s existing bottom nav as-is rather than reconsidering it.

**Confidence:** high, but low information value — this mostly confirms decisions already made
rather than suggesting anything new to act on.

### 1.5 Progress shown on the surface itself, not on a separate stats screen

- The stronger habit/tracking-app case study found puts progress visualization — most often a
  round or circular chart — directly on the home surface someone's already looking at, explicitly
  so they don't have to go anywhere else to see it or act on it (Eleken, HabitSpace case study).
- The same expectation shows up in vendor/template sources describing the standard UI vocabulary
  for this app category: pressable cards, pill toggles, segmented controls, and a circular progress
  ring as the anchor element of the home screen specifically (AIDesigner).

This doesn't argue for anything Palate doesn't already believe — it's supporting evidence for the
existing "milestone framing over streaks/stats-dashboard" principle (`PROJECT_MEMORY.md` §3, §15),
not a reason to build the stats dashboard that's deliberately deferred to V2. A progress ring
showing "3 of 5 lessons" is this pattern; a dedicated stats page with streaks, averages, or history
is the separate, still-deferred thing.

**Confidence:** medium — a smaller sample of sources than 1.1–1.2, but the finding is specific and
describes real shipped products rather than forecasted trends.

### 1.6 Personalization — real, but mostly enterprise/AI-behavioral; narrow relevance here

- The broadest personalization claims found describe AI reshaping layout based on observed
  behavior — different users seeing different priorities on the same screen, menus reordering
  themselves (QicApp, Medium) — and enterprise dashboards specifically moving toward AI-generated,
  role-adaptive layouts (Fuse Lab Creative, "Dashboard Design Trends 2026").
- Time-of-day greetings ("Good evening") are a well-established, low-risk pattern, but the search
  aimed at this specifically turned up mostly implementation tutorials rather than substantive 2026
  trend commentary — worth using, but not worth citing as though it were a major documented shift.
  It reads as a baseline expectation at this point more than a live "trend," and no single source
  from that search was strong enough to cite by name here.

**Confidence:** low-to-medium for the AI-behavioral-adaptation claims specifically — genuinely
interesting, but not something Palate's current static demo-mode content can act on until live AI
is switched on (`PROJECT_MEMORY.md` §14 #1); higher confidence but low novelty for basic
time-aware greetings.

### 1.7 Wine-education competitive landscape

Not a design trend exactly, but relevant context that surfaced in the same research pass:

- At least one other wine-tasting app MVP explicitly borrowed Duolingo's step-by-step mental model
  specifically to make wine feel less intimidating to newcomers, including a "wine coaster" UI
  element as a deliberate physical-world echo (Paulina Designs, Flavourit UX case study).
- A dedicated wine-learning app markets itself directly around the same comparison, describing
  itself as built for people who want to learn about wine "in a simple and fun way," with real user
  testimonials describing a changed relationship with wine after using it (Vinodelice, interview
  with Winology co-founder Nathalie Roudier).

This validates Palate's own "Duolingo for wine" framing (`PROJECT_MEMORY.md` §3) as an instinct
shared by at least two other real products in the space — not a reason to look like either of them,
but reassurance that the underlying bet is a reasonable one.

---

## 2. Explicitly out of scope — found, but not applicable to Palate

Listed so a future reader doesn't mistake these for applicable findings just because they surfaced
in the same searches:

- **Enterprise/analyst dashboard patterns** — sidebar navigation, dense 12-column content grids,
  KPI-card strips, desktop-first assumptions for "analyst workstations" where sessions run long
  (Art of Styleframe; Fuse Lab Creative, "Dashboard Design Trends 2026"). These sources are explicit
  that mobile-first is the *wrong* choice for that specific use case — a real and correct point, but
  about a different use case from Palate's Home screen, not a counter-argument against Palate's own
  mobile-first rule.
- **AI-agent-driven, conversational dashboard interfaces** — conversational interaction replacing
  menus, dashboards absorbing task-specific AI agents (Fuse Lab Creative, "Dashboard Design Trends
  2026"). Not actionable while Planner stays in demo mode with no live AI connected
  (`PROJECT_MEMORY.md` §14 #1).
- **AR/spatial UI** — mentioned as an emerging 2026 direction (UX Pilot), but scoped by that same
  source to products whose value depends on visualizing something in physical space (furniture,
  home decor, fashion). Not relevant to a wine-education app.
- **Vibrant/bold color as a 2026 direction** (The Brands Bureau) — a real trend claim, but in direct
  tension with Palate's own locked, deliberately restrained palette. Covered in §1.3; repeated here
  for visibility.
- **Material Design 3's adaptive, device-driven theming** (AppsChopper) — meaningfully an
  Android-native pattern; Palate is a responsive web app (PWA), so this doesn't translate directly.

---

## 3. Proposed updates to `MOBILE_LAYOUT_CONVENTION.md`

Not applied here — this document is the input, not the edit. What a future edit pass should
consider, concretely:

1. **New pattern section, alongside the existing chip-bar picker pattern (current §5–6):** a
   bento-grid dashboard pattern for any *multi-destination overview* screen — Home is the first
   case, there may be others later. This is a different problem from the chip-bar picker, which is
   for choosing one thing from a small curated set, and the doc should say so explicitly, the same
   way it already distinguishes the chip-bar picker from a bottom sheet.
2. **Amend current §3 (thumb zone)** to add the ~80%-more-interaction figure and the 8pt/12pt
   spacing precision from §1.2 above, both sourced.
3. **Amend current §8 (Research basis)** — that section already invites a fresh check "if this
   convention is revisited long after it was written." This document is that fresh check. Worth
   dating it there explicitly (August 2026) so the next revisit has a clear "last checked" marker
   instead of the current, vaguer note.
4. **Open question, not a proposed answer:** whether §1.3 above (soft UI as accent, restraint)
   belongs in this convention doc at all, given its current scope is layout and interaction pattern,
   not visual texture — or whether it belongs in `CLAUDE.md`'s Design System section instead,
   alongside Palette v1.1. Flagged rather than decided, since it's a question of which document owns
   this, not a design question.
5. **No change indicated:** current §1, §2, §4, §7 (mobile-first without exception, "wide screen"
   defined as a big phone, coordinating with the global bottom nav, the anti-patterns list) are all
   confirmed as-is by this research — nothing found contradicts them.

---

## 4. Sources

Full title, publisher/author name, publication date (as reported by the source), and URL for every
source cited by name in §1–§2 above, grouped by which search surfaced them.

**Mobile app dashboard design trends 2026**
- QicApp — "10+ Latest Mobile App Design Trends To Follow In 2026" (Medium, Feb 23, 2026)
  https://medium.com/@qicapp/10-latest-mobile-app-design-trends-to-follow-in-2026-48ab43e1433a
- Speculative Chic — "Modern Dashboard Design Trends for Mobile Apps in 2026" (Apr 6, 2026)
  https://speculativechic.com/modern-dashboard-design-trends-for-mobile-apps-in-2026/
- Fuse Lab Creative — "Dashboard Design Trends 2026: Which Ones Actually Matter" (enterprise-framed
  — see §2)
  https://fuselabcreative.com/top-dashboard-design-trends-2025/
- UIDesignz — "12 Mobile App Design Trends to Follow in January 2026" (Mar 25, 2026)
  https://uidesignz.com/blogs/mobile-app-design-trends
- Art of Styleframe — "Dashboard Design Patterns for Modern Web Apps 2026" (desktop-framed — see
  §2)
  https://artofstyleframe.com/blog/dashboard-design-patterns-web-apps/

**Bento grid UI mobile app design**
- Pixso — "Bento Box UI Design: Why it's everywhere and how to create it" (May 20, 2026)
  https://pixso.net/articles/bento-grids/
- Behance — gallery search results for "bento grid mobile app"
  https://www.behance.net/search/projects/bento%20grid%20mobile%20app
- Jaco Verdini — "Embracing the Bento Grid: A Modern Approach to UI Layouts" (Medium, Apr 3, 2025)
  https://jacoverdini.medium.com/embracing-the-bento-grid-a-modern-approach-to-ui-layouts-4a15f618e751
- Galaxy UX Studio — "Bento Grids: The New Standard for Modular UI Design" (Mar 20, 2026)
  https://www.galaxyux.studio/blog/bento-grids-the-new-standard-for-modular-ui-design/
- Peterdraw Studio — "Bento Grid Layout: A Modular Approach to Modern UX" (Apr 24, 2026)
  https://peterdraw.studio/blog/bento-grid-layou

**Thumb zone mobile UX research 2026**
- Parachute Design — "Mastering the Thumb Zone: Mobile UX & UI Design Guide" (Mar 24, 2026)
  https://parachutedesign.ca/blog/thumb-zone-ux/
- Inkbot Design — "Mobile UX Best Practices: Designing For Thumbs In 2026" (Nov 24, 2025)
  https://inkbotdesign.com/mobile-ux/
- UXCam — "Mobile UX Design: A Complete Guide for 2026" (Apr 22, 2026)
  https://uxcam.com/blog/mobile-ux/
- Brand Vision — "Mobile UX Best Practices in 2026" (Mar 25, 2026) — not cited by name above but
  read in full; content converged with the other thumb-zone sources rather than adding a new point
  https://www.brandvm.com/post/mobile-ux-best-practices
- Sneh Sagar — "Mobile App UX Design Best Practices... in 2026" (Medium, May 21, 2026)
  https://medium.com/@sneh_sagar/mobile-app-ux-design-best-practices-what-actually-keeps-users-coming-back-in-2026-ef91ae6e478c
- Chic Workshop — "Designing for the Thumb Zone... for Shopify Stores" (Jun 22, 2026) — not cited
  by name above; its distinct point (thumb-zone quality affecting Core Web Vitals/INP scores) is a
  Shopify/SEO-specific angle not relevant to Palate, so intentionally left out of §1
  https://chicworkshop.com/blogs/blog/designing-for-the-thumb-zone-mobile-ux-best-practices-for-shopify-stores
- Timothy Graf — "Designing for the Thumb Zone: A Modern Guide to Mobile UX That Respects Human
  Anatomy" (Jun 24, 2026)
  https://timgraf.com/ux-design/designing-for-the-thumb-zone-a-modern-guide-to-mobile-ux-that-respects-human-anatomy/

**Habit tracking / learning app home screen design**
- Eleken — "HabitSpace App Design Case Study"
  https://www.eleken.co/cases/habitspace
- AIDesigner — "Habit Tracker Mobile App" template listing
  https://www.aidesigner.ai/templates/apps/mobile-ui/habit-tracker-app-1

**Wine tasting education app UI design**
- Paulina Designs — "Democratising wine tasting" (Flavourit UX Design App MVP case study)
  https://www.paulinadesigns.net/flavourit
- Vinodelice — "Winology: The App That Finally Makes Learning About Wine Fun" (Feb 18, 2026)
  https://vinodelice.com/en/blogs/news/interview-winology-application-learn-wine

**Mobile app card UI / rounded, soft design trend 2026**
- Designveloper — "15 Latest Mobile App UX/UI Design Trends to Watch in 2026" (Nov 27, 2025)
  https://www.designveloper.com/blog/mobile-app-design-trends/
- Apurple — "Mobile App Design Trends 2026 - A Comprehensive List" (Apr 23, 2026)
  https://www.apurple.co/mobile-app-design-trends/
- Fuse Lab Creative — "20 Mobile App Design Trends for 2026 You Need to Know" (Mar 9, 2026 — a
  different article from the dashboard one above, same publisher)
  https://fuselabcreative.com/mobile-app-design-trends-for-2025/
- World Flags 101 — "Mobile App Design Trends for 2026: Creating Engaging and User-Friendly
  Experiences" (May 21, 2026)
  https://worldflags101.com/mobile-app-design-trends-for-2026-creating-engaging-and-user-friendly-experiences/
- UX Pilot — "9 Mobile App Design Trends for 2026" (Oct 28, 2025)
  https://uxpilot.ai/blogs/mobile-app-design-trends
- Muzli — "Mobile App Design Trends 2026: UI Patterns" (Apr 6, 2026)
  https://muz.li/blog/whats-changing-in-mobile-app-design-ui-patterns-that-matter-in-2026/
- AppsChopper — "Top Seven Mobile App Design Trends In 2026" (May 27, 2026)
  https://www.appschopper.com/blog/top-trending-mobile-app-design-practices-year/
- The Brands Bureau — "12 Mobile App UI/UX Design Trends to Watch in 2026" (Jan 7, 2026)
  https://thebrandsbureau.com/mobile-app-design-trends-2026/
- Intuitia — "App Design Trends 2026: What's Actually Working" (May 11, 2026)
  https://www.intuitia.tech/blog/app-design-trends

---

**Caveat, matching the existing convention doc's own framing:** this is a snapshot taken in one
research pass in August 2026, weighted toward whatever a normal web search surfaces for "2026
trends" queries — mostly UI/UX agency and design-tool blogs, not peer-reviewed or standards-body
sources (the thumb-zone/touch-target research is the exception — that traces back to real
observational studies, not trend forecasting). Re-verify rather than assume-still-current if this
document is being read long after it was written.
