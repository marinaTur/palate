# Mobile Layout Convention — Thumb-Zone-First Section Design

**Status:** Established convention, effective immediately for any new or reworked section layout.
**Origin:** Written after the Planner scenario-picker redesign surfaced two wrong turns in a row —
a top tab bar, then a full desktop sidebar — before landing on the right approach. Recorded here
so future layout work, Planner or otherwise, starts from the right assumptions instead of
re-discovering them the same way.
**Applies to:** Any section of the app where a layout or interaction-pattern change is being
considered, not just Planner. Treat this with the same weight as CLAUDE.md's existing "design
system — do not change without discussion" rules; this document is the mobile-layout counterpart
to that section.

---

## 1. This app is mobile-first, without exception

Every layout decision starts from the phone experience. Desktop is not a separate design target —
it should keep working via the existing centered, capped-width container (`max-w-2xl mx-auto` and
similar), not receive its own layout treatment, breakpoint-specific component, or alternate
interaction pattern.

**Do not build desktop-specific layouts** — sidebars, multi-column detail panes, hover-driven
interactions — for any section unless this convention is explicitly revisited and changed first.

## 2. "Wide screen" means a big phone, not a wide monitor

When a request mentions wide-screen convenience, it means large-screen smartphones — iPhone Pro
Max / Galaxy Ultra class devices, roughly 6.5" and up — not laptops or desktop monitors. The
concern on these devices is **reach, not space**: the screen is taller, not more suited to
desktop-style multi-column layouts. Confirm this interpretation explicitly if a future request is
ambiguous — this exact misunderstanding already cost one full redesign cycle.

## 3. Respect the thumb zone

Current mobile UX research consistently places the bottom third of the screen as the easiest
one-handed reach zone, with top corners the hardest — and the gap widens on larger phones, where
reaching the top can require a full grip shift. Practical implications:

- **Primary, frequently-tapped controls belong in the lower two-thirds of the screen** — pickers,
  primary actions, anything meant to be used often — never at the very top of a page.
- This matters *more*, not less, as devices get physically bigger. A layout that feels fine on a
  small phone can be a real stretch on a 6.7"+ screen.
- Minimum touch target size: 44×44px (Apple Human Interface Guidelines and WCAG), 48×48px
  (Material Design). Treat 44px as the floor for any new tap target.

## 4. Coordinate with the existing global bottom nav — never compete with it

Palate already has a persistent bottom nav (`src/components/Layout.jsx`): `fixed bottom-0`,
Home / Learn / Plan / Journal, with `safe-area-inset-bottom` already handled via the `.safe-bottom`
utility class in `index.css`. This occupies the single most thumb-reachable position on the
screen.

- **Any new bottom-anchored control must dock above this nav**, offset by its actual rendered
  height — never introduce a second, independent `fixed bottom-0` element competing for the same
  space.
- Measure the nav's real height at implementation time rather than hardcoding a guessed pixel
  value — its content can change later, and a hardcoded number won't follow.
- Never hide, replace, or visually compete with the global nav from a section-level component.

## 5. One-tap-to-result stays the standard for content pickers

Already established for Planner's scenario picker (CLAUDE.md, "Established interaction
patterns"), and now generalized: **any control that lets the user choose from a small curated set
should show the result in the same tap that makes the selection** — no separate "open," "confirm,"
or "generate" step.

- Prefer a compact, horizontal, single-select **chip row** (Material Design's "choice chips"
  pattern) over a bottom sheet, accordion, or modal for this purpose. Bottom sheets in particular
  add an extra open-tap and carry a documented usability quirk: because they can visually resemble
  a full page, users sometimes expect the device's back button or back gesture to dismiss them,
  which not all implementations support.
- This pattern fits sets of **3–5 options** well. Beyond that, this specific pattern stops being
  appropriate — reconsider rather than force it (a longer list belongs on its own page, not
  squeezed into a chip row).

## 6. The validated pattern: chip-bar picker, docked above the global nav

The concrete pattern that satisfies all of the above, established during the Planner rework:

- A horizontal row of single-select chips (icon + short label), one per option.
- Positioned as a non-scrolling element directly above the global bottom nav — content scrolls
  independently in the space above both bars; the chip row and the nav never scroll away.
- Tapping a chip immediately swaps the visible result above it. No intermediate state.
- Reuses whatever icon set is already established for the options being represented — don't
  introduce new icons if existing ones (e.g. `SCENARIO_META`) already cover the same items.

**When to reach for this pattern:** any section that needs the user to choose between a small
(3–5) set of curated options and see an immediate result. Planner's scenario picker is the first
implementation — treat it as the reference example for any future section that fits this shape.

## 7. Anti-patterns — already tried and rejected once, don't repeat

- **Desktop sidebar / multi-column detail layout** — tried during this same redesign, rejected
  once "wide screen" was correctly understood as phone-sized, not desktop-sized. Don't revive
  without first revisiting rules 1 and 2.
- **Top-anchored tab bar for a primary picker** — sits in the hardest-to-reach zone, rejected in
  favor of the bottom chip bar.
- **Bottom sheet for a primary content picker** — extra tap, documented back-navigation confusion,
  worse fit than a directly-visible chip row for this use case.
- **A second independent `fixed bottom-0` element** — collides with or duplicates the existing
  global nav's territory; always dock above it instead.

## 8. Research basis (snapshot — re-verify if this convention is revisited much later)

Grounded in current (2026) mobile UX research on thumb-zone/reachability design and standard
navigation-pattern guidance: bottom tab bars as the strongest pattern for 3–5 primary options,
choice chips for single-select-from-a-set, and the touch-target minimums cited above. As with the
Netlify-vs-Vercel hosting research elsewhere in this project, treat this as **a snapshot in
time** — mobile UX conventions do shift, so if this document is being revisited long after it was
written, a fresh check is more reliable than assuming it still reflects current best practice.

## 9. Relationship to other project docs

- Sits alongside CLAUDE.md's "Design system" and "Established interaction patterns" sections — it
  doesn't replace them, it adds the mobile-layout-specific reasoning that wasn't written down
  before this redesign surfaced the gap.
- Planner's specific implementation of this convention lives in
  `PLANNER_SCENARIO_PICKER_REFACTOR.md` — that document assumes this one and doesn't re-derive the
  reasoning. If the two ever conflict: this document wins for the general principle, the
  Planner-specific document wins for Planner's own implementation detail.
- **Recommended next step once this is approved:** fold rules 1, 2, 4, 5, and 6 into CLAUDE.md's
  own "Established interaction patterns" section, the same way other conventions in this project
  graduated from a standalone brief into the persistent memory docs (see how Palette v1.1 moved
  from its own brief into CLAUDE.md's design-system section). This chat session can't write to
  the project's actual CLAUDE.md directly — that merge happens wherever the canonical docs are
  maintained.
