# CLAUDE.md — Palate

Wine tasting education app (not a recommendation/buying engine, not a cocktail app).
"Your pocket sommelier school." Audience: curious casual wine drinkers who want to build
confidence; avoid both absolute beginners who need basic alcohol education and advanced
enthusiasts seeking professional-level depth.
**Read PROJECT_MEMORY.md now, in full, before doing anything else this session** — including
before responding to a request that looks purely mechanical (a typo fix can still collide with a
documented decision, e.g. §17's "don't change without discussion" list). This file is the quick
operational reference; PROJECT_MEMORY.md is the full rationale, history, rejected alternatives, and
open questions, and §23 there is the authoritative current state if the two ever conflict.
(PROJECT_MEMORY.md is currently ~440 lines / one Read call, once per session — flag to Marina if it
roughly doubles in length, since at that point the unconditional-read tradeoff should be revisited.)

## Stack
React 19 + Vite 8 · React Router 7 · Zustand 5 (+persist) · Tailwind 4 · i18next/react-i18next ·
vite-plugin-pwa · @anthropic-ai/sdk (server-side only, via Netlify Function) ·
@tabler/icons-webfont (bundled locally via npm import in `index.css`, not a CDN link —
see Known issues below for why this was added)

## Safety rules
- Do not replace demo/mock data with live AI without explicit approval.
- Do not change the design system (colors, typography, layout patterns) without discussion.
- Do not add dependencies unless the benefit is explained first.
- Do not refactor working code only for style reasons.
- Before deleting files, explain why they are unused and confirm.
- Before large changes, show the proposed approach first.

## Development workflow

Before modifying code:
1. Inspect current implementation.
2. Explain the proposed change.
3. Identify affected files.
4. Wait for approval for significant changes.

After changes:
- Explain what changed.
- Explain how to test it.
- Mention possible side effects.

## Memory discipline — never defer this
The goal: important knowledge survives both within a session and across sessions. The two docs
(this file + PROJECT_MEMORY.md) are the only mechanism for cross-session memory — nothing is
remembered unless it's written here.
- Any new decision, rejected alternative, convention, or non-obvious bug/fix worth remembering
  gets written into PROJECT_MEMORY.md (or this file, if operational) **in the same turn it
  happens** — not deferred to a later cleanup pass. A doc update is part of "done," not a
  follow-up task.
- Before ending work on any non-trivial change, confirm both docs still match the current code
  state. If they don't, fix that before considering the change finished.
- Never delete superseded sections in PROJECT_MEMORY.md — append a note that supersedes them
  instead (see §23's own header for the pattern). History of what was tried and rejected is itself
  important knowledge; deleting it is a memory loss, not cleanup.
- If a session was long/feature-heavy and docs were *not* updated as-you-go (it happens), the very
  next action is a dedicated catch-up pass checked against actual current code — never written
  from memory of what "should" have changed.
- When two sections conflict, the most recently added one wins (PROJECT_MEMORY.md §23 exists
  specifically as this kind of override marker) — but conflicts should be rare if the rule above is
  followed.

## Git workflow
- Before significant changes, ensure the current state is committed or clearly explain uncommitted changes.
- Prefer small focused commits with descriptive messages.
- Do not rewrite Git history unless explicitly requested.

## Design system — do not change without discussion
- Palette: Forest `#264D3B` (primary), Burgundy `#7A2038` (secondary/CTA), Gold `#B98A3D` (tertiary),
  Cream `#F7F4EF` (background). Arrived at after multiple rejected rounds (see PROJECT_MEMORY.md §5).
- Typography: Cormorant Garamond (display/headings, often italic) + Inter (body). Established
  pairing; do not change without discussion.
- Structural differentiation from Vivino matters as much as color: full-width gradient hero cards,
  Roman numerals for module ordering, burgundy as accent not dominant background. Don't drift back
  toward a white-card/red-accent look.
- Known unresolved bug: `--gold-light` and `--burgundy-light` share the identical hex `#F5EDE0` —
  never intentionally decided, needs a pass.

## Architecture conventions
- One Zustand store (`useAppStore.js`), not split stores. Generic primitives —
  `exerciseProgress`, `modulePosition`, `seenIntroCards` — are reused by every step-based module
  (Walkthrough, Nose, Wheel all use them now; apply to Bottle guide too when built). `Quiz` is a
  deliberate exception — see below.
- A module's `finished` state must be **derived directly from the store**
  (`completedModules.includes(moduleId)`), never kept as separate local `useState` initialized
  once from the store. This is now the pattern across Walkthrough, Nose, and Wheel — it eliminated
  a real class of state-desync bugs where the local copy silently went stale. Use this pattern for
  Bottle guide's completion flag too.
- `unmarkModuleComplete` (symmetric with `markModuleComplete`) backs every module's "Start over"
  button — same button name across all three modules with a completion state, by design.
- **Quiz is deliberately excluded from `completedModules`, from `LESSON_MODULES` on Home, and from
  `MODULE_IDS` in Learn.jsx.** It's treated as a standalone, infinitely-replayable feature ("more
  entertainment than curriculum" — Marina's framing), not a lesson. Its own `quizHighScore` /
  `setQuizHighScore` store fields (present since the store was first built, unused until Quiz was
  actually implemented) are what persist its best score. Its route stays at `/learn/quiz` and still
  works — it's just not listed in Learn's directory anymore. **If this looks like an inconsistency,
  it isn't — do not re-integrate Quiz into Lessons tracking.** Full reasoning in PROJECT_MEMORY.md §23.
- No auto-advancing, timed UI anywhere in the app — every module, Quiz included, requires an
  explicit tap to proceed. The very first prototype auto-advanced Quiz questions on a timer; the
  real build deliberately does not, to stay consistent with every other module.
- Bump the `persist` version number whenever the store shape changes in a breaking way.
- Demo/mock data lives in `src/data/`, strictly separate from `src/services/` (real API calls).
  Mock data must match the real API's output JSON shape exactly, so swapping to live AI is a
  near-zero-diff change. Mark temporary code with `// Real AI version (uncomment when ready)`.
- i18n: `en.json` is the master key structure; `ru.json` must always mirror it structurally, even
  while untranslated. Add new UI strings to both files, same key path, same commit. AI-generated
  Planner content uses a different mechanism entirely (`lang` param passed to Claude directly via
  `services/ai.js`) — don't conflate the two translation systems.
- Learn sub-modules live as standalone files in `src/pages/learn/`: `Walkthrough.jsx`, `Nose.jsx`,
  `Wheel.jsx`, `Quiz.jsx`, `Regions.jsx` are all built now — `Bottle.jsx` is the only one left as a
  placeholder. Not inlined in `Learn.jsx`.
- Region/grape reference content lives in `src/data/regions.js` — same `src/data/` convention as
  `samplePlans.js`, structured data only, no component logic. See "Regions module" section below
  for the selection system and conventions specific to this data.
- Module id used identically (lowercase, no hyphens) across `src/constants/modules.js`, router
  paths, and i18n `modules.*` keys. **`src/constants/modules.js` (`LEARN_MODULES`) is now the single
  source of truth** — `Home.jsx`'s lesson tile and `Learn.jsx`'s directory list + nested `<Routes>`
  all derive from it; don't hand-add a module id back into either file separately. To add a new
  Learn module: add one entry to `LEARN_MODULES`, register its component in `Learn.jsx`'s
  `MODULE_COMPONENTS` map, and add its `modules.<id>.label/.sub` keys to both i18n files — that's
  the whole checklist. (Quiz is the intentional exception to this alignment — see above; it isn't
  in `LEARN_MODULES` and its route is still hand-written in `Learn.jsx`.)
- CSS custom properties in `index.css` `:root`, referenced via Tailwind arbitrary values
  (`text-[var(--forest)]`), not Tailwind theme config extension.
- Share functionality (Home's share button) uses `navigator.share()` where available, falling back
  to clipboard copy with a brief confirmation elsewhere. This is the established pattern for any
  future share feature — reuse it, don't invent a new mechanism.

## Regions module — selection system & conventions
Built as the 5th Learn module (numeral V). Full research/verification trail (sources per fact,
alternate systems considered) lives in a standalone planning document that is **not in this repo**
— ask Marina for it if deeper source-checking is ever needed; don't assume the facts in
`regions.js` are unsourced just because the citations aren't inline in code.
- **Selection system: Grape-First.** Regions were chosen by starting from grapes that matter (verified
  against OIV's official variety-distribution data and Kym Anderson's academic dataset), then
  attaching each grape to its home region — not the reverse. Three other systems (Market Reality,
  Category Coverage, plain curation) were explicitly considered and rejected; don't re-litigate this
  choice without a real reason, but the reasoning is fully documented in the external planning doc.
- **26 regions, 19 Old World + 7 New World** — this grew organically from an original curated ~10,
  each addition driven by a specific gap (a missed grape, a broken "Compare to" pairing, a direct
  request like "we missed Prosecco/Chile/Riesling"), not scope creep for its own sake. Don't assume
  this number is "the curated set" in the original small sense — it's a considered, larger scope.
- **Tiers (1/2/3) are a suggested order, never a gate.** Every region is tappable at any time,
  consistent with the "no judgment, no locking" principle already established for Wheel/Nose. Do
  not add locking/gating logic to "match" the tier concept — that would contradict why it exists.
- **"Compare to" is only used where genuinely earned** (same grape confirmed via DNA/history, or a
  direct historical/myth-bust connection) — roughly half the regions stand alone by design. Resist
  the urge to force a pairing onto every region "for completeness"; a weak invented comparison was
  explicitly rejected in favor of leaving some regions standalone.
- **Sources are internal-only, not shown in the app UI** — explicit decision, matching how Nose
  Training already handles its WSET/CMS backing (stated confidently on-screen, cited nowhere
  visible). Don't add a "Sources" footer or citations to the Regions UI without re-confirming this.
- **Classification decoder is a distinct content type, not a region** — reference material (what
  AOC/DOC/DOCG/DO actually mean), gold-accented like the app's existing "tip" styling rather than
  the white region cards, and deliberately excluded from the 26-region explore/progress count.

## UX principles (apply to every current and future learning module)
- Action before theory — exercises open with "do this," not "here's why."
- It's a workout, not a test — no wrong answers, no judgment on subjective sensory perception.
- Comparison ("smell A vs B") over identification ("name this") wherever possible.
- Cited authority (WSET, CMS, Jancis Robinson, peer-reviewed olfactory science), delivered lightly —
  never academic-sounding. Describe the sensory experience, not the underlying mechanism.
- Encourage, don't lecture. Milestone framing over streaks/gamification.
- Deferred to V2, don't build without revisiting: streaks, push notifications, stats dashboard.

## Established interaction patterns — reuse, don't reinvent
- Difficulty = dots with a text label, not stars (stars read as a quality rating).
- Completion = explicit "Mark done"/"Done" text button, not an icon-only checkbox.
- Finishing a module = an inline notice near the top of the still-fully-interactive page, never a
  separate full-page takeover that hides the module's content. All three curriculum modules
  (Walkthrough, Nose, Wheel) follow this; Quiz doesn't need it (see Architecture conventions above).
- "Start over" = the standard name and behavior for resetting a finished module back to its
  first-open state (un-completes it, clears its own progress keys only, never touches other
  modules' progress). Same name across all three modules — don't introduce a different word for
  the same action in a future module.
- One-time intro/memo cards: expanded on genuine first visit, collapsed thereafter, marked seen
  on mount (not just on dismiss) via `seenIntroCards`.
- Any multi-step module's current position must persist across refresh via `modulePosition`,
  keyed by module id — not local component state.
- **Demo/curated-content pickers use one-tap-to-result**, not a fill-a-form-then-submit flow.
  Established by Planner's scenario picker: tapping a curated option shows its result immediately
  (no separate "Generate" click), with the tapped option visually marked (border + checkmark, not
  just a color change). Reuse this for any future "pick from a curated set" feature.
- **A feature that exists in code but isn't available yet is shown, not hidden** — visibly disabled
  (muted colors, `disabled` attributes, `pointer-events-none`) with a "Coming soon" tag, rather than
  removed from the UI or deleted from the code. Planner's custom free-text form follows this after
  the scenario picker replaced it as the primary path — the old `matchSamplePlan`/`generate()` logic
  is kept fully wired, just inactive, so re-enabling later is a small diff, not a rebuild.
- **Cross-referencing between pieces of content is a real tap, not just a text mention.** Regions'
  "Compare to" and any future equivalent should actually navigate/scroll to the referenced item when
  tapped, established via Regions jumping between Old World/New World and scrolling to the target.

## Wheel — now a two-ring design, not a single pie
Rebuilt from a flat 6-wedge pie into a two-ring wheel: inner ring is the 6 aroma families (same
colors as before, unchanged), outer ring is all 15 subcategories, each outer wedge sized
proportionally to how many aromas its parent family has (Fruit's 5 vs. everyone else's 2, visible
at a glance). Tapping the outer ring jumps straight to that specific aroma's detail — tapping the
inner ring still opens the family for browsing multiple aromas, unchanged from before. The center
hub shows dynamic text reflecting whatever's currently selected, rather than a static label. Outer
wedges carry short name labels (first word only, same truncation convention as the inner ring).

## Known issues / gaps (verified against code)

**Fixed since this file was first written — verified, not assumed:**
- ~~Icons likely broken app-wide~~ — **confirmed true, then fixed.** `ti ti-*` (Tabler Icons)
  classes were used throughout with no icon stylesheet/webfont ever loaded — every icon on every
  screen was rendering invisible. Fixed by installing `@tabler/icons-webfont` via npm and importing
  `tabler-icons.css` in `index.css` (bundled locally through Vite's own asset pipeline, not an
  external CDN link — deliberate, given this project's documented caution about third-party CDN
  reliability, especially for Russia accessibility). Verified post-build: 5,175 icon rules compiled
  into the output CSS with correct unicode content values, and the actual font files (woff2/woff/ttf)
  present in `dist/assets/`. Adds real weight — the compiled CSS holds rules for the *entire* icon
  library, not just the ~30 icons this app actually uses. A worthwhile future optimization: subset
  to only the icons actually referenced, rather than shipping the full set.
- ~~PWA manifest icons don't exist~~ — **confirmed true, then fixed.** `vite.config.js` referenced
  `/icon-192.png` and `/icon-512.png`; neither existed in `public/`. The two SVGs that *did* exist
  there (`favicon.svg`, `icons.svg`) turned out to be unrelated generic starter-template leftovers
  (purple branding, social-media icon symbols — nothing to do with Palate), so they weren't
  rasterized. Generated simple, genuinely on-brand placeholder PNGs instead (forest-green
  background, gold wine-glass silhouette) at both required sizes — a real, working icon rather
  than a broken reference, though still a simple placeholder worth a proper design pass eventually.
- ~~Home's "Plan a tasting" tile icon was invisible~~ — **confirmed true, then fixed.** The tile used
  `ti-wine`, which does not exist anywhere in Tabler's icon set — confirmed by grepping the actual
  compiled `tabler-icons.css`, not by assumption. This is the exact same *class* of bug as the
  app-wide icon issue above (an icon class referenced that was never real), just a single isolated
  instance that slipped in later. Fixed to `ti-glass` (verified real). **General lesson: when adding
  or reviewing any `ti-*` class, grep it against the actual compiled CSS in
  `node_modules/@tabler/icons-webfont/dist/tabler-icons.css` before trusting it renders — guessing
  a plausible-sounding Tabler name is exactly how this bug happened the first time.**
- ~~Regions module never click-tested live in browser~~ — **confirmed the code logic was correct,
  then Marina click-tested live and confirmed it passes.** All 26 regions explorable, "Compare to"
  navigation (verified Bordeaux ↔ Napa, a genuinely reciprocal pairing) works, Complete module /
  Start over both behave correctly, Classification Decoder opens as its own card. No longer an open
  item — Regions is fully shipped and verified, not just build/lint-clean.
- ~~Module id/route/i18n-key alignment had no single source of truth~~ — **fixed.** Added
  `src/constants/modules.js` (`LEARN_MODULES`); this had already caused a real bug (`regions` was
  missing from Home.jsx's lesson tile, undercounting "X of Y complete"). See the Architecture
  conventions note above for how to add a module now.

**Still open:**
- `src/App.css` is unused Vite-scaffold leftover, not imported anywhere — safe to delete.
- Anthropic API billing not yet set up — Planner is currently in demo mode until resolved. This is
  the single most consequential pending item. **The demo-mode mechanism changed this session**: the
  primary path is now a one-tap scenario picker (5 curated plans, instant result, no form) rather
  than the original free-text-plus-keyword-matcher flow. The old form still exists in the code,
  visibly disabled with a "Coming soon" tag, `matchSamplePlan`/`generate()` kept fully wired but
  unreachable — re-enabling it later (or swapping in live AI) doesn't require rebuilding it.
- Russian locale (`ru.json`) is structurally complete but 100% untranslated placeholder English.
- `Walkthrough.jsx`, `Nose.jsx`, `Wheel.jsx`, `Quiz.jsx`, and `Regions.jsx` all bypass i18n entirely
  (hardcoded English strings, not `t()` calls) — translating `ru.json` alone won't localize these
  five pages. `Regions.jsx` follows this deliberately, matching its four siblings; the region/grape
  content itself in `regions.js` is English-only demo-style content, same reasoning as
  `samplePlans.js` — not an oversight to "fix" by adding i18n.
- First Bottle Guide is the only remaining "Coming soon" placeholder Learn module.
- `--gold-light` and `--burgundy-light` in `index.css` share the identical hex `#F5EDE0` — never
  intentionally decided, needs a pass.
- `Difficulty` and "Mark done"/"Start over" button styling still live duplicated inside individual
  module files rather than as shared `src/components/ui/` components, despite the pattern now
  being proven across three modules.

## Working with Marina
- Non-developer (analyst). Any terminal/technical instructions must be plain, step-by-step, with
  explicit "what you should see" confirmations — never assume CLI familiarity.
- Before building anything new or structurally significant (new component, new layout), ask
  "preview first, or build straight?" Small copy/bug fixes don't need this check.
- She often brings external specs/critiques (sometimes from another AI) and wants a genuine
  pros/cons/verdict, not automatic deference either way — including pushing back where warranted.
- Wants honest counterarguments when endorsing her own decisions, not just agreement.
- Cost-conscious (no paid API account currently) but treats it as temporary — design demo
  fallbacks that upgrade cleanly, don't compromise real design because of it.

For full history, rejected alternatives, unresolved decisions, and reference facts
(repo URL, live site, hosting rationale, roadmap vs. original vision), see PROJECT_MEMORY.md.
