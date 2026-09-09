# PROJECT_MEMORY.md — Palate

**Current as of:** 2026-09-09

This document captures the *why* behind current product state, key decisions, and design principles. **Full development history, rejected alternatives, and detailed decision rationale:** See `PROJECT_MEMORY_archive01.md` (only if you need historical context; do NOT read it at session start).

---

## Project Vision & Constraints

**Palate is a wine tasting education app** — not a wine recommendation engine, not a cocktail app, not a wine-buying assistant. This was an explicit choice:

- **Wine recommendation engine** — rejected as too narrow and heavily competitive.
- **Cocktail recommendation + recipes** — larger market, but Marina didn't want to build it.
- **Wine tasting guide/school** (chosen) — largest audience (learners, not just buyers), multiple revenue streams, strong shareability, **and Marina wants to learn wine herself through building this.** The product and founder's learning journey are aligned.

**Core identity:** "Your pocket sommelier school." Interactive, educational, designed for people **between absolute beginner and casual drinker** — not novices, not enthusiasts.

**Target audience:** Wine beginners to casual drinkers, self-directed learners. **Russian-speaking users are a real target, not hypothetical** — this is why bilingual EN/RU support was prioritized early and why hosting was researched specifically for Russia network accessibility. Treat RU locale as strategic, not nice-to-have.

**Design constraint:** Must not resemble Vivino (brought up unprompted by Marina twice — once about feel, once about palette). Treat as a standing design principle, not a one-time fix.

---

## What's Actually Built

**Learn modules (5 complete):**
- **Walkthrough:** Interactive tasting intro (auto-completes)
- **Nose:** 4-week, 16-exercise smell identification training
- **Wheel:** Two-ring aroma taxonomy (6 families + 15 aromas)
- **Bottle:** Red/white/sparkling/fortified comparison (auto-completes when all 4 tapped)
- **Regions:** 27 wine regions + 27 grapes, two browse modes

**Other modules:**
- **Home:** 4-plate dashboard (Plan / Journal / Lessons / Quiz)
- **Planner:** Demo mode, 5 curated tasting scenarios (free-text form wired but disabled, "Coming soon")
- **Journal:** Log tasting notes; add/view/delete only (search/filter/export not yet built)
- **Quiz:** 16 questions, source-module color-coded, fully replayable

---

## Recent Changes (2026-09-09)

**Analytics Re-enabled:** Yandex Metrica analytics and cookie consent banner now live. 
- Cookie banner shows on first visit, gates Yandex Metrica script loading
- Privacy Policy page fully implemented (bilingual EN/RU) and route now reachable
- GTM (Google Tag Manager) remains intentionally blocked
- Age gate overlay background changed to transparent (was forest green)

---

## UX Principles — Learning Design

These principles were established during Nose module design and should apply to every future learning module:

- **Action before theory.** Every exercise opens with "do this," not "here's why." Doing time always > reading time.
- **No wrong answers.** Curiosity over correctness. Never make the user feel judged or graded on subjective sensory perception.
- **Comparison over identification.** Multiple exercises deliberately structured as "smell A vs B" rather than "name this smell," because comparison is cognitively easier.
- **Cited authority, softly delivered.** Content traceable to real sources (WSET, Court of Master Sommeliers, Jancis Robinson, Wine Enthusiast, peer-reviewed olfactory science, Prof. Thomas Hummel's smell-training protocol) but must **never read like a research paper.** This was a hard-won lesson.
- **Encourage, never lecture.** Motivation cards between exercises are deliberate mechanics (adapted from Duolingo pattern Marina liked), not filler.
- **Milestone framing over gamification.** "What you should notice now" cards at week-end mark tangible progress. Streaks, push notifications, and stats dashboard explicitly deferred to V2 — don't build them without revisiting with Marina.

---

## Design System

### Palette v1.1 (locked after multi-round iteration; do not change without discussion)

| Token | Hex | Purpose |
|---|---|---|
| `--forest` | `#264D3B` | Primary backgrounds, active states, hero elements |
| `--burgundy` | `#A02F49` | Secondary accent, CTA buttons, wine-card borders |
| `--gold` | `#B98A3D` | Tertiary accent, difficulty dots, tips, milestone markers |
| `--cream` | `#F7F4EF` | Page background (warm parchment, not pure white) |

**History:** Original palette (wine red + cream) was rejected by Marina as too close to Vivino. Dark theme explored and rejected (Marina: "too dark, difficult to read"). Warm terracotta rejected (Marina doesn't like orange). Marina supplied reference image with four named options; Forest Green + Burgundy chosen. Palette v1.1 refined for WCAG contrast and accessibility (lifted burgundy, added text-safe gold).

**Constraint:** Palette is stable. Don't casually "improve" without the same iterative process.

### Typography

Cormorant Garamond (serif, often italic for hero titles) for display/headings; Inter for body text. This pairing was compared favorably against Vivino/Notion/Linear/Stripe and kept throughout every redesign round — it's established, not up for debate.

### Structural Differentiation from Vivino

Color alone doesn't differentiate; **layout rhythm and card structure matter more.** Vivino uses white cards on white background; Palate uses full-width gradient hero cards, Roman numerals instead of dots, burgundy only as accent inside cards.

---

## Architecture Conventions

### State Management

- **One Zustand store** (`useAppStore.js`), not split stores. Generic primitives reused by every step-based module:
  - `modulePosition` — current step in multi-step modules, persists across refresh
  - `exerciseProgress` — progress within an exercise (e.g., smells identified in Nose)
  - `seenIntroCards` — which one-time intro/memo cards have been viewed
  - `completedModules` — array of finished Learn module ids
  - Everything persists to `localStorage` via Zustand's `persist` plugin

- **`finished` state must be derived directly from store,** not kept as separate `useState` initialized once from store. Standard pattern: `const finished = completedModules.includes(moduleId)`.

- **`unmarkModuleComplete`** backs every "Start over" button — same name across all modules for consistency.

### Data & Content

- **Demo/mock data strictly separate:** `src/data/` (content only), `src/services/` (real API logic).
- **Mock data must match real API's JSON shape exactly.** This is load-bearing: future AI swap will be near-zero-diff change. Current examples: `samplePlans.js`, `regions.js`, `bottleGuide.js`.
- **Real AI code fully written, intentionally left commented:** `services/ai.js`, `yandex/functions/ask-sommelier.js` (port from Netlify version). Marked with `// Real AI version (uncomment when ready)`. **This is the highest-leverage pending task** — awaiting API billing setup.

### Module Completion Patterns

- **Walkthrough:** auto-completes once all steps viewed (3+ sec dwell each). **No "Mark done" button.**
- **Nose, Wheel, Bottle:** explicit "Mark done" button + inline gold completion notice at top. **Bottle also auto-completes when all 4 types tapped.**
- **Quiz:** separate results screen with "Play again" button. **Deliberately NOT part of `completedModules` tracking** — it's standalone entertainment, not curriculum. Do not re-integrate without discussion.
- **"Start over":** standard name + behavior for resetting a finished module. Used by Nose, Wheel, Bottle. Does not apply to Walkthrough (no button) or Quiz (replayable by nature).

### Module Structure & Routing

- **Learn sub-modules live as standalone files in `src/pages/learn/`:** `Walkthrough.jsx`, `Nose.jsx`, `Wheel.jsx`, `Bottle.jsx`, `Regions.jsx`, `Quiz.jsx` — not inlined in `Learn.jsx`.
- **`src/constants/modules.js` (`LEARN_MODULES`) is the single source of truth.** Home's lesson tiles, Learn's directory, and routes all derive from it. To add a new Learn module:
  1. Add one entry to `LEARN_MODULES`
  2. Register its component in `Learn.jsx`'s `MODULE_COMPONENTS` map
  3. Add its i18n keys to both `en.json` and `ru.json`
  4. Extend `src/utils/moduleProgress.js`'s switch statement to normalize its progress tracking
- **Module ids** (lowercase, no hyphens) must be used identically in routing paths and i18n keys. Examples: `walkthrough`, `nose`, `wheel`, `bottle`, `regions`. (Quiz is intentional exception — deliberately excluded from automated tracking.)

### i18n

- **`en.json` is master structure; `ru.json` must mirror exactly,** even while untranslated (currently placeholder English).
- Add new UI strings to both files in the same commit.
- **Walkthrough is fully wired to `t()` calls** — use as the template for converting remaining modules (Nose, Wheel, Bottle, Regions, Quiz still hardcoded English).
- **AI-generated Planner content uses different mechanism:** `lang` param to Claude directly, not the `t()` system. Don't conflate the two.

### CSS & Theming

- **CSS custom properties defined in `index.css` `:root`**, referenced via Tailwind arbitrary values (`text-[var(--forest)]`), not Tailwind theme config.
- **`--nav-h` custom property:** set by `Layout.jsx` via `ResizeObserver` on mobile bottom nav; exposes nav's real rendered height. Bottom-docked mobile controls should read `var(--nav-h, <fallback>)` to position just above it. Naturally `0px` on desktop (nav is `md:hidden`).

### Mobile-First Baseline

- **Mobile-first, no exceptions.** No desktop sidebars, multi-column detail panes, or hover-driven interactions.
- Desktop works via centered, capped-width container.
- Full reasoning in `MOBILE_LAYOUT_CONVENTION.md`.

---

## Interaction Patterns — Established & Reusable

- **Difficulty:** dots with a text label, not stars (stars read as quality ratings)
- **Completion button:** explicit "Mark done"/"Done" text, never icon-only checkboxes. **Exception:** Walkthrough auto-completes; Bottle auto-completes when all 4 types tapped
- **Finishing a module:** inline gold notice at top of page, not a full-page takeover. Module stays fully interactive underneath
- **"Start over":** standard name + behavior across Nose, Wheel, Bottle
- **One-time intro/memo cards:** expanded on first visit only, collapsed thereafter. Marked seen on mount via `seenIntroCards`
- **Multi-step module position:** persists via `modulePosition` store field, keyed by module id
- **Demo/curated pickers:** one-tap-to-result, not fill-form-then-submit. Tapped option shows visual selection (border + checkmark). Example: Planner's scenario picker
- **Features that exist in code but aren't available:** shown visibly disabled ("Coming soon") with `pointer-events-none` + muted colors, not hidden or deleted. Planner's custom form is the example
- **Cross-referencing between content:** real tap/navigate, not just text mention. Example: Regions' "Compare to" button navigates to target region
- **Share functionality:** uses native Web Share API (`navigator.share()`) where available, falls back to clipboard copy. Standard pattern for any future share feature

---

## Hosting & Deployment

**Decision rationale:** Migrated from Netlify (US) to Yandex Cloud (Russia) due to geopolitical access issues. Russian users experienced 500ms+ latency / timeouts on Netlify; Yandex provides ~60ms local latency. This is why hosting provider choice was researched specifically for Russia accessibility.

**Current setup (complete as of 2026-08-22):**
- **Frontend:** Yandex Cloud Object Storage (`palatelearn.ru` bucket, Hosting mode) + `palatelearn.com` (Redirect mode → `.ru`, HTTPS)
- **Backend:** Yandex Cloud Functions (`ask-sommelier`, Node.js 22, 128 MB, 60s timeout)
- **Domains:** Registered via Beget; DNS kept on Beget (not migrated to Yandex Cloud DNS)
- **HTTPS:** Certificates validated via DNS `_acme-challenge` CNAME records (auto-renew if records stay in place)
- **CI/CD:** GitHub Actions builds and syncs `dist/` to S3-compatible API on every push to `main`

**Known fragile pieces (currently unmonitored):**
- **Apex A-records:** pointing at manually-looked-up Yandex IP address (Yandex doesn't guarantee stability; Beget has no ANAME/ALIAS record type, so apex can't use hostname alias)
- **HTTPS auto-renewal:** depends on `_acme-challenge` CNAME records staying in Beget DNS — if removed, certs expire silently after 90 days
- **DNS/HTTPS monitoring:** not yet built. Marina to decide between GitHub Actions workflow (DNS + cert-expiry check) or free-tier monitor service (Domain Sentry, LetsMonitor, etc.)

See CLAUDE.md for complete hosting migration context.

---

## Pending Decisions & Open Work

**Critical (blocks product roadmap):**
1. **Anthropic API billing** — Planner stays demo-only until set up. **This is the single highest-leverage pending task.** Real AI code is written and ready; just needs activation.
2. **Russian locale translation** — `ru.json` structurally complete, 100% untranslated placeholder English.
3. **Remaining hardcoded i18n** — Nose, Wheel, Quiz, Regions, Bottle all hardcoded English; Walkthrough is template. Convert all 5 to use `t()` calls.

**High priority (nice-to-have, unblocking):**
4. **19 hardcoded hex literals** (in Wheel, Nose, Quiz, Bottle, Home) — left by Palette v1.1 rollout, deliberately deferred. Each needs judgment call on whether it should track brand palette or stay distinct. Not mechanical find-and-replace.
5. **Difficulty & Completion button UI components** — currently duplicated inside individual module files. Candidate for extraction to shared component, but only if the pattern is proven stable (which it is).
6. **Journal features not built:** search/filter, palate-over-time tracking, print/export
7. **Planner features not built:** free-text form (wired but disabled, "Coming soon")
8. **Wheel expansion:** Vegetative and Chemical aroma families planned as additions (6→8 families). **Ask "preview first or build?" before starting** — Marina's standard decision pattern.

**Lower priority (parked pending approach decision):**
9. **DNS/HTTPS monitoring for Yandex Cloud** — choose between GitHub Actions workflow or free-tier monitor service, then build. Marina will decide the approach.
10. Delete `src/App.css` (unused Vite scaffold, safe to remove)

---

## Things Not to Change Without Discussion

- **Palette:** Forest, Burgundy, Gold, Cream (v1.1 locked after multi-round iteration). Arrived at through deliberate process; don't casually "improve."
- **Typography:** Cormorant Garamond (display) + Inter (body) pairing established; keep it.
- **Design system:** Do not change colors, typography, or layout patterns without explicit discussion first.
- **Demo mock data:** Must match real API's output JSON shape exactly — future AI swap depends on this.
- **No live AI yet:** Planner stays in demo mode until Marina sets up Anthropic API billing. Do not replace demo content with live AI without explicit approval.
- **Quiz is deliberately NOT in Lessons:** It's standalone entertainment, not part of the curriculum. Do not re-integrate it into `completedModules` or Lessons list — this is intentional, not an oversight.
- **No auto-advancing timed UI anywhere:** Every module requires an explicit tap to proceed between steps/questions. Scoped exception: Walkthrough's *completion*, not navigation, is timer-gated based on step dwell time.
- **Do not add dependencies** without explaining the benefit first.
- **Do not refactor working code only for style reasons.**
- **Before deleting files:** explain why unused and confirm with Marina.
- **Before large changes:** show the proposed approach first.

---

## What Works Well — Proven Patterns

- **One Zustand store + `localStorage` persistence:** Simple, no complex cache invalidation. Scales cleanly as more modules added.
- **Generic primitives reused across modules:** `modulePosition`, `exerciseProgress`, `seenIntroCards` work at scale without duplication.
- **Demo mode fallback architecture:** Mock data structured to match real API output exactly. Future AI swap will be near-zero-diff change.
- **Module metadata centralization:** `LEARN_MODULES` + `moduleProgress.js` switch statement means adding new Learn module is straightforward: one data entry, one component registration, one switch case.
- **Bilingual structure ready:** `en.json`/`ru.json` both prepared; full Russian translation will be low-friction once decided.
- **Mobile-first baseline:** All interaction patterns scale naturally to desktop (centered, capped-width container). No responsive re-thinks needed.

---

## Working with Marina

- **Non-developer** (analyst by profession). Instructions must be plain, step-by-step, with explicit "what you should see" confirmations — never assume CLI familiarity.
- **"Preview first, or build straight?"** — for any new component/layout: ask before building. Small copy/bug fixes don't need this.
- **Wants honest comparison**, not automatic deference. If she brings external specs/mockups, give genuine pros/cons/verdict, including pushing back where warranted.
- **Cost-conscious** (no paid API account currently), but treats this as temporary — design demo fallbacks that upgrade cleanly, don't compromise real design because of it.
- **Wants honest counterarguments** when endorsing her own decisions, not just agreement.
- **Bilingual EN/RU support is a real requirement**, not nice-to-have — Russian users are a genuine target audience.
- **Hosting must stay accessible from Russia** — this shaped infrastructure choices (Yandex Cloud, not Netlify/Vercel).

---

## Reference Facts

| Item | Value |
|---|---|
| Project vision | Wine tasting education app (not recommendation engine, not cocktail app) |
| Audience | Casual wine drinkers (self-directed learners, not absolute beginners or professionals) |
| Owner | Marina Turkina |
| Live site | palatelearn.ru (palatelearn.com redirects) |
| Repository | github.com/marinaTur/palate |
| Learn modules (complete) | Walkthrough, Nose, Wheel, Bottle, Regions (5 of 5) |
| Bilingual support | EN fully built; RU structure ready (untranslated) |
| Demo pickers in scope | Planner (5 curated scenarios), Journal, Quiz |
| Real AI status | Code fully written, intentionally unused, awaiting API billing setup |
| Hosting | Yandex Cloud Object Storage + Cloud Functions |
| Analytics | Fully disabled (2026-08-31 explicit decision) |
| Design principle | Action before theory; no wrong answers; comparison over identification; cited authority, lightly delivered |
| Typography (locked) | Cormorant Garamond + Inter |
| Palette (v1.1, locked) | Forest Green + Burgundy + Gold + Cream |
