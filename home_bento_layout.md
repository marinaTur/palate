# Home Bento Layout — Implementation Brief

**Status:** Code written and revised once after a live local test surfaced a real inconsistency
(see §1a). Build/lint and a second live click-test still outstanding — see §4. Not yet merged.
**Scope:** `src/pages/Home.jsx` only. No other file changes — not `Layout.jsx`, not `index.css`,
not the store.
**Supersedes:** the "four equal-weight plates" dashboard described in `PROJECT_MEMORY.md` §23,
"Home page — redesigned twice more, landing on a real dashboard."
**Origin:** Built on `mobile_ux_research_2026.md` — that document is the underlying research and
full sourcing; this brief covers what actually shipped in code, and why bento was chosen over the
alternative (an editorial-hero layout) explored alongside it. Full narrative history in
`PROJECT_MEMORY.md` §23, "Home dashboard becomes a bento layout, this time research-first."

---

## 1. What changed, tile by tile

Only the dashboard grid section. Hero, the "Tip of the day" card, and every piece of data logic
(`hasStarted`-based copy, `journalSub`, `quizSub`, `handleShare`) are untouched.

| Tile | Before | After |
|---|---|---|
| Order | Plan → Journal → Lessons → Quiz | Lessons → Plan → Journal → Quiz |
| Lessons | Same-size tile, white background, thin border | Full-width lead tile, more padding — same white/tinted-border/colored-icon family as the other three |
| Plan | Solid `--burgundy` fill, white icon/text | Same white/tinted-border/colored-icon family as Journal and Quiz (see §1a) |
| Journal | — | Unchanged |
| Quiz | Same-size tile, icon/label/sub stacked vertically | Full-width strip, icon+label+sub reflowed horizontally, chevron added |
| Lessons progress bar | `'#264D3B' : '#E2DDD6'` hardcoded | `'var(--forest)' : 'var(--border)'` |

The last row is one item off the hex-literal backlog (`PROJECT_MEMORY.md` §14 #17), folded in here
because this exact line was already being rewritten for the bento change — not a separate pass
through that backlog. 18 items remain on that list, across the other four flagged files.

### 1a. Revision after live testing: one consistent tile family, not per-tile colors

The first version gave Lessons a `--forest-light` tint and kept Plan's existing solid `--burgundy`
fill — different backgrounds per tile, on the theory that color plus size would both signal
hierarchy. Testing the real page locally surfaced a real problem with that: one solid, dark tile
(Plan) sitting next to lighter ones read as inconsistent rather than intentional, not as "this one
matters more."

Fix: all four tiles now share one family — white background, a thin border tinted to the tile's
own accent color, and a colored icon chip — differing only in *which* accent color each uses
(forest / burgundy / neutral gray / gold). Hierarchy for Lessons now comes entirely from size and
position (full width, taller, first in reading order), not from a different fill color. This is
also a more literal reading of the bento-grid principle itself — tile size carries hierarchy
without needing help from color — see `mobile_ux_research_2026.md` §1.1.

## 2. The actual diff

**Removed** (the old four-equal-tile grid):

```jsx
{/* ── Dashboard — four equal-weight plates ────────────── */}
<div className="grid grid-cols-2 gap-3 pt-5 mb-6">

  {/* Plan a tasting */}
  <Link to="/planner"
    className="flex flex-col bg-[var(--burgundy)] hover:bg-[var(--burgundy-dark)] transition-colors rounded-xl px-4 py-3.5 min-h-[104px]">
    <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center mb-2">
      <i className="ti ti-glass text-white text-sm" aria-hidden="true"></i>
    </div>
    <p className="font-medium text-sm text-white leading-tight">Plan your tasting</p>
    <p className="text-xs text-white/55 mt-0.5">Wines · Food · Guests</p>
  </Link>

  {/* My journal */}
  <Link to="/journal"
    className="flex flex-col bg-white border border-[var(--border)] hover:border-[var(--forest)] transition-colors rounded-xl px-4 py-3.5 min-h-[104px]">
    <div className="w-8 h-8 rounded-lg bg-[var(--forest-light)] flex items-center justify-center mb-2">
      <i className="ti ti-notebook text-[var(--forest)] text-sm" aria-hidden="true"></i>
    </div>
    <p className="font-medium text-sm text-[var(--ink)] leading-tight">My journal</p>
    <p className="text-xs text-[var(--muted)] mt-0.5 truncate">{journalSub}</p>
  </Link>

  {/* Lessons — consolidated summary tile, replaces the old full list */}
  <Link to="/learn"
    className="flex flex-col bg-white border border-[var(--forest)]/25 hover:border-[var(--forest)]/60 transition-colors rounded-xl px-4 py-3.5 min-h-[104px]">
    <div className="w-8 h-8 rounded-lg bg-[var(--forest-light)] flex items-center justify-center mb-2">
      <i className="ti ti-book text-[var(--forest)] text-sm" aria-hidden="true"></i>
    </div>
    <p className="font-medium text-sm text-[var(--ink)] leading-tight">Lessons</p>
    <p className="text-xs text-[var(--muted)] mt-0.5">{lessonsDone} of {lessonsTotal} complete</p>
    <div className="flex gap-1 mt-auto pt-2">
      {LESSON_MODULES.map(m => (
        <div key={m.id} className="flex-1 h-0.5 rounded-full transition-all duration-300"
          style={{ background: completedModules.includes(m.id) ? '#264D3B' : '#E2DDD6' }} />
      ))}
    </div>
  </Link>

  {/* Quiz — separated out as its own standalone destination */}
  <Link to="/learn/quiz"
    className="flex flex-col bg-white border border-[var(--gold)]/35 hover:border-[var(--gold)]/70 transition-colors rounded-xl px-4 py-3.5 min-h-[104px]">
    <div className="w-8 h-8 rounded-lg bg-[var(--gold-tint)] flex items-center justify-center mb-2">
      <i className="ti ti-trophy text-[var(--gold)] text-sm" aria-hidden="true"></i>
    </div>
    <p className="font-medium text-sm text-[var(--ink)] leading-tight">Quiz</p>
    <p className="text-xs text-[var(--muted)] mt-0.5">{quizSub}</p>
  </Link>

</div>
```

**Added** (the bento grid — Lessons leads, Plan/Journal pair up, Quiz is a full-width strip):

```jsx
{/* ── Dashboard — bento layout: Lessons leads, Plan/Journal pair up,
     Quiz stays lightweight and full-width. Replaces the previous
     four-equal-tile grid; see mobile_ux_research_2026.md for the
     research this is based on. ──────────────────────────────── */}
<div className="grid grid-cols-2 gap-3 pt-5 mb-6">

  {/* Lessons — the actual curriculum, so it leads: full width, more
      room. Same white-bg/tinted-border/colored-icon treatment as
      Journal and Quiz below, for a consistent tile family — only
      size and position carry the "lead tile" hierarchy now, not a
      differently-colored background. Content is unchanged from
      before (label, "X of Y complete", the per-module segments). */}
  <Link to="/learn"
    className="col-span-2 flex flex-col bg-white border border-[var(--forest)]/25 hover:border-[var(--forest)]/60 transition-colors rounded-xl px-4 py-4 min-h-[124px]">
    <div className="w-8 h-8 rounded-lg bg-[var(--forest-light)] flex items-center justify-center mb-2">
      <i className="ti ti-book text-[var(--forest)] text-sm" aria-hidden="true"></i>
    </div>
    <p className="font-medium text-sm text-[var(--ink)] leading-tight">Lessons</p>
    <p className="text-xs text-[var(--muted)] mt-0.5">{lessonsDone} of {lessonsTotal} complete</p>
    <div className="flex gap-1 mt-auto pt-3">
      {LESSON_MODULES.map(m => (
        <div key={m.id} className="flex-1 h-1 rounded-full transition-all duration-300"
          style={{ background: completedModules.includes(m.id) ? 'var(--forest)' : 'var(--border)' }} />
      ))}
    </div>
  </Link>

  {/* Plan a tasting — same tile family as the other three now (white
      background, tinted border, colored icon chip) instead of a
      solid burgundy fill, per live-device feedback that one block of
      solid dark colour sitting next to three light tiles read as
      inconsistent rather than intentional. Copy and destination
      unchanged. */}
  <Link to="/planner"
    className="flex flex-col bg-white border border-[var(--burgundy)]/25 hover:border-[var(--burgundy)]/60 transition-colors rounded-xl px-4 py-3.5 min-h-[104px]">
    <div className="w-8 h-8 rounded-lg bg-[var(--burgundy-tint)] flex items-center justify-center mb-2">
      <i className="ti ti-glass text-[var(--burgundy)] text-sm" aria-hidden="true"></i>
    </div>
    <p className="font-medium text-sm text-[var(--ink)] leading-tight">Plan your tasting</p>
    <p className="text-xs text-[var(--muted)] mt-0.5">Wines · Food · Guests</p>
  </Link>

  {/* My journal — unchanged from before */}
  <Link to="/journal"
    className="flex flex-col bg-white border border-[var(--border)] hover:border-[var(--forest)] transition-colors rounded-xl px-4 py-3.5 min-h-[104px]">
    <div className="w-8 h-8 rounded-lg bg-[var(--forest-light)] flex items-center justify-center mb-2">
      <i className="ti ti-notebook text-[var(--forest)] text-sm" aria-hidden="true"></i>
    </div>
    <p className="font-medium text-sm text-[var(--ink)] leading-tight">My journal</p>
    <p className="text-xs text-[var(--muted)] mt-0.5 truncate">{journalSub}</p>
  </Link>

  {/* Quiz — full width but short: same copy and quizHighScore logic
      as before, just reflowed horizontally instead of stacked, to
      read as a lighter, separate thing rather than a fourth lesson. */}
  <Link to="/learn/quiz"
    className="col-span-2 flex items-center justify-between bg-white border border-[var(--gold)]/35 hover:border-[var(--gold)]/70 transition-colors rounded-xl px-4 py-3">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-[var(--gold-tint)] flex items-center justify-center flex-shrink-0">
        <i className="ti ti-trophy text-[var(--gold)] text-sm" aria-hidden="true"></i>
      </div>
      <div>
        <p className="font-medium text-sm text-[var(--ink)] leading-tight">Quiz</p>
        <p className="text-xs text-[var(--muted)] mt-0.5">{quizSub}</p>
      </div>
    </div>
    <i className="ti ti-chevron-right text-[var(--gold)]/50 text-sm flex-shrink-0" aria-hidden="true"></i>
  </Link>

</div>
```

The full file, with this diff already applied, is attached alongside this brief as `Home.jsx` —
a single-file replacement, nothing else in the file touched.

## 3. Why bento, not editorial hero

Two concepts were mocked up and compared before any code was written: this bento layout, and an
editorial-hero treatment (a larger hero card, a roman-numeral watermark, a floating "continue"
card). Bento was chosen because:

- It's the pattern current research specifically calls out as correct for a screen surfacing
  several *different-typed* destinations at once, versus a single-focus flow — see
  `mobile_ux_research_2026.md` §1.1.
- It's the smaller, safer change relative to what's already shipped — four familiar destinations,
  three of them completely unchanged, versus editorial hero's bigger structural jump.
- Editorial hero's "one clear next thing" framing fits a screen with a genuine current item to
  continue. That describes Learn's own five numbered modules, not Home's four peer destinations —
  so it's still a live option, just for a different, separate, not-yet-started piece of work (see
  `PROJECT_MEMORY.md` §23 and `MOBILE_LAYOUT_CONVENTION.md` §7 for that open question).

## 4. Verification status

- **Build/lint: not run.** Only `Home.jsx` and `Layout.jsx` were available in the session this was
  built in — no `package.json`, no sibling files, no `node_modules`, so no real `npm run build` or
  `npm run lint` pass was possible. Needed before this is considered done.
- **Live check: partially done, drove a real revision.** The first version was tested locally at
  `localhost:5173`, which is exactly where the background-inconsistency problem in §1a was caught —
  worth noting as the process working as intended, not a failure. The *revised* version (this one)
  hasn't had its own live pass yet — needed before this is considered done, same as every other
  module change in this project.
- Both are tracked as open items in `PROJECT_MEMORY.md`'s §23 entry, not assumed passing.

## 5. Rollout

1. Replace `src/pages/Home.jsx` with the attached file. Single-file replacement — its siblings
   aren't touched by this change, so this can't affect anything else in `src/pages/`.
2. `npm run build && npm run lint`.
3. Live check on your phone:
   - All four tiles read as one consistent family (white background, tinted border, colored icon) —
     no tile should stand out as a solid block of color against the others.
   - Lessons tile shows the correct "X of Y complete" and segment count, navigates to `/learn`.
   - Plan tile shows the burgundy-tinted icon/border correctly, navigates to `/planner`.
   - Journal tile behaves exactly as before (no change expected here — flag immediately if
     anything looks different, since that would mean something broke, not something intended).
   - Quiz tile shows the correct score text and navigates to `/learn/quiz`.
   - On desktop: hovering a tile shows a soft shadow, not a color or text change.
4. If all four pass, mark this brief's Status line and the `PROJECT_MEMORY.md` §23 entry as
   verified — that's a doc update too, not just a code one, per the project's own memory-discipline
   rule (`CLAUDE.md`, "Memory discipline — never defer this").

## 6. Docs updated alongside this brief

- `CLAUDE.md` — hex-literal count corrected (19→18, `Home.jsx` dropped from the file list); bento
  pattern added to "Established interaction patterns."
- `PROJECT_MEMORY.md` — new §23 entry ("Home dashboard becomes a bento layout, this time
  research-first"); §14 #17's backlog brief updated to show `Home.jsx`'s item resolved; the
  original "4-plate dashboard" paragraph in §23 gets a forward-pointing note rather than being
  rewritten, per the project's own "append, don't delete history" rule.
- `MOBILE_LAYOUT_CONVENTION.md` — new §7 for the bento-grid pattern (renumbering old §7–9 to §8–10);
  §3 (thumb zone) gets the sharper figures from the research pass; §9's research-basis note is
  dated August 2026.
- All three were edited as complete replacement files, not diffs — matching this project's
  established individual-file-replacement handoff pattern (`PROJECT_MEMORY.md` §22, §23).
