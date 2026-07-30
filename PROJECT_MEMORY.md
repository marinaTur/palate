# PROJECT_MEMORY.md — Palate

**Purpose of this document:** The codebase tells you *what* exists. This document tells you *why* it exists, what was rejected along the way, what's still open, and what Marina has said she cares about. Read this before making product, design, or architectural decisions — not just before writing code.

**Owner:** Marina Turkina (analyst by profession, not a developer — this matters, see §17 and §21).
**Repo:** github.com/marinaTur/palate · **Live site:** verdant-dodol-3d12df.netlify.app

---

## 1. Project Vision & Goals

Palate is a **wine tasting education app** — not a wine recommendation engine, not a cocktail app, not a wine-buying assistant. That scope was deliberately chosen over two alternatives during the initial pitch phase:

- **Wine recommendation engine** (buy wine for an occasion) — rejected as too narrow, heavy competition from Vivino, moderate commercial ceiling.
- **Cocktail recommendation + recipes** — rejected despite a larger addressable market, because it wasn't what Marina personally wanted to learn.
- **Wine tasting guide/school** (chosen) — reasoning at the time: largest addressable audience (beginners *learning*, not just buying), multiple revenue streams (education, B2B wine schools/tours, affiliate), strong viral/shareable potential, and — decisively — **Marina wants to learn wine herself through building this.** The product and the founder's personal learning journey are the same thing. Keep this alignment in mind when prioritizing features: content depth and pedagogical correctness matter as much as commercial polish.

**Core product identity:** "Palate — your pocket sommelier school." An interactive, gamified-but-not-childish learning experience for people **between beginner and casual drinker** — not total novices, not enthusiasts. Interactive was explicitly chosen over "beautiful reference guide you flip through." Theoretical/educational content was explicitly chosen over building around a real, purchasable wine inventory (at least for now).

---

## 2. Target Audience & Market Positioning

- Primary audience: wine beginners to casual drinkers, self-directed learners.
- **Russian-speaking users are a real target, not a hypothetical.** This is why bilingual EN/RU support was prioritized early, and why hosting provider choice was researched specifically for Russia network accessibility (see §4). Do not treat the RU locale as a nice-to-have — it shaped infrastructure decisions.
- Explicit differentiation goal: **must not resemble Vivino.** This came up twice, unprompted, from Marina's own outside perspective/market awareness — first about UX general feel, then specifically about the color palette. Treat "does this look like Vivino" as a standing design constraint, not a one-time fix. See §5 and §11.

---

## 3. Product Philosophy — Learning Design Principles

These were argued out in detail during the Train Your Nose module design (the richest design discussion in the project) and should generalize to **every future learning module** (Flavour Wheel, First Bottle Guide, Quiz, Regions):

- **Action before theory.** Every exercise/lesson should open with "do this," not "here's why." Reading time should always be shorter than doing time.
- **It's a workout, not a test.** No wrong answers. Curiosity over correctness. Never make the user feel judged or graded on sensory perception, which is inherently subjective.
- **Comparison is easier than identification.** Multiple exercises are deliberately structured as "smell A vs B" rather than "name this smell," because that's an established, easier cognitive task.
- **Cited authority, softly delivered.** Content should be traceable to real sources (WSET, Court of Master Sommeliers, Jancis Robinson, Wine Enthusiast, peer-reviewed olfactory science — specifically Prof. Thomas Hummel's smell-training protocol) but must **never read like a research paper.** This was a specific, hard-won lesson — see §20.
- **Encourage, never lecture.** Short encouragement/motivation cards inserted between exercises are a deliberate mechanic (borrowed and adapted from a "Duolingo for wine" framing Marina explicitly liked), not filler.
- **Milestone framing over streaks/gamification-for-its-own-sake.** "What you should notice now" cards at the end of each week were added specifically to give tangible, non-numeric progress markers. Streaks, push notifications, and a stats dashboard were **explicitly deferred to V2** — don't build them into MVP scope without revisiting this decision with Marina.

---

## 4. Platform & Hosting Decisions (with rationale)

### Web app, not native
Explicitly decided in favor of a responsive website over a native iOS/Android app. Marina's stated reasons: easier to find hosting, no app-store approval friction, "looks like an easy start." I (Claude) agreed but raised honest counterarguments that remain relevant if the product grows: no offline access without PWA work, weaker "home screen" feel than a real app, and limited/inconsistent push notification support on iOS. **Mitigation already built in:** PWA manifest + service worker, so the app is installable and has basic offline caching. Revisit native only if push notifications or offline-at-a-cellar-with-no-signal become real user complaints.

There was a moment of genuine confusion worth remembering: Marina asked "is React + Vite an app or web-based?" — the resolution was that React/Vite is a *build tool* that outputs a normal website; "web app" vs "app" is a spectrum of interactivity, not a different category. If future contributors get this confused again, this framing resolved it cleanly.

### Netlify, not Vercel or Cloudflare Pages
Actively researched (web search, not assumption) because of the Russia-accessibility concern in §2. Findings at the time: Vercel custom domains were reported blocked in Russia; Cloudflare Pages was the worst option (Russian ISPs throttling all Cloudflare traffic to ~16KB/connection since June 2025, a deliberate state-level action); Netlify had the best track record of actively trying to stay accessible. **This is a snapshot in time** — if Russia network policy changes, or Netlify's situation changes, this should be re-researched, not assumed permanent.

### Demo mode instead of live AI (temporary, not a design choice)
Marina does not currently have a paid Anthropic API account. Rather than block progress, the Tasting Planner runs on **5 hand-written sample plans + a keyword matcher** (`src/data/samplePlans.js`), deliberately built to return the **exact same JSON shape** the real AI call would return. This is a load-bearing convention: any future demo/mock content must match the real API's output shape so swapping back is a near-zero-diff change. The real AI code path (`services/ai.js`, `netlify/functions/ask-sommelier.js`) is fully written and intentionally left commented-out/unused in `Planner.jsx`, marked with `// Real AI version` comments. **This is the single highest-leverage pending task** — see §16.

---

## 5. Design System — Visual Identity Decisions

### Palette journey (this took several rounds — don't re-litigate lightly)
1. **Original:** wine red (#993556) + cream. Built first, used for weeks.
2. **Rejected:** Marina's own research/instinct flagged this as too close to Vivino's look (white cards, red accent, same layout rhythm).
3. **Explored and rejected — dark editorial** (near-black background, gold accent): Marina's feedback was explicit — "too dark (depressive), difficult to read greyed text." Do not revisit a predominantly dark theme without addressing text contrast concerns head-on.
4. **Explored and rejected — warm "summer" terracotta/orange:** Marina does not like orange as a primary color. Rejected outright, no ambiguity.
5. **Explored — green vs navy alternatives**, then Marina supplied her own reference image (`Palettes_examples.png`) with four named, fully-specified palette options (Burgundy / Deep Plum / Forest Green+Burgundy / Charcoal+Wine Red).
6. **Final decision: Forest Green + Burgundy** (option 3 from her reference). This is now the locked palette:

| Token | Hex | Role |
|---|---|---|
| `--forest` | `#264D3B` | Primary — hero backgrounds, primary actions, active states |
| `--forest-dark` | `#1A3528` | Hover/darker variant |
| `--forest-light` | `#E4EDE0` | Tinted backgrounds, active-lesson highlight |
| `--burgundy` | `#7A2038` | Secondary accent — CTA buttons, wine-card left borders |
| `--burgundy-dark` | `#521526` | Hover variant |
| `--gold` | `#B98A3D` | Tertiary accent — tips, difficulty dots, "new" moments |
| `--cream` | `#F7F4EF` | Page background (warm parchment, not pure white) |

**Known minor inconsistency, not yet resolved:** `--gold-light` and `--burgundy-light` currently share the identical hex value `#F5EDE0`. This was never flagged or intentionally decided — worth a deliberate pass to differentiate them or confirm the overlap is fine.

### Typography
Cormorant Garamond (serif, often italic for hero titles) for display/headings; Inter for body text. This pairing was compared favorably against Vivino/Notion/Linear/Stripe references and kept throughout every redesign round — it's stable, not up for debate.

### Structural differentiation from Vivino (as important as color)
After the palette-alone fix still "looked like Vivino" per Marina's feedback, the deeper fix was **structural**: a full-width gradient hero card (not white-card-on-white-background), Roman numerals instead of dots/checkmarks for module ordering, and burgundy used only as an accent inside cards rather than as the dominant background color. **Lesson: color alone doesn't differentiate a UI; layout rhythm and card structure matter more.**

### Home hero background image
The vineyard photo (`my_photo_wineyard.jpg`) is **Marina's own personal photograph**, not stock art — worth knowing for future asset/licensing questions. It's applied at ~7% opacity with `mix-blend-mode: luminosity` to create a subtle engraving effect, per an explicit spec Marina provided (a written frontend implementation brief + reference mockup image). **Undecided:** whether this same background treatment should extend to the Learn/Planner/Journal hero cards for visual consistency, or stay unique to Home. Not discussed either way.

---

## 6. Architecture Decisions & Rationale

- **Single Zustand store, not multiple stores.** All app state (module completion, exercise-level progress, journal entries, planner history, preferences, seen-intro-cards, module scroll/tab position) lives in one `useAppStore.js` with `persist` middleware to localStorage. This was a deliberate simplicity choice over Redux or split stores — the app is not complex enough yet to need it, and a single store made the "does X module see Y module's data" architecture conversation (early in the project, when Marina asked for architecture advice) resolvable in one sentence.
- **Why the architecture conversation happened at all:** early modules were built as standalone chat-widget prototypes (Visualizer tool), not real app code. Marina explicitly asked "what's needed to not step into shaky ground of disconnected, badly-communicated blocks" — this triggered the decision to stop building throwaway widgets and scaffold a real React app with shared state, shared components, and one AI service layer. **This is why some early content (flavor wheel, quiz) exists only as old chat-widget code and was never ported into the real repo — see §20.**
- **Generic, reusable progress-tracking primitives were deliberately added to the store** (`exerciseProgress`, `modulePosition`, `seenIntroCards`) rather than building Nose-module-specific state. Intent: the Flavour Wheel, First Bottle Guide, and Quiz modules should **reuse these same store mechanisms** for any step-based or one-time-intro-card UI, not reinvent local component state. This was an explicit design intent stated while fixing Nose module bugs, not just an implementation detail.
- **i18n architecture:** `en.json` is the master key structure; `ru.json` must always be an exact structural mirror, even while untranslated (currently contains English placeholder text for every key). The convention established: when adding any new UI string, add it to both files with the same key path in the same commit — never let them drift structurally. AI-generated content (Planner output) does *not* use the JSON translation files; instead `services/ai.js` takes a `lang` parameter and asks Claude to respond directly in the target language. These are two different translation mechanisms for two different content types — don't conflate them.
- **Netlify Functions chosen over exposing the API key client-side**, specifically to keep the Anthropic key server-side once billing is set up. This function is written and deployed but currently receives no traffic (demo mode is active instead).

---

## 7. Coding Conventions Agreed

- Learn sub-modules live in `src/pages/learn/` as their own files (`Walkthrough.jsx`, `Nose.jsx`) rather than being inlined in `Learn.jsx`. Future modules (Wheel, Bottle, Quiz) should follow this same file placement.
- CSS custom properties defined once in `index.css` under `:root`, referenced via Tailwind's arbitrary-value syntax (e.g. `text-[var(--forest)]`) rather than extending Tailwind's theme config. This was simply how it evolved, not a deeply argued decision — but it's now consistent across every file and should stay that way for consistency's sake.
- Demo/mock data lives in `src/data/`, strictly separated from `src/services/` (real API calls). Any temporary/placeholder logic should be commented with an explicit marker of what to swap it for later (the codebase uses `// Real AI version (uncomment when ready)` as the convention) — continue this pattern for any future temporary implementation.
- Store schema changes bump the `persist` version number (currently `2`). Convention: bump this whenever the store's shape changes in a way that could break old localStorage data.

---

## 8. Naming Conventions

- Component files: PascalCase, one page-level component per file.
- Module identifiers used consistently across store, routing, and translation keys: `walkthrough`, `nose`, `wheel`, `bottle`, `quiz` (lowercase, no hyphens). Any new module should pick a similarly short lowercase id and use it identically in `MODULE_IDS`, the router path, and the i18n key namespace — these three currently must stay in lockstep manually; there's no single source of truth enforcing it (a risk — see §14).
- Local project path on Marina's machine: `~/My_PROJECTS/palate/palate-site` — **corrected** after a real deployment session revealed the originally-documented path (`~/z_PROJECTS/palate`) no longer existed; the folder was renamed and nested one level deeper, inside a general "everything palate-related" parent folder that also holds reference docs, an old Word deploy guide, and other loose files. This is **her own custom convention**, not a default Claude suggested — always verify with `pwd` / `ls` rather than assuming a documented path is still current.

---

## 9. UI/UX Interaction Patterns Established

- **Sequential module unlocking on the Home page**: only the first uncompleted module is "active" (green border, "Continue" label); everything after it is visually locked with a lock icon and is *not* navigable (`onClick` is gated by `!isLocked`). **Known inconsistency, not yet resolved:** the `/learn` index page (reached via the bottom nav "Learn" tab) does **not** enforce this same locking — every module is tappable there regardless of completion state. This divergence between Home and Learn-index was never explicitly discussed or decided; it's an artifact of building the two screens at different times. Needs a deliberate decision: should locking be consistent everywhere, or is Home's "guided path" vs Learn's "browse freely" distinction intentional?
- **Difficulty indicator: dots, not stars**, with an explicit "Difficulty" text label in front. This was a direct fix to user feedback that stars read as a quality/review rating rather than a difficulty scale. **This convention should be reused for any future difficulty indicators** (e.g. if Quiz or Wheel ever need one) rather than reintroducing stars.
- **"Mark done" / "Done" explicit text button**, not an icon-only checkbox. Replaced an earlier small circular checkbox that Marina found "not obvious." This is now the standard completion-affordance pattern for step-based content going forward.
- **One-time intro/memo cards** (like the Nose module's frequency guidance) should show expanded on genuine first visit only, then collapse to a compact one-line expandable header on every subsequent visit — driven by the `seenIntroCards` store field, marked seen on mount (not only on manual dismissal, so navigating away without touching it still counts as "seen"). This was a specific fix for a real annoyance Marina flagged ("if you practice regularly this block in the head will irritate you a lot").
- **Any in-progress position within a multi-step module (active week/tab) must persist across refresh** — this is now handled via the generic `modulePosition` store field, keyed by module id. Apply this to any future multi-step module rather than using local component state for "which step am I on."

---

## 10. Trade-offs Explicitly Discussed

- **Web app vs native app**: chose ease of deployment/no app-store friction over offline-by-default and native push notifications. PWA is the compromise. (§4)
- **Demo-mode content vs real AI**: chose zero cost + immediate usability over infinite flexibility, with the explicit design constraint that the sample data must match the real API's shape so the eventual swap is nearly free. (§4)
- **My original "reference library" nose-training content plan (8 exercises, static, heavily cited) vs. externally-drafted "30-day coaching program" content (15 exercises, engaging daily-habit structure, uncited)**: resolved via an explicit hybrid — kept the coaching structure, tone, and weekly narrative arc from the external drafts, kept the citations and "why it works" depth from my original plan. This hybrid-decision process is itself a reusable pattern: **Marina frequently brings in externally-drafted specs/critiques (sometimes from another AI tool) and asks for an honest comparison rather than blind execution.** Expect this pattern to continue — when she pastes an external document, she wants genuine evaluation (pros/cons/verdict), not automatic agreement.
- **Source citation density on exercise cards**: an external reviewer suggested removing citations from exercise cards entirely into a separate reference section; I deliberately kept a **lighter** one-line source signal on each card rather than removing it entirely, because citation-visible-per-exercise was an explicit original design principle (see §3) and full removal would have undermined it. This was a case of accepting most of a review's feedback but pushing back on one point with reasoning — worth knowing this precedent exists.

---

## 11. Rejected Approaches & Why

- **Native app** — rejected for deployment friction (§4).
- **Vercel / Cloudflare Pages hosting** — rejected for Russia-accessibility risk (§4).
- **Dark editorial theme** — rejected: too dark/depressive, poor text contrast (§5).
- **Warm orange/terracotta theme** — rejected: Marina dislikes orange (§5).
- **Original wine-red/cream palette** — rejected: too close to Vivino (§5).
- **Stars for difficulty rating** — rejected: read as a quality/review score, not intensity (§9).
- **Small icon-only completion checkbox** — rejected: not obvious enough as an affordance (§9).
- **Building further chat-widget prototypes instead of a real app** — rejected once the app reached a certain complexity, specifically because of the "disconnected blocks" architecture risk Marina raised (§6).
- **Removing exercise-card citations entirely** (external reviewer's suggestion) — partially rejected; kept a lighter version (§10).
- **Single "continue lesson" card as Home's centerpiece** — explicitly approved as a mockup, then superseded before being coded in favor of the 4-plate dashboard (§23). Don't resurrect without checking this history first.
- **"Explore the wheel again" / generic replay button naming** — considered "drop a score" (Marina's suggestion), rejected in favor of "Start over" since nothing in these modules produces a literal numeric score (§23).
- **Auto-advancing Quiz questions on a timer** — how the very first chat-widget prototype worked; rejected in the real build in favor of an explicit "Next question" tap, matching every other module's interaction style (§23).

---

## 12. Assumptions Currently Baked In

- That Marina's GitHub username `marinaTur` and the repo `marinaTur/palate` remain the canonical identity for deploys — the whole documented deploy workflow hardcodes this remote URL.
- That the force-push-based git workflow is temporary/tolerable, not a long-term practice — see §14 for why this needs revisiting.
- That English is the default/fallback language and Russian is secondary-but-required — reflected in `fallbackLng: 'en'` and the placeholder-English strategy for `ru.json`.
- That demo-mode Planner content is acceptable to ship publicly in the interim, clearly labeled as such (a visible "demo mode" notice banner was deliberately added to the Planner UI so this is never presented as if it were live AI).
- That sequential module unlocking (Home page) reflects the intended pedagogical path (walkthrough → nose → wheel → bottle → quiz) — this ordering itself was never independently re-validated after the "Regions and grapes" module was dropped from the original 8-module plan (see §13); worth double-checking the 5-module sequence still makes the most pedagogical sense.

---

## 13. Roadmap: Original Vision vs Current State

The original architecture (proposed early, before any code existed) had **three pillars**:

1. **Learn to taste** — Tasting walkthrough ✅ built, Flavour wheel ⏳ placeholder, First bottle guide ⏳ placeholder
2. **Develop your nose** — Nose training ✅ built (rich, 4-week/16-exercise), Quiz ⏳ placeholder, **"Regions and grapes" module ❌ silently dropped** — it appeared in the original architecture diagram (10 essential wines, region maps, tasting profiles) but was never carried into the actual `MODULE_IDS` list in the built app. Nobody explicitly decided to cut it; it simply didn't make it into later iterations. Worth a deliberate decision: revive it, or confirm it's intentionally out of scope.
3. **Organize a tasting** — Tasting Planner ✅ built (demo mode), Tasting notes sheet — **partially built**. The original brief explicitly asked for "wine testing template for personal notes... with option to download or print." The Journal module supports logging structured notes, but has **no print or download/export function at all**. Only the Planner has a print button (basic `window.print()`, no dedicated printable template). This is a real gap against the original stated requirement, not just an unbuilt nice-to-have.

Also from the original vision: the **Journal/"Personal journal"** module was originally scoped to "log all past tastings, **search by wine or date**, **track your palate over time**." The built version supports add/view/delete only — no search, no filtering, no over-time visualization. This is a partial implementation, not a full one.

**Currently active build order** (organically emerged, not formally re-planned): Walkthrough → Nose → *(next: likely Wheel or First Bottle Guide, undecided which)*.

---

## 14. Unresolved Questions & Pending Decisions

This is the section to act on first when picking the project back up.

1. **Anthropic API billing** — still not set up. Planner remains in permanent demo mode until Marina gets a paid account. This is the single most consequential pending item; nearly everything else can proceed without it, but the product's core "AI sommelier" promise isn't live.
2. **Russian translations** — `ru.json` is structurally complete but contains English placeholder text throughout. No translation work has started.
3. ~~Git workflow fragility~~ — **RESOLVED, but not the way originally assumed.** The original failure mode (unzipping a full project bundle wiped `.git`, forcing `--force` pushes that broke Netlify's connection) hasn't recurred — see §22 for exactly why and what the current process actually is. Important nuance: this was *not* resolved by a full migration to a standalone Claude Code session with direct repo/git access. Based on observed tool behavior (an ephemeral bash sandbox with no push credentials, that resets between some sessions), work has continued to happen via the same claude.ai chat interface as always — Claude edits and verifies in a disposable sandbox, then hands over individual changed files for Marina to place into her real, persistent local repo and push herself. If a genuine Claude Code CLI session ever picks this project up with real local disk + git access, §22 describes the simpler direct workflow that becomes possible then — but confirm which situation actually applies before assuming.
4. ~~Home vs Learn-index locking inconsistency~~ — **MOOT.** Home no longer shows an individual lesson list at all (see §23) — it's a 4-plate dashboard now, so there's no locking behavior left on Home to be inconsistent with Learn's list.
5. **`gold-light` / `burgundy-light` sharing an identical hex value** (`#F5EDE0`) — likely unintentional, never flagged or resolved (§5).
6. **Module id / route / i18n key alignment has no single source of truth** — three separate places (`MODULE_IDS` arrays in Home.jsx and Learn.jsx, the router paths, and the `modules.*` i18n keys) must be kept manually in sync. No enforcement mechanism exists. Risk of drift as more modules are added. Note: Quiz has now deliberately broken this alignment on purpose (removed from `MODULE_IDS` in both files, route kept) — see §23 for why that's intentional, not drift.
7. **Whether to extract `Difficulty` and the "Mark done"/"Start over" buttons into shared `src/components/ui/` components** — they still live duplicated inside individual module files (`Nose.jsx`, `Wheel.jsx`, `Walkthrough.jsx`) rather than as shared components, even though the same patterns are now proven across three modules. Genuinely worth doing now, more than when first flagged.
8. ~~Which module gets built next~~ — **RESOLVED and then some.** Flavour Wheel, and Quiz are both now built (see §23). First Bottle Guide is the only Learn module left as a placeholder.
9. **"Regions and grapes" module** — still dropped from the original architecture plan, still never explicitly revived or confirmed cut. No change since it was first flagged.
10. **Journal print/export feature** — never built despite being in the original brief. Needs a decision on scope (simple print button like Planner's, or a proper per-wine printable tasting sheet template as originally described).
11. **Journal search/filter and palate-over-time tracking** — originally scoped, never built. Still wanted, or descoped?
12. **Home hero background image treatment (vineyard photo)** — extend to other page heroes for consistency, or keep unique to Home? Still never discussed; Home has since been redesigned twice more without this coming up.
13. **GitHub Personal Access Token storage** — Marina's token was accidentally committed and had to be revoked multiple times during setup. She was advised to store any future token in the Mac Keychain rather than a file, but this was never confirmed as actually done.
14. **First Bottle Guide** — now the *only* remaining placeholder Learn module. No content plan, research pass, or design mockup has been done for it yet, unlike Wheel/Nose/Quiz which all got a dedicated planning session before being built. This should be next.
15. **Quiz's route location** — kept at `/learn/quiz` for now to minimize routing churn, even though it's conceptually fully independent from "Lessons" as of the dashboard redesign (§23). Whether it should move to a top-level `/quiz` route someday is an open, low-priority cosmetic question — deliberately not decided either way yet.
16. **Whether the 4-plate Home dashboard (Plan / Journal / Lessons / Quiz) is truly final** — it was explicitly approved ("yes, I like it"), but worth noting for calibration: the *previous* single-"continue card" Home design was also explicitly approved the same way, then superseded before being built (§11). Approval in this project has sometimes been provisional rather than final — don't assume the dashboard is untouchable just because it was liked.

---

## 15. Future Ideas (explicitly deferred, not scheduled)

From the Train Your Nose PRD discussion, explicitly labeled "V2" and deliberately excluded from MVP:
- Daily streak tracking
- Push/daily reminder notifications
- Seasonal exercise rotations (spring herbs, summer berries, autumn mushrooms, winter spices)
- A statistics dashboard (exercises completed, days practiced, average confidence, longest streak, favorite aroma family)
- "Grocery mode" — auto-generated shopping list of today's practice ingredients
- "Blind mode" — hide ingredient names, reveal after guessing
- An "Aroma Memory" review feature to revisit past exercises

From the original three-pillar architecture, not yet built:
- Wine regions & grapes reference module
- A dedicated printable/downloadable tasting-notes template (beyond the current basic Journal form)

---

## 16. Constraints

- No paid Anthropic API access at present — treat all AI-powered features as demo/mock until this changes (§14, #1).
- Marina is a non-developer (analyst). Any instructions requiring terminal use must be extremely explicit, step-by-step, with expected output shown ("what you should see"), and should proactively anticipate common failure points (missing Node.js, Xcode Command Line Tools prompts, vim confusion during git operations, GitHub token/password confusion). Do not assume familiarity with any CLI concept, however basic it may seem.
- Hosting must remain accessible from Russia — factor this into any future infrastructure decisions (CDNs, third-party embeds, analytics scripts, etc.), not just the original Netlify-vs-Vercel choice.

---

## 17. Things Not to Change Without Discussion

- The Forest Green + Burgundy palette and its hex values (§5) — arrived at after multiple rejected rounds; don't casually "improve" it without going through the same comparison process.
- The Cormorant Garamond + Inter typography pairing.
- The structural differentiation from Vivino (hero-card layout, Roman numerals, accent-not-dominant burgundy) — color changes alone are not sufficient differentiation; don't let future redesigns drift back toward a white-card/red-accent look.
- The demo-mode sample-plan JSON shape matching the real AI service's output shape exactly — this is what makes the future API swap low-risk.
- The bilingual EN/RU architecture and the en.json/ru.json structural-mirror convention.
- The "action before theory," "no wrong answers," cited-but-not-academic tone established for learning content (§3, §20) — apply to all future modules, not just Nose.
- **Quiz's exclusion from `completedModules` and from the Lessons directory/count** (§23) — deliberate, not an oversight. Don't re-integrate it "for consistency."
- **Deriving `finished` directly from the store** (`completedModules.includes(id)`) rather than local `useState` — now the standard pattern across Walkthrough, Nose, and Wheel (§23). Use it for any future module's completion flag.
- **No auto-advancing, timed UI anywhere in this app** — every module, including Quiz, requires an explicit tap to proceed (§23). This is a cross-cutting rule, not a per-module style choice.
- **"Start over" as the standard reset-button name** for any module with a completion state that needs restarting (§23) — for naming consistency, don't introduce a different word for the same action in a future module.

---

## 18. Lessons Learned During Development

- **Widgets built in a chat interface are not a substitute for a real app.** Isolated interactive prototypes (built with the Visualizer tool) are great for validating an idea fast, but Marina correctly identified the risk of "disconnected, badly-communicated blocks" before it became a real problem. The lesson: move to a real, shared-state codebase as soon as more than one screen needs to talk to another.
- **Force-pushing git history is a recurring source of pain for a non-developer**, both because it breaks Netlify's connection and because rewriting history (attempted once via `git rebase -i`) is genuinely dangerous territory for someone unfamiliar with `vim` or git internals. A safer, non-destructive deploy workflow should replace the current one. **Update: this stopped recurring** once the practice shifted from "unzip a full project bundle and replace the whole folder" to "Claude hands over just the specific changed file(s), Marina places them into her already-intact local repo and runs a plain `add / commit / push`." See §22 for the honest account of why — it's not because Claude gained direct git access, it's because the repo on Marina's machine simply stopped being wiped and recreated every update.
- **Secrets management needs to be taught explicitly, not assumed.** A GitHub token was accidentally committed to the repo multiple times (as a literal file), triggering GitHub's push protection each time and requiring token revocation. The eventual root cause was that a literal token file existed in the project directory (not just pasted into a terminal prompt as intended). Any future credential-handling instructions should double-check nothing gets written to disk unintentionally.
- **Tone review revealed a real, correctable pattern in my own content writing**: an external review of the Tasting Walkthrough content caught language that was accurate but overly academic ("the complexity of a finish is directly related to how many flavour compounds..."; "it increases the wine's surface area dramatically..."), plus one outright factual overstatement ("tannin only present in red wines" — false; also present in orange wines, skin-contact whites, and via oak). The fix in every case was to **describe the sensory experience, not the underlying mechanism**, and to be precise rather than absolute in scientific claims (e.g. "creates new olfactory neurons" was softened to "supports the brain's ability to distinguish and remember smells" after review). **This tone lesson should be actively applied when writing any future educational content in this app**, not just treated as a one-time fix to the Walkthrough module.
- **Color alone does not solve a "looks like a competitor" problem — structure does.** Worth remembering the next time a competitive-differentiation concern comes up for any part of the UI, not just the home page.

---

## 19. Recurring Preferences Marina Has Expressed

- Wants **very plain, jargon-free, step-by-step instructions** for anything technical/operational ("give me a guide as for a kid"), including explicit "what you should see" confirmations at each step.
- Values **content accuracy and real citations** for educational material — explicitly asked for exercises to be "possible to practice at home, without special equipment," with "training effect proofed by wine experts, popularised by professional sommelier school."
- Frequently brings in **externally-drafted specs, mockups, or critiques** (sometimes apparently from another AI tool) and wants an **honest, critical comparison** against Claude's own proposal — not automatic deference to either source. Expect this pattern to continue; when she pastes an external document, produce a genuine pros/cons/verdict, including pushing back where warranted.
- Likes to **see visual comparisons before committing** — palette options, layout mockups — before any code is written for a significant UI change. This became a standing rule: **always ask "show layout preview, or proceed straight to build?" before building anything new or significant.** Small text/content edits (copy fixes, bug fixes) don't require this check — only new components or meaningfully different layouts do.
- Wants **honest counterarguments, not just agreement**, when Claude endorses one of her decisions (explicitly asked "can you give anything against this?" after proposing the web-app-over-native-app direction).
- Is currently **cost-conscious** (no paid API account) but treats this as a temporary constraint to design around, not a permanent limitation — build demo-mode fallbacks that are easy to upgrade later, don't compromise the "real" design because of it.
- Cares about **genuine product differentiation**, not surface-level uniqueness — pushed back multiple times when something merely looked different from Vivino but didn't feel structurally different.

---

## 20. Draft Content That Exists Only in Chat History (not in the repo)

These were built as early standalone chat-widget prototypes **before** the real codebase existed, and were never ported into actual module files. They represent real content work that would otherwise be lost.

### Flavour Wheel — six aroma categories (drafted content, not yet built as a real module)
1. **Fruit** — dark fruit (blackcurrant, plum, cherry), red fruit (raspberry, strawberry), citrus, stone fruit, tropical
2. **Earth** — wet stone, chalk, clay, forest floor, mushroom, smoke
3. **Oak** — vanilla, toast, cedar, coconut, caramel, dill
4. **Floral** — violet, rose petal, lavender, jasmine, elderflower
5. **Spice** — black pepper, clove, cinnamon, star anise, licorice
6. **Other** — leather, tobacco, coffee, chocolate, dried herbs, hay, honey, petrol (specifically noted in aged Riesling)

Each category had a short explanatory paragraph in the original widget (e.g. earth/mineral notes framed as "terroir in a glass," oak notes explained as coming from barrel aging with American vs French oak character differences). This is a solid starting point for the real Wheel module rather than starting from zero.

### Quiz — four questions (drafted content, not yet built as a real module)
1. What does "tannin" refer to? (Correct: a grippy, drying sensation on gums/cheeks — not sweetness, not carbonation, not alcohol warmth.)
2. What does a "long finish" indicate? (Correct: flavors persisting many seconds after swallowing — not fermentation time, sweetness, or alcohol content.)
3. Why do sommeliers swirl before smelling? (Correct: aerates the wine and releases volatile aromatic compounds — not cooling, not checking sediment, not mere tradition.)
4. What color shift indicates an aging red wine? (Correct: bright purple-ruby shifting to brick-orange at the rim — not yellow-to-gold, not clear-to-cloudy, not pink-to-red.)

Each had a brief explanation of the correct answer. Reasonable starting content for the real Quiz module.

### First Bottle Guide — no draft content exists
Unlike Wheel and Quiz, no static content was ever drafted for this module. The only artifact is the `getFirstBottleGuide()` function schema in `services/ai.js`, intended to have the AI recommend one accessible beginner wine and generate a step-by-step guided tasting for it. Building this module for real will require either activating live AI (§14 #1) or hand-writing demo content in the same style as `samplePlans.js`.

---

## 21. Reference Facts

| Item | Value |
|---|---|
| GitHub repo | `github.com/marinaTur/palate` |
| GitHub username | `marinaTur` |
| Live site | `verdant-dodol-3d12df.netlify.app` |
| Local project path (Marina's Mac) | `~/My_PROJECTS/palate/palate-site` (corrected — see §23) |
| Deploy trigger | Push to `main` → Netlify auto-builds (`npm run build` → `dist/`) — see §22 for the full current process |
| Primary palette | Forest `#264D3B` / Burgundy `#7A2038` / Gold `#B98A3D` / Cream `#F7F4EF` |
| Typography | Cormorant Garamond (display) + Inter (body) |
| Languages | English (complete), Russian (structure ready, untranslated) |
| Modules built | Tasting Walkthrough, Train Your Nose, Flavour Wheel, Quiz — see §23 |
| Modules placeholder-only | First Bottle Guide (the only one left) |
| Module silently dropped from original plan | "Regions and grapes" — still unresolved, see §23 |

---

## 22. GitHub & Deployment Workflow — What Actually Happens

**Read this before assuming how code gets from Claude to the live site.** An earlier version of this note described an aspirational "Claude Code has direct repo access" workflow. That has **not** been confirmed to actually be the case in the sessions since this doc was first written — based on observed tool behavior (a bash sandbox with no git push credentials, that sometimes resets between sessions and requires re-cloning from GitHub), work has continued to happen through the same claude.ai chat interface as the rest of this project. Here is what has actually, reliably worked:

### The real process
1. Claude edits files inside its own disposable sandbox (typically cloned fresh from `github.com/marinaTur/palate`, sometimes hard-reset to match `origin/main` if the sandbox had stale uncommitted work from an earlier session).
2. Claude runs the real build (`npm install && npm run build`) inside that sandbox to verify changes actually compile, and where practical, runs isolated logic tests (plain `node -e "..."` scripts) to verify things like shuffle algorithms or state-reset logic behave correctly *before* claiming they work.
3. Claude hands over **only the specific changed file(s)** — not a full project zip — via downloadable outputs.
4. Marina places those files into her real, persistent local repo at `~/My_PROJECTS/palate/palate-site` (see the corrected path above), replacing the existing files in place.
5. Marina runs the plain three-command loop herself, directly in Terminal:
   ```
   git add -A
   git commit -m "description of what changed"
   git push
   ```
6. Netlify's GitHub continuous-deployment integration picks up the push automatically and redeploys — no manual dashboard step.

### Why this avoids the earlier force-push problem, honestly
The original failure mode (documented in §14 and §18) happened because Claude could only deliver a **full zip of the entire project**, which Marina had to unzip and use to replace her whole local folder — destroying the hidden `.git` directory every time, forcing a `git init` + `--force` push cycle that kept breaking Netlify's connection. That stopped happening once the practice shifted to handing over **individual changed files** instead of a full zip. Marina's actual repo, sitting on her own Mac, was simply never being wiped and recreated anymore — nothing about Claude's own access changed. If a real standalone Claude Code CLI session ever does pick this project up with genuine local disk and git access, the workflow could simplify further (Claude committing and pushing directly) — but that has not been the observed reality in the sessions this document covers.

### Hard rules — still apply regardless of which workflow is active
- Never delete the `.git` folder.
- Never `git init` an already-initialized repo.
- Never `git push --force` for a routine update — only for a deliberate, explicit history rewrite Marina has specifically asked for and understood.
- Never write a GitHub token or API key into a file inside the repo (see §18 — this happened multiple times and had to be revoked each time).
- **Copy-paste commit messages directly rather than retyping them** — macOS apps like Notes and Pages silently convert straight quotes `"..."` into curly "smart quotes" `"..."`, which git does not recognise as quote characters at all. This caused a real failed commit (`git commit -m "..."` with curly quotes got parsed as several separate invalid pathspecs, one per word). The fix: type directly into Terminal, or paste straight from Claude's chat output, never through an intermediate app with autocorrect/smart-punctuation enabled.
- **Always verify actual file state after any interruption** — Claude's tools (bash, file view, file creation) went completely unavailable for a stretch mid-project. Claude handled it by writing code directly in chat text as a fallback and being transparent about not having verified it via a real build. When tools came back online, it turned out one new file described in chat had never actually been written to disk, and one small edit described in prose had never actually been applied — both had to be redone properly. **Lesson: never trust a prior chat message's description of "I made this edit" as proof it happened — re-check the actual file with `view`/`cat` before building on top of it, especially after any tool outage or session gap.**

---

## 23. Updates Since This Document Was First Created

Everything below happened *after* the initial version of this memory doc was written, in the same continued conversation. If anything here conflicts with an earlier section, **this section is more current.**

### Home page — redesigned twice more, landing on a real dashboard
The very first fix requested was cosmetic: shrink Home's oversized hero to match Learn's compact proportions, and unlock all lessons from first visit (remove the sequential-locking/lock-icon behavior entirely — every lesson became tappable immediately, with only a cosmetic "done / continue-here / not-yet-started" distinction remaining, never an actual gate).

That fix was barely live before Marina flagged something more fundamental: **Home and Learn had become almost identical** — both showing the same full 5-lesson list. She explicitly chose to keep Learn (the directory) and change Home (which should behave like a dashboard, not a second directory) — and asked Claude to push back if there was a good reason not to. Claude agreed with reasoning, not just deference: Learn's whole job is being reachable from anywhere without routing through Home; Home's job was always meant to be "what do I do next," not "browse everything."

**First redesign attempt (approved, then superseded — do not resurrect):** a single large "continue here" card showing just the next lesson, with a "View all lessons" link to Learn. This was shown as a mockup, explicitly approved ("yes, I like it"), but abandoned before being coded — Marina almost immediately asked for something more dashboard-like instead. This is a useful calibration point: **approval in this project has sometimes been provisional, not final.**

**Final redesign (built, current state): a 4-plate dashboard.** Home now shows four equal-weight tiles: **Plan a tasting** (burgundy), **My journal** (neutral), **Lessons** (forest-accented, showing "X of 4 complete" with a small built-in progress bar), and **Quiz** (gold-accented, standalone). The old "Continue learning" heading, the big 5-segment progress bar, and the full expanded lesson list were all removed from Home entirely — that content now lives only on the Learn tab, where it belongs.

### Quiz deliberately separated from "Lessons" — a product decision, not an inconsistency
Marina's reasoning: Quiz "is like in an entertainment" — it should feel like a fun, replayable trivia game, not the fifth step of a serious curriculum. This was implemented thoroughly, not just cosmetically:
- Quiz was removed from `LESSON_MODULES` on Home (no longer counted in "X of 4 lessons complete").
- Quiz was removed from `MODULE_IDS` in `Learn.jsx` — it no longer appears in the Learn tab's lesson list at all.
- The `/learn/quiz` route was deliberately **kept working** — it's reachable only via its own dedicated dashboard tile on Home now. This was a conscious choice to avoid routing churn, not an oversight; whether it should eventually move to a top-level `/quiz` path is still open (§14).
- **If a future instance sees Quiz "missing" from a lesson list or completedModules, this is intentional — do not "fix" it by re-adding Quiz back into the Lessons tracking.**

### A share feature was added to Home
A share icon button sits in the hero's top row, next to the language switcher. It uses the native Web Share API (`navigator.share()`) where available — opening the OS share sheet (Messages, WhatsApp, Mail, etc.) — and falls back to copying the site URL to the clipboard with a brief checkmark confirmation on browsers that don't support it (mostly desktop). **This is now the established pattern for any future "share" feature anywhere else in the app** (e.g. if sharing a specific Journal entry or Planner result is ever requested) — reuse this same approach rather than inventing a new sharing mechanism.

### A real bug found via a screenshot: gold was overriding green
Marina caught this precisely: on the Tasting Walkthrough, once the module was fully finished, the step you happened to be viewing still showed **gold** ("in progress") instead of green ("done"), because the coloring logic only checked "is this step before the one I'm currently viewing," never "has the whole module already been finished." The fix, applied consistently: `isDone = finished || i < currentStep` — once finished, every step shows as done regardless of which one is on screen. Only "Start over" (see below) reverts this. **This was the correct, general fix — apply the same `finished ||` guard to any future step-based progress indicator**, not just patch the one screenshot.

The same feedback also caught a **structural** styling bug: Walkthrough's progress bar lived in its own full-width strip with sharp corners, outside the standard `px-4`-wrapped, rounded-and-bordered card treatment every other block on the page uses. Fixed by folding it into the same wrapper and giving it the same `rounded-xl border` treatment as its sibling cards. **General lesson: when a block looks "off" compared to its neighbors, check whether it's sitting outside the page's standard content wrapper before assuming it needs new styling — often it just needs to join the existing wrapper.**

### A consistent "completion" pattern established across all three curriculum modules
Starting with Wheel, then explicitly extended by Marina's request to Walkthrough and Nose Training, three fixes became the standard pattern for any module with a completion state:

1. **No full-page "you're finished" takeover.** All three modules previously swapped their *entire* content for a separate congratulations screen, hiding the actual interactive material. Now, finishing shows a small inline gold notice near the top of the page, while every interactive element underneath (the wheel, the steps, the exercises) stays fully visible and usable. A person can keep exploring after "finishing" — this matters especially for Wheel, which is meant to be a returned-to reference tool, not a one-time course.
2. **A "Start over" button**, same name used consistently across all three modules (considered and rejected "drop a score" as a name, since nothing in these modules produces a literal numeric score). Clicking it un-marks the module as complete and resets its own progress — Wheel clears its 6 category-explored flags, Nose clears all 16 exercise flags and returns to Week 1, Walkthrough resets to step 1. Each reset was verified in isolation to touch *only* its own module's keys in the shared store, leaving other modules' progress untouched.
3. **`finished` is now derived directly from the store** (`completedModules.includes(moduleId)`) in all three modules, never kept as separate local `useState` initialized once from the store. This eliminated a whole class of state-desync bugs (the local copy silently going stale). **Apply this same derived-state pattern to First Bottle Guide, or any future module with a completion flag — don't reintroduce local state that mirrors the store.**

A new generic store action, `unmarkModuleComplete`, was added specifically to support "Start over" — symmetric with the existing `markModuleComplete`, and reusable by any future module needing the same reset behavior.

**Quiz deliberately does not follow this pattern, and that's correct, not an inconsistency.** Quiz was never added to `completedModules` at all, has no "Start over" button, and no completion notice. Its own "Play again" button on the results screen already serves the equivalent purpose in a way that fits its nature far better — a replayable trivia game doesn't need "mark complete" semantics the way a linear, one-time curriculum module does. **Do not add Quiz to `completedModules` or give it a "Start over" button to "match" the other three modules — this would work against its intended design.**

### Quiz was built — content, mechanics, and the reasoning behind each choice
16 questions were written, deliberately spanning all three already-built modules (tagged and color-coded by source: Walkthrough, Nose Training, Wheel) rather than inventing a separate, disconnected question set — this reinforces the whole curriculum rather than testing it in isolation. Design decisions, each made for a specific reason:
- **5 questions drawn at random from the 16 each round**, with each question's answer order also shuffled — verified in isolated tests across multiple runs to confirm no duplicate questions within a round and correct tracking of the right answer after shuffling. This makes the quiz genuinely replayable rather than memorisable, matching its "entertainment" framing.
- **No auto-advance timer.** The very first chat-widget prototype (built long before the real app existed) auto-advanced to the next question after a fixed delay. The real module deliberately requires an explicit "Next question" tap instead, matching how every other module in the app already works — **no part of this app should auto-advance on a timer; this is a cross-cutting interaction rule, not just a Quiz-specific choice.**
- **Gold as the accent, not a new hero color.** Quiz needed to feel visually distinct as the "fun" feature, but rather than introduce a new palette color (which would violate the explicit "don't casually change the palette" constraint already in §17), it reuses **gold** — already the app's tertiary/accent color for tips, difficulty indicators, and badges — for its buttons, progress bar, and score display, while keeping the same forest-green hero treatment as every other Learn module for visual consistency.
- The existing `quizHighScore` / `setQuizHighScore` store fields — present since the very first version of the store, but unused until now — are what actually persist the best score across sessions. A natural v2 idea (not built, not scheduled): tracking more than just a single high score, e.g. a full attempt history or a per-source-module breakdown of strengths and weaknesses, and growing the question bank as more Learn modules ship.

### Tooling reliability — a real operational lesson, not a one-off
Partway through this work, Claude's code/file tools (bash execution, file viewing, file creation) became completely unavailable for a stretch, returning "tool not found" errors on every attempt. Claude's handling of this, worth repeating as a pattern for any future instance encountering the same thing:
- Said so plainly rather than pretending or silently retrying indefinitely.
- Kept making real progress anyway by writing the full, working source code directly in the chat as a fallback, so the work wasn't lost.
- Explicitly flagged that this hadn't been verified with a real build, unlike normal practice.
- Once tools came back online in a later turn, **did not assume the chat-described changes had actually landed** — re-checked the sandbox's real file state first, and discovered exactly this: one new file described in chat had never been written to disk, and one edit described in prose had never been applied. Both were redone properly and verified with a real build plus isolated logic tests before being declared done.

Separately, the sandbox environment itself was observed to sometimes reset between conversation turns, requiring a fresh `git clone` (or a `git fetch` + `git reset --hard origin/main`) to get back to a known-good state — and on one occasion, local uncommitted sandbox work conflicted with Marina's already-pushed changes, resolved by treating the GitHub remote as the authoritative source and discarding the stale local sandbox state rather than trying to merge it.

### A documented fact turned out to be wrong — worth a general reminder
The very first version of this memory doc recorded Marina's local project path as `~/z_PROJECTS/palate`. During a later deployment session, `cd` into that exact path failed — the folder had been renamed and moved a level deeper, to `~/My_PROJECTS/palate/palate-site`, sitting inside a broader personal folder that also holds an old Word deploy guide, reference documents, and other loose files. **General lesson: treat any documented file path, credential, or environment fact as something to verify with a quick `pwd`/`ls` check when it actually matters, not as permanently reliable just because it was true once.**

### Planner redesigned — scenario picker replaces the free-text form
"Plan a tasting" was renamed to "Plan your tasting" (both the Home tile and the Planner page's own hero title, kept in sync deliberately — a user tapping one shouldn't land on a page with different wording). While touching that tile, a real bug was found and fixed: its icon class was `ti-wine`, which **does not exist anywhere in Tabler's icon set** — confirmed by grepping the actual compiled `tabler-icons.css`, not assumed. It had been rendering invisible in production. Fixed to `ti-glass` (verified real the same way). See the general lesson about this in Known Issues.

The bigger change: Planner's primary interaction moved from "fill a form → click Generate → wait → see result" to a **one-tap scenario picker** — 5 curated demo plans shown as cards, tapping one shows its full result instantly (no artificial delay; these are local, not a network call). The tapped card shows a distinct selected state (2px burgundy border + a checkmark badge), and tapping a different card swaps the result immediately.

The original free-text form (wines/foods/season/guests, `matchSamplePlan()` keyword matching) is **not deleted** — it's still fully wired in the code, just visibly disabled (muted colors, `disabled` attributes on every field, a "Coming soon" tag) since the scenario picker replaced it as the primary path. This was a deliberate choice, discussed explicitly: keeping dormant-but-working code intact, clearly marked, so re-enabling it later (or wiring it to live AI once billing is set up) is a small diff, not a rebuild — same philosophy as the existing `// Real AI version (uncomment when ready)` convention.

### Wheel rebuilt as a two-ring wheel
Marina's ask was blunt: the existing single-ring pie-chart Wheel "looks very boring." Rather than just adding animation on top of the same flat pie, the fix was structural — Wheel now genuinely resembles the real, printed wine aroma wheels this module was always modeled on: an **inner ring of the 6 families** (unchanged colors) and an **outer ring of all 15 specific aromas**, each outer wedge sized proportionally to its family's aroma count (so Fruit's 5 aromas get visibly thinner wedges than everyone else's 2 — structure that's actually informative, not just decorative).

Tapping the outer ring jumps straight to that one aroma's detail, skipping the "browse the family first" step — genuinely new capability, not just a paint job. Tapping the inner ring still works exactly as before (browse a family, expand multiple aromas to compare), preserving the original multi-expand behavior for people who want to browse rather than jump. The center hub now shows dynamic text reflecting whatever's currently selected instead of a static "Tap a category" label. Outer wedges later got short name labels added too (first word only for the tightest wedges, same truncation convention already used on the inner ring), reusing each category's own color for the label text against its lighter wedge fill — the same light-background/saturated-text pairing the `Badge` component already uses elsewhere.

**A preview-prototype lesson worth repeating:** before writing any real code, an actual tappable HTML/JS prototype of the two-ring concept was built and shown in chat, letting Marina test the real interaction (not just look at a static picture) before committing to the rebuild. This caught a real concern early — the thinnest outer wedges (Fruit's 12° slices) looked potentially cramped for a thumb to tap — which was flagged and accepted as a known trade-off before any code was written, rather than discovered after.

### Regions — a new 5th Learn module, built from scratch, with a real selection system
This was the largest single addition to the app. The full arc, because the reasoning matters more than the final list:

**Placement and the "boring reference content" problem.** Marina correctly placed Regions in Learn, not Home, matching the existing module pattern. Her real concern was deeper: reference content (facts about wine regions) risks reading like a boring textbook chapter, and she initially proposed solving that with achievements/badges. That was gently pushed back on with reasoning, not just deference: this app's own established positioning already explicitly rules out "excessive streaks/badges/leaderboards" as feeling too gamified/childish for this audience (see §17-ish design-system reasoning), and the actual reason Wheel/Nose don't feel boring isn't a reward layer — it's that they're interactive/exploratory rather than passive reading. The eventual fix leaned into that: make Regions something you *explore* (a real two-ring-style structure, just applied to geography instead of aroma taxonomy) rather than dress up static text with a reward system.

**Selection system — four options were laid out, not just one recommendation:** Market Reality (rank by real-world sales volume), Grape-First (teach ~10-12 grapes, attach regions to them), Category Coverage (fill every slot on a real wine list), and Tiered Curriculum (a different kind of thing entirely — not a selection method, but a sequencing layer that sits on top of whichever selection system is chosen). Marina picked **Grape-First + Tiered Curriculum on top**, explicitly wanting a system, not another round of ad-hoc curation — she'd caught, correctly, that the *first* pass at picking regions (before any system existed) was "basically random," missing Prosecco and Chile despite both being huge in the real world.

**The research got genuinely rigorous, per an explicit "all data should be proven" instruction.** Grape variety and appellation-count questions were investigated using OIV's official *Focus 2017* report and Kym Anderson's academic wine-economics dataset (University of Adelaide) — real findings: ~10,000 total grapevine varieties exist worldwide, but only ~1,368 make wine commercially (Jancis Robinson's *Wine Grapes*, 2012), and just 13 varieties cover a third of world vineyard area, 33 cover half. **When asked how many varieties would be needed to reach 80% coverage, the honest answer was that no source publishes that number** — OIV's report stops at 33/50%, and nobody has published the full list of all 33 names either, just the headline statistic repeated everywhere. Two different reasonable extrapolation models (logarithmic vs. power-law) gave answers roughly 2x apart (~95 vs. ~175), which was reported as genuine uncertainty rather than picking one number and presenting it as fact. **This is worth preserving as a standard to hold future work to: when a source doesn't say something, say so plainly rather than filling the gap with a plausible-sounding invented number.**

**Content grew in several honest, request-driven waves, not one pass:** an initial curated ~10 (5 Old World + 5 New World) → expanded to 15 after Marina specifically asked for Riesling (Germany *and* Austria, since the contrast between them is the point), the Primitivo/Zinfandel DNA-mystery story, and Malbec's actual ancestral home (Cahors), which the original 10 never covered despite including Mendoza → expanded further after "Prosecco and Chile are missing" (added Conegliano Valdobbiadene and, eventually, Maipo Valley/Chile anchored to Carmenère) → expanded again to add Vinho Verde, Carmenère, Gewürztraminer, Zweigelt, and Muscat by direct request → a final systematic pass mapped every remaining grape in the working list to a verified home region wherever possible, adding Côtes du Rhône (filling in Grenache and Mourvèdre, which had been supporting-cast mentions with no home of their own), Alsace, Asti, Burgenland, Chinon, Cognac, Abruzzo, and Priorat. **Final count: 26 regions, 19 Old World + 7 New World** — a genuinely different scope than "a curated top 10," flagged explicitly as such rather than let it balloon silently.

**One judgment call, handled by asking rather than deciding unilaterally:** Zweigelt's real-world creator, Fritz Zweigelt, was a documented Nazi collaborator. Rather than silently including or silently omitting this, the finding was surfaced directly with three options (skip the biography and use a different story, one neutral sentence, or full context) and Marina chose to skip it — the shipped content instead uses the grape's actual parent-grape breeding story and a genuinely fun naming mix-up (it was originally called "Rotburger," confused for decades with an unrelated German grape called "Rotberger"). **If a future instance is tempted to "complete" Zweigelt's entry with biographical detail, don't — this was a deliberate, discussed omission, not a gap.**

**A real bug was caught during the build, not before:** Maipo Valley, Chile was initially miscategorized under "Old World" during a large content insertion (a copy-paste sequencing error, not a research error — the verified facts about Chile/Carmenère were always correct). Caught by a self-run structural consistency check after the fact, not by Marina — worth noting as a general practice: after any large content restructuring, re-verify categorical groupings mechanically (e.g. `grep` counts, membership checks) rather than trusting that a big edit landed exactly as intended.

**Final architecture decisions, all explicit, not defaults:** tiers (1/2/3) are a suggested order only, never gated — every region tappable any time, consistent with this app's "no judgment" principle. "Compare to" is used only where a connection is genuinely earned (roughly half the 26 regions have one; the rest stand alone deliberately rather than being forced into a weak pairing). Sources are kept internal-only — not shown anywhere in the actual app UI, matching how Nose Training already handles its WSET/CMS backing — a decision made explicitly, with options laid out, not assumed. A "Classification decoder" section was added as a genuinely distinct content type (not a region — explaining what AOC/DOC/DOCG/DO actually mean), prompted by Marina sharing an external article that turned out to describe **an outdated French classification system** (a 4-tier structure using "VDQS," which was abolished in 2012) — verifying that article against current sources rather than trusting it was itself a small example of the same "prove it" discipline applied throughout.

The full research trail (verified fact + source citation for every region and grape) lives in a standalone planning document generated during this work, not committed to this repo. If deep source-verification detail is ever needed again, ask Marina whether she still has it, rather than assuming `regions.js`'s facts are unsourced just because the code itself has no inline citations.

### A critical operational lesson: Claude's sandbox is not GitHub, and is not Marina's machine
This is the reason active development moved from claude.ai chat to Claude Code, and is worth recording as clearly as the "Tooling reliability" lesson above, because it's the same *category* of mistake and it actually happened.

When asked to "clone github.com/marinaTur/palate" and then build features, Claude cloned the repo into its own **sandboxed container environment** — completely isolated from both GitHub and Marina's actual laptop. Real work was done there (files edited, `npm run build`/`npm run lint` genuinely run and passing), but at no point was anything pushed to GitHub, and Claude has no credentials to do so even if asked. After a full round of changes and a "build it" confirmation, Marina ran `npm run dev` on her own machine and, correctly, saw no changes at all — because her local files had never been touched. **Claude had built something real, verified it thoroughly, and then failed to notice that "built" and "delivered" are not the same thing.**

The fix each time since: package the actual changed files (or, once, a git patch) into a downloadable zip with explicit plain-language instructions, and — after a related near-miss where "copy the whole src folder over" was suggested and Marina correctly caught that this risked deleting unrelated, untouched files, since the delivered zip's `src` folder was a small subset of her real one — the standing instruction became **individual file replacement only, never folder-level replacement**, with reasoning stated plainly (a single-file overwrite can't touch its siblings, on any OS; a folder-level replace might, depending on the OS's own merge-vs-overwrite behavior, which can't be safely assumed from here).

**If a future instance (in this chat interface, not Claude Code) is asked to clone and build against a real GitHub repo: assume nothing lands anywhere real until it's explicitly packaged and delivered as files, and default to individual-file delivery instructions, never "replace this whole folder."** Claude Code, working directly in Marina's actual project directory with real git access, does not have this specific problem — this note is here so a future *chat-interface* Claude doesn't repeat it, and so Claude Code itself understands why this document exists in its current, freshly-updated form rather than the stale version.

### Documentation went stale during a long, feature-heavy session — worth a general reminder
Both this file and `CLAUDE.md` were last meaningfully updated *before* the Planner redesign, the Wheel rebuild, and the entire Regions module were built — none of that work updated either document as it happened. They were brought current in one dedicated pass afterward, prompted by Marina asking for "correct context to migrate into Claude Code." The catch-up pass itself was thorough (every architecture convention, known issue, and interaction pattern touched by the session's work was checked against the actual current code, not written from memory) — but the better practice, worth holding future work to: **update these two files as part of the same piece of work that changes the code, not as a separately-scheduled cleanup pass.** A CLAUDE.md that's stale relative to the actual codebase is worse than no CLAUDE.md at all, since it actively teaches wrong assumptions with false confidence.


