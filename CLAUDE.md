# CLAUDE.md — Palate

Wine tasting education app (not a recommendation/buying engine, not a cocktail app).
"Your pocket sommelier school." Audience: curious casual wine drinkers who want to build
confidence; avoid both absolute beginners who need basic alcohol education and advanced
enthusiasts seeking professional-level depth.
Full rationale, history, and open questions live in PROJECT_MEMORY.md — read it before
product/design/architecture decisions. This file is the quick operational reference.

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
  `Wheel.jsx`, `Quiz.jsx` are all built now — `Bottle.jsx` is the only one left as a placeholder.
  Not inlined in `Learn.jsx`.
- Module id used identically (lowercase, no hyphens) across `MODULE_IDS`, router paths, and i18n
  `modules.*` keys — currently no single source of truth enforces this; keep them manually in sync.
  (Quiz is the intentional exception to this alignment — see above.)
- CSS custom properties in `index.css` `:root`, referenced via Tailwind arbitrary values
  (`text-[var(--forest)]`), not Tailwind theme config extension.
- Share functionality (Home's share button) uses `navigator.share()` where available, falling back
  to clipboard copy with a brief confirmation elsewhere. This is the established pattern for any
  future share feature — reuse it, don't invent a new mechanism.

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

**Still open:**
- `src/App.css` is unused Vite-scaffold leftover, not imported anywhere — safe to delete.
- Anthropic API billing not yet set up — Planner is currently in demo mode
  (`src/data/samplePlans.js` + keyword matcher) until resolved. This is the single most
  consequential pending item.
- Russian locale (`ru.json`) is structurally complete but 100% untranslated placeholder English.
- `Walkthrough.jsx`, `Nose.jsx`, `Wheel.jsx`, and `Quiz.jsx` all bypass i18n entirely (hardcoded
  English strings, not `t()` calls) — translating `ru.json` alone won't localize these four pages.
- First Bottle Guide is the only remaining "Coming soon" placeholder Learn module.
- `--gold-light` and `--burgundy-light` in `index.css` share the identical hex `#F5EDE0` — never
  intentionally decided, needs a pass.
- Module id/route/i18n-key alignment (`MODULE_IDS`, router paths, `modules.*` keys) has no single
  source of truth across the three places it's duplicated — manual sync only.
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
