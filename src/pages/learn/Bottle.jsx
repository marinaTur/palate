import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import { Badge } from '../../components/ui'
import { WINE_TYPES, BOTTLE_KEYS } from '../../data/bottleGuide'

// Icon + accent per wine type — verified against the installed
// @tabler/icons-webfont build before use (see CLAUDE.md's icon-audit lesson).
const TYPE_META = {
  sparkling: { icon: 'ti-glass-champagne', accent: '--gold',     bg: '--gold-light' },
  white:     { icon: 'ti-glass',           accent: '--forest',   bg: '--forest-light' },
  red:       { icon: 'ti-glass-full',      accent: '--burgundy', bg: '--burgundy-light' },
  fortified: { icon: 'ti-grape',           accent: '--burgundy-dark', bg: '--burgundy-light' },
}

// ── Glass switcher — tap an icon, its detail panel appears below
// immediately. Tapping another swaps it in place. No second "open" tap —
// the icon itself is the navigation, like a segmented control. ──
function GlassSwitcher({ activeId, explored, onSelect }) {
  return (
    <div className="grid grid-cols-4 gap-2 mb-4">
      {WINE_TYPES.map(wine => {
        const meta = TYPE_META[wine.id]
        const isActive = activeId === wine.id
        const isExplored = explored.includes(wine.id)
        return (
          <button
            key={wine.id}
            onClick={() => onSelect(wine.id)}
            aria-pressed={isActive}
            className={`relative flex flex-col items-center gap-1.5 rounded-xl py-3.5 transition-colors ${
              isActive ? 'bg-white border-2' : 'bg-white border border-[var(--border)] hover:border-[var(--forest)]/40'
            }`}
            style={isActive ? { borderColor: `var(${meta.accent})` } : undefined}
          >
            {isExplored && (
              <span
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full border-2 border-[var(--cream)] flex items-center justify-center"
                style={{ background: `var(${meta.accent})` }}
              >
                <i className="ti ti-check text-white text-[10px]" aria-hidden="true"></i>
              </span>
            )}
            <i className={`ti ${meta.icon} text-lg`} style={{ color: `var(${meta.accent})` }} aria-hidden="true"></i>
            <span className="text-[11px] font-medium text-[var(--ink)] leading-none">{wine.name}</span>
          </button>
        )
      })}
    </div>
  )
}

// ── Detail panel — the currently selected type's full content, always
// visible once a type is picked, never behind a second tap. ──
function WineDetail({ wine }) {
  const meta = TYPE_META[wine.id]
  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `var(${meta.bg})` }}>
          <i className={`ti ${meta.icon} text-base`} style={{ color: `var(${meta.accent})` }} aria-hidden="true"></i>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--ink)]">{wine.name}</p>
          <p className="text-xs text-[var(--muted)]">{wine.pick}</p>
        </div>
      </div>

      <p className="text-sm text-[var(--ink-soft)] leading-relaxed">{wine.pickNote}</p>

      <div>
        <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1">{wine.feel.heading}</p>
        <p className="text-sm text-[var(--ink-soft)] leading-relaxed">{wine.feel.body}</p>
      </div>

      <div className="flex items-start gap-2 bg-[var(--forest-light)] rounded-lg px-3 py-2.5">
        <i className="ti ti-thermometer text-[var(--forest)] text-sm mt-0.5 flex-shrink-0" aria-hidden="true"></i>
        <div>
          <p className="text-xs font-medium text-[var(--forest-dark)]">{wine.servingTempC}</p>
          <p className="text-xs text-[var(--ink-soft)] leading-relaxed mt-0.5">{wine.servingNote}</p>
        </div>
      </div>

      <div className="bg-[var(--gold-light)] border border-[var(--gold)]/25 rounded-lg px-3 py-2.5">
        <p className="text-xs">
          <span className="font-medium text-[var(--gold)]">Pairs with </span>
          <span className="text-[var(--ink-soft)]">{wine.pairing.food}</span>
        </p>
        <p className="text-xs text-[var(--ink-soft)] leading-relaxed mt-1">{wine.pairing.why}</p>
        <div className="mt-1.5"><Badge variant="gold">{wine.pairing.mode}</Badge></div>
      </div>
    </div>
  )
}

// ── Main component ──────────────────────────────────────────────
export default function Bottle() {
  const navigate = useNavigate()
  const {
    markModuleComplete, unmarkModuleComplete, completedModules,
    exerciseProgress, toggleExercise, resetExerciseProgress,
  } = useAppStore()

  // Defaults to the first type so there's something to read immediately —
  // action before theory — rather than an empty "tap a glass" placeholder.
  const [activeId, setActiveId] = useState(WINE_TYPES[0].id)

  // Derived directly from the store — same pattern as Walkthrough, Nose,
  // Wheel, and Regions (see CLAUDE.md, Architecture conventions).
  const finished = completedModules.includes('bottle')

  const explored = WINE_TYPES.filter(w => exerciseProgress[`bottle-${w.id}`]).map(w => w.id)
  const exploredCount = explored.length

  function markExplored(id) {
    if (exerciseProgress[`bottle-${id}`]) return
    toggleExercise(`bottle-${id}`)
    // Auto-completes the moment all 4 have been seen — no separate
    // "Complete module" tap, since exploring everything already is
    // the meaningful action here.
    const allButThis = WINE_TYPES.filter(w => w.id !== id).every(w => exerciseProgress[`bottle-${w.id}`])
    if (allButThis) markModuleComplete('bottle')
  }

  function selectType(id) {
    setActiveId(id)
    markExplored(id)
  }

  // The first type is shown by default on open, not tapped — still counts
  // as explored, so the counter never shows a card on screen as unexplored.
  useEffect(() => {
    markExplored(WINE_TYPES[0].id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Resets to exactly first-open state, same "Start over" name/behavior as
  // every other module with a completion state.
  function startOver() {
    unmarkModuleComplete('bottle')
    resetExerciseProgress(BOTTLE_KEYS)
    setActiveId(null)
  }

  const activeWine = WINE_TYPES.find(w => w.id === activeId)

  return (
    <div className="max-w-2xl mx-auto pb-8">
      <div className="bg-gradient-to-br from-[var(--forest)] to-[var(--forest-dark)] px-5 pt-8 pb-5 md:rounded-b-2xl md:mx-4 mb-6">
        <button onClick={() => navigate('/learn')} className="flex items-center gap-2 text-white/60 hover:text-white text-sm mb-3 transition-colors">
          <i className="ti ti-arrow-left" aria-hidden="true"></i> Back to lessons
        </button>
        <p className="text-xs tracking-[0.1em] text-[var(--gold)] uppercase font-medium mb-2">One wine, guided from start to finish</p>
        <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-5xl text-white italic leading-tight">First bottle guide</h1>
      </div>

      <div className="px-4">

        {/* Inline notice, not a full-page takeover — matches every other
            module with a completion state. */}
        {finished && (
          <div className="bg-[var(--gold-light)] border border-[var(--gold)]/25 rounded-xl px-4 py-4 mb-6 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[var(--gold)] flex items-center justify-center flex-shrink-0">
              <i className="ti ti-check text-white text-base" aria-hidden="true"></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--ink)] mb-1">All four types explored.</p>
              <p className="text-sm text-[var(--ink-soft)] leading-relaxed mb-3">
                Next time you're at a wine list or a shop shelf, you've got a real feel for what separates these four categories — not just their names.
              </p>
              <button
                onClick={startOver}
                className="text-xs font-medium text-[var(--gold)] border border-[var(--gold)]/40 rounded-full px-3 py-1.5 hover:bg-[var(--gold)] hover:text-white transition-colors"
              >
                Start over
              </button>
            </div>
          </div>
        )}

        <p className="text-sm font-medium text-[var(--ink)] mb-1">Tonight I'm tasting…</p>
        <p className="text-xs text-[var(--muted)] mb-3">
          {exploredCount < WINE_TYPES.length
            ? 'Tap the other glasses to see how each one is different.'
            : "You've seen all four — tap any glass to revisit it."}
        </p>

        <GlassSwitcher activeId={activeId} explored={explored} onSelect={selectType} />

        <p className="text-xs text-[var(--muted)] mb-2">{exploredCount} of {WINE_TYPES.length} types explored</p>
        <div className="h-1 bg-[var(--border)] rounded-full mb-5 overflow-hidden">
          <div className="h-full bg-[var(--forest)] rounded-full transition-all duration-300" style={{ width: `${(exploredCount / WINE_TYPES.length) * 100}%` }} />
        </div>

        <WineDetail wine={activeWine} />
      </div>
    </div>
  )
}
