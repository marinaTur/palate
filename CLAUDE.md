# CLAUDE.md — Palate

**Palate** is a wine tasting education app for curious casual wine drinkers — "Your pocket sommelier school." Not a recommendation engine, not a cocktail app.

> **Full history, design rationale, and rejected alternatives:** See `PROJECT_MEMORY.md`. **Archive of original CLAUDE.md:** `CLAUDE_archive01.md` (only read if you need historical context; do NOT read it at session start).

---

## Current Stack

React 19 + Vite 8 · React Router 7 · Zustand 5 (+persist) · Tailwind 4 · i18next/react-i18next · vite-plugin-pwa  
**Backend:** Yandex Cloud Functions (Node.js 22) — `yandex/functions/ask-sommelier.js`  
**Hosting:** Yandex Cloud Object Storage (`palatelearn.ru` primary, `palatelearn.com` redirects)  
**Icons:** `@tabler/icons-webfont` (bundled locally in `index.css`, not CDN)

**Analytics currently fully disabled (2026-08-31, Marina's explicit call) — GTM, Yandex Metrica, the consent banner, and the Privacy Policy route are all commented out, not deleted. Do not re-enable any of this without her explicit go-ahead.**

---

## Current State — What's Built

**Learn modules (5 of 5 complete):**
- Walkthrough (interactive tasting intro)
- Nose Training (4-week, 16-exercise smell identification)
- Wheel (two-ring aroma taxonomy, 6 families + 15 aromas)
- Bottle Guide (red/white/sparkling/fortified comparison)
- Regions (27 wine regions + 27 grapes, two browse modes)

**Other modules:**
- Home (4-plate dashboard: Plan / Journal / Lessons / Quiz)
- Planner (demo mode, 5 curated tasting scenarios)
- Journal (log tasting notes; add/view/delete only — no search/filter yet)
- Quiz (16 questions, source-module color-coded, replayable)

**Not yet built:** Planner free-text form (wired but disabled, "Coming soon"), Journal search/filter, Journal print/export.

---

## Safety Rules — Don't Change Without Discussion

- **Palette:** Forest `#264D3B` / Burgundy `#A02F49` / Gold `#B98A3D` / Cream `#F7F4EF`. Arrived at after multiple rounds of iteration; don't casually "improve" without the same process.
- **Typography:** Cormorant Garamond (display) + Inter (body). Established pairing; keep it.
- **Design system:** Do not change colors, typography, or layout patterns without explicit discussion first.
- **Demo mock data:** Match the real API's output JSON shape exactly — this makes the future AI swap low-risk. Mark temporary code with `// Real AI version (uncomment when ready)`.
- **No live AI yet:** Planner stays in demo mode until Marina sets up Anthropic API billing.
- **Do not replace demo content with live AI** without explicit approval.
- **Do not add dependencies** without explaining the benefit first.
- **Do not refactor working code only for style reasons.**
- **Before deleting files:** explain why unused and confirm.
- **Before large changes:** show the proposed approach first.
- **Quiz is deliberately NOT in Lessons:** It's standalone entertainment, not part of the curriculum. Do not re-integrate it into `completedModules` or the Lessons list — this is intentional, not an oversight.
- **No auto-advancing timed UI anywhere:** Every module requires an explicit tap to proceed between steps/questions. (Scoped exception: Walkthrough's *completion*, not navigation, is timer-gated based on step dwell time.)

---

## Architecture Conventions

- **One Zustand store** (`useAppStore.js`), not split stores. Generic primitives (`exerciseProgress`, `modulePosition`, `seenIntroCards`) are reused by every step-based module.
- **`finished` state must be derived directly from the store** (`completedModules.includes(moduleId)`), never kept as separate `useState` initialized once from the store. Standard pattern across all curriculum modules.
- **`unmarkModuleComplete`** backs every "Start over" button — same name across all modules for consistency.
- **Walkthrough auto-completes** once all steps are viewed (3+ second dwell each); no "Mark done" button. **Nose, Wheel, Bottle use explicit "Mark done" buttons.** Quiz is separate (results screen has its own "Play again").
- **`src/utils/moduleProgress.js`** normalizes each module's different progress tracking into a common `{ done, total }` shape for Learn's directory list. Extend its switch statement, not Learn.jsx directly, when adding a new module.
- **`src/constants/modules.js` (`LEARN_MODULES`) is the single source of truth** — Home's lesson tile and Learn's directory + routes all derive from it. To add a new Learn module: add one entry to `LEARN_MODULES`, register its component in `Learn.jsx`'s `MODULE_COMPONENTS` map, add its i18n keys to both `en.json` and `ru.json`. (Quiz is the intentional exception — deliberately excluded from `LEARN_MODULES`.)
- **Demo/mock data lives in `src/data/`** (strictly separate from `src/services/`). Mock data must match real API shape. Current examples: `samplePlans.js`, `regions.js`, `bottleGuide.js`.
- **i18n:** `en.json` is the master structure; `ru.json` must mirror it exactly even while untranslated. Add new UI strings to both files in the same commit. AI-generated Planner content uses a different mechanism (`lang` param to Claude directly) — don't conflate the two.
- **Module ids** (lowercase, no hyphens) must be used identically in routing paths and i18n keys. Examples: `walkthrough`, `nose`, `wheel`, `bottle`, `regions` (not `quiz` — deliberately kept out of automated tracking).
- **CSS custom properties** defined in `index.css` `:root`, referenced via Tailwind arbitrary values (`text-[var(--forest)]`), not Tailwind theme config.
- **`--nav-h` custom property** (set by `Layout.jsx` via `ResizeObserver` on the mobile bottom nav) exposes the nav's real rendered height. Bottom-docked mobile controls should read `var(--nav-h, <fallback>)` to position just above it. Naturally `0px` on desktop (nav is `md:hidden`).
- **Learn sub-modules live as standalone files in `src/pages/learn/`** — `Walkthrough.jsx`, `Nose.jsx`, `Wheel.jsx`, `Bottle.jsx`, `Regions.jsx`, `Quiz.jsx`. Not inlined in `Learn.jsx`.
- **Regions/Bottle/Grapes data** lives in `src/data/` as structured content only, no component logic.

---

## Established Interaction Patterns — Reuse, Don't Reinvent

- **Difficulty:** dots with a text label (not stars — stars read as quality ratings).
- **Completion button:** explicit "Mark done"/"Done" text, not icon-only checkboxes. **Exception:** Walkthrough auto-completes; Bottle auto-completes when all 4 types are tapped.
- **Finishing a module:** inline gold notice at the top, not a full-page takeover. Module stays fully interactive underneath.
- **"Start over":** standard name + behavior for resetting a finished module. Used by Nose, Wheel, Bottle. Does not apply to Walkthrough (no button) or Quiz (replayable by nature).
- **One-time intro/memo cards:** expanded on first visit only, collapsed thereafter. Marked seen on mount (not just on dismiss) via `seenIntroCards`.
- **Multi-step module position:** persists across refresh via `modulePosition` store field, keyed by module id.
- **Demo/curated pickers:** one-tap-to-result, not fill-form-then-submit. Tapped option shows visual selection (border + checkmark). Example: Planner's scenario picker.
- **Features that exist in code but aren't available:** shown visibly disabled ("Coming soon"), not hidden or deleted. Planner's custom form is the example — fully wired but unreachable via `pointer-events-none` + muted colors.
- **Cross-referencing between content:** real tap/navigate, not just text mention. Example: Regions' "Compare to" button navigates to the target region.
- **Mobile-first, no exceptions:** no desktop sidebars, multi-column detail panes, or hover-driven interactions. Desktop works via centered, capped-width container. Full reasoning in `MOBILE_LAYOUT_CONVENTION.md`.
- **Share functionality:** uses native Web Share API (`navigator.share()`) where available, falls back to clipboard copy. Standard pattern for any future share feature.

---

## Development Workflow

Before modifying code:
1. Inspect current implementation.
2. Explain the proposed change.
3. Identify affected files.
4. Wait for approval for significant changes.

After changes:
- Explain what changed.
- Explain how to test it.
- Mention possible side effects.
- Update `CLAUDE.md` and `PROJECT_MEMORY.md` in the same commit if anything architectural/policy-related changed.

---

## Working with Marina

- **Non-developer** (analyst by profession). Instructions must be plain, step-by-step, with explicit "what you should see" confirmations — never assume CLI familiarity.
- **"Preview first, or build straight?"** — for any new component/layout: ask before building. Small copy/bug fixes don't need this.
- **Wants honest comparison**, not automatic deference. If she brings external specs/mockups, give genuine pros/cons/verdict, including pushing back where warranted.
- **Cost-conscious** (no paid API account currently), but treats this as temporary — design demo fallbacks that upgrade cleanly, don't compromise real design because of it.
- **Wants honest counterarguments** when endorsing her own decisions, not just agreement.
- **Very plain instructions:** Explain as if for someone unfamiliar with CLI. Include explicit confirmations of "what you should see."
- **Bilingual EN/RU support is a real requirement**, not nice-to-have — Russian users are a genuine target audience.
- **Hosting must stay accessible from Russia** — this shaped infrastructure choices (Yandex Cloud, not Netlify/Vercel).

---

## Known Open Items

1. **Anthropic API billing not set up** — Planner stays in demo mode until resolved. This is the single most consequential pending item.
2. **Russian locale (`ru.json`)** — structurally complete, 100% untranslated placeholder English.
3. **`Quiz.jsx`, `Regions.jsx`, `Nose.jsx`, `Bottle.jsx`** — still bypass i18n (hardcoded English). **`Walkthrough.jsx` and `Wheel.jsx` are exceptions** — both fully wired to `t()` calls (Wheel expanded to 8 families as of 2026-09-06). Template in `Walkthrough.jsx` for converting the remaining three.
4. **~2 hardcoded hex literals** remain in Wheel (intentionally distinct origin badge backgrounds and SVG strokes; no token equivalents per decision in 2026-09-06 audit). Nose and Quiz unchanged from v1.1 rollout. Judgment calls documented in `PROJECT_MEMORY.md`.
5. **`Difficulty` buttons** — still duplicated inside individual module files, not extracted to shared UI component. ("Mark done"/"Start over" extracted to `ModuleCompletionButton.jsx` as of 2026-09-06.)
6. **`src/App.css`** — unused Vite scaffold, safe to delete.
7. **Journal features not built:** search/filter, palate-over-time tracking, print/export.
8. **Planner features not built:** free-text form (wired but disabled, "Coming soon").
9. **DNS/HTTPS monitoring** for Yandex Cloud hosting — parked, Marina will decide the approach later (GitHub Actions workflow vs. free-tier monitor).

---

## Git & Deploy

- **Deploy:** Push to `main` → GitHub Actions CI/CD builds and syncs `dist/` to `s3://palatelearn.ru/`.
- **GitHub repo:** `github.com/marinaTur/palate`
- **Live site:** `palatelearn.ru` (primary), `palatelearn.com` (redirects)
- **Local path:** `~/My_PROJECTS/palate/palate-site`
- **Never force-push** to main for routine updates.
- **Never commit GitHub tokens, API keys, or credentials** to the repo.
- **Never delete `.git` folder or `git init` an already-initialized repo.**

---

## References

| Item | Value |
|---|---|
| Project vision | Wine tasting education (not recommendation engine or cocktail app) |
| Audience | Casual wine drinkers wanting to build confidence; avoid both absolute beginners and professionals |
| Owner | Marina Turkina |
| Primary language | English |
| Secondary language | Russian (structure ready, untranslated) |
| Modules shipped | Walkthrough, Nose, Wheel, Bottle, Regions (all 5 complete) |
| Design principle | Action before theory; no wrong answers; comparison over identification; cited authority, lightly delivered |
| Typography | Cormorant Garamond + Inter |
| Palette | Forest Green + Burgundy + Gold + Cream (v1.1) |

---

## How to Update These Docs

- **Changes to architecture/conventions/policies:** update `CLAUDE.md` in the same commit.
- **Changes to product decisions/history/rationale:** update `PROJECT_MEMORY.md` in the same commit.
- **Before ending work on non-trivial changes:** confirm both docs match current code state. If they don't, fix them as part of "done."
- **Never delete superseded sections** in `PROJECT_MEMORY.md` — append a "now superseded by X" note instead (history is itself important knowledge).
- **When two sections conflict, the most recently added one wins** — but conflicts should be rare if docs are updated as-you-go.
