# CLAUDE.md — Palate

Wine tasting education app (not a recommendation/buying engine, not a cocktail app).
"Your pocket sommelier school." Audience: curious casual wine drinkers who want to build
confidence; avoid both absolute beginners who need basic alcohol education and advanced
enthusiasts seeking professional-level depth.
Full rationale, history, and open questions live in PROJECT_MEMORY.md — read it before
product/design/architecture decisions. This file is the quick operational reference.

## Stack
React 19 + Vite 8 · React Router 7 · Zustand 5 (+persist) · Tailwind 4 · i18next/react-i18next ·
vite-plugin-pwa · @anthropic-ai/sdk (server-side only, via Netlify Function)

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
  `exerciseProgress`, `modulePosition`, `seenIntroCards` — are meant to be reused by every future
  step-based module (Wheel, Bottle, Quiz), not reinvented as local component state.
- Bump the `persist` version number whenever the store shape changes in a breaking way.
- Demo/mock data lives in `src/data/`, strictly separate from `src/services/` (real API calls).
  Mock data must match the real API's output JSON shape exactly, so swapping to live AI is a
  near-zero-diff change. Mark temporary code with `// Real AI version (uncomment when ready)`.
- i18n: `en.json` is the master key structure; `ru.json` must always mirror it structurally, even
  while untranslated. Add new UI strings to both files, same key path, same commit. AI-generated
  Planner content uses a different mechanism entirely (`lang` param passed to Claude directly via
  `services/ai.js`) — don't conflate the two translation systems.
- Learn sub-modules live as standalone files in `src/pages/learn/` (`Walkthrough.jsx`, `Nose.jsx`,
  and future `Wheel.jsx`/`Bottle.jsx`/`Quiz.jsx`), not inlined in `Learn.jsx`.
- Module id used identically (lowercase, no hyphens) across `MODULE_IDS`, router paths, and i18n
  `modules.*` keys — currently no single source of truth enforces this; keep them manually in sync.
- CSS custom properties in `index.css` `:root`, referenced via Tailwind arbitrary values
  (`text-[var(--forest)]`), not Tailwind theme config extension.

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
- One-time intro/memo cards: expanded on genuine first visit, collapsed thereafter, marked seen
  on mount (not just on dismiss) via `seenIntroCards`.
- Any multi-step module's current position must persist across refresh via `modulePosition`,
  keyed by module id — not local component state.

## Known issues / gaps (verified against code, not yet fixed)
- **Icons likely broken app-wide**: `ti ti-*` (Tabler Icons) classes are used throughout
  (Home, Layout, Learn, Journal, Walkthrough, Nose) but no Tabler Icons stylesheet/webfont is
  loaded anywhere — not in `index.html`, `index.css`, or `package.json`. Check before assuming
  any icon renders.
- PWA manifest (`vite.config.js`) references `/icon-192.png` and `/icon-512.png`; neither exists
  in `public/`.
- `src/App.css` is unused Vite-scaffold leftover, not imported anywhere — safe to delete.
- Home page enforces sequential module locking; `/learn` index does not — never deliberately
  decided whether this divergence is intentional.
- Wheel, Bottle guide, and Quiz are placeholder "Coming soon" screens only.
- Anthropic API billing not yet set up — Planner is currently in demo mode
  (`src/data/samplePlans.js` + keyword matcher) until resolved. This is the single most
  consequential pending item.
- Russian locale (`ru.json`) is structurally complete but 100% untranslated placeholder English.
- `Walkthrough.jsx` and `Nose.jsx` bypass i18n entirely (hardcoded English strings, not `t()`
  calls) — translating `ru.json` alone won't localize these two pages.

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
