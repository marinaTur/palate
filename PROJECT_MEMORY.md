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
- **Why the architecture conversation happened at all:** early modules were built as standalone chat-widget prototypes (Visualizer tool), not real app code. Marina explicitly asked "what's needed to not step into shaky ground of disconnected, badly-communicated blocks" — this triggered the decision to stop building throwaway widgets and scaffold a real React app with shared state, shared components, and one AI service layer. **This is why some early content (flavor wheel, quiz) exists only as old chat-widget code and was never ported into the real repo — see §22.**
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
- Local project path on Marina's machine: `~/z_PROJECTS/palate` — this is **her own custom convention**, not a default Claude suggested. Worth remembering if giving her file-path instructions in the future.

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
3. **Git workflow fragility** — the current deploy process (documented in a Word doc given to Marina) uses `rm`-and-reinit-git plus `git push --force` on every update, because unzipping a fresh project bundle wipes the `.git` folder. This has **repeatedly broken Netlify's GitHub connection**, requiring manual reconnection in Netlify's dashboard more than once already. This is a real recurring pain point for a non-developer to troubleshoot alone and should be fixed properly (e.g., a workflow that doesn't require deleting `.git` every time, or clearer guidance on avoiding `--force`) before it happens again.
4. **Home vs Learn-index locking inconsistency** — see §9. Never explicitly decided whether module locking should be consistent across both entry points.
5. **`gold-light` / `burgundy-light` sharing an identical hex value** (`#F5EDE0`) — likely unintentional, never flagged or resolved (§5).
6. **Module id / route / i18n key alignment has no single source of truth** — three separate places (`MODULE_IDS` arrays in Home.jsx and Learn.jsx, the router paths, and the `modules.*` i18n keys) must be kept manually in sync. No enforcement mechanism exists. Risk of drift as more modules are added.
7. **Whether to extract `Difficulty` and the "Mark done" button into shared `src/components/ui/` components** — they currently live locally inside `Nose.jsx` only. Given the explicit intent that future modules reuse these patterns (§9), they arguably belong in the shared component library now rather than being duplicated per-module.
8. **Which module gets built next** — Flavour Wheel and First Bottle Guide are both still placeholders; no decision has been made on build order between them.
9. **"Regions and grapes" module** — revive from the original architecture plan, or confirm it's cut? (§13)
10. **Journal print/export feature** — never built despite being in the original brief. Needs a decision on scope (simple print button like Planner's, or a proper per-wine printable tasting sheet template as originally described).
11. **Journal search/filter and palate-over-time tracking** — originally scoped, never built. Still wanted, or descoped?
12. **Home hero background image treatment (vineyard photo)** — extend to other page heroes for consistency, or keep unique to Home? Never discussed.
13. **GitHub Personal Access Token storage** — Marina's token was accidentally committed and had to be revoked multiple times during setup. She was advised to store any future token in the Mac Keychain rather than a file, but this was never confirmed as actually done.

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

---

## 18. Lessons Learned During Development

- **Widgets built in a chat interface are not a substitute for a real app.** Isolated interactive prototypes (built with the Visualizer tool) are great for validating an idea fast, but Marina correctly identified the risk of "disconnected, badly-communicated blocks" before it became a real problem. The lesson: move to a real, shared-state codebase as soon as more than one screen needs to talk to another.
- **Force-pushing git history is a recurring source of pain for a non-developer**, both because it breaks Netlify's connection and because rewriting history (attempted once via `git rebase -i`) is genuinely dangerous territory for someone unfamiliar with `vim` or git internals. A safer, non-destructive deploy workflow should replace the current one.
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
| Local project path (Marina's Mac) | `~/z_PROJECTS/palate` |
| Deploy trigger | Push to `main` → Netlify auto-builds (`npm run build` → `dist/`) |
| Primary palette | Forest `#264D3B` / Burgundy `#7A2038` / Gold `#B98A3D` / Cream `#F7F4EF` |
| Typography | Cormorant Garamond (display) + Inter (body) |
| Languages | English (complete), Russian (structure ready, untranslated) |
| Modules built | Tasting Walkthrough (5 steps), Train Your Nose (4 weeks / 16 exercises) |
| Modules placeholder-only | Flavour Wheel, First Bottle Guide, Quiz |
| Module silently dropped from original plan | "Regions and grapes" |
