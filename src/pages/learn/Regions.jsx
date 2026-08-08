import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import { Badge } from '../../components/ui'
import { REGIONS, WORLD_LABEL, TIER_LABEL, REGION_KEYS } from '../../data/regions'
import { GRAPES, GRAPE_KEYS } from '../../data/grapes'

const GRAPE_TYPE_LABEL = { all: 'All', red: 'Red', white: 'White', sparkling: 'Sparkling' }

// Static class-name lookups, not template-literal interpolation — Tailwind's
// JIT compiler scans source for literal class strings, so `bg-[var(--${type}...)]`
// would never actually generate the CSS at build time. One entry per
// grapeType, referencing the tokens added to index.css's :root.
const GRAPE_TINT_BG = {
  red: 'bg-[var(--red-grape-tint)]',
  white: 'bg-[var(--white-grape-tint)]',
  sparkling: 'bg-[var(--spark-grape-tint)]',
}
const GRAPE_TEXT = {
  red: 'text-[var(--red-grape)]',
  white: 'text-[var(--white-grape)]',
  sparkling: 'text-[var(--spark-grape)]',
}
const GRAPE_DOT_BG = {
  red: 'bg-[var(--red-grape)]',
  white: 'bg-[var(--white-grape)]',
  sparkling: 'bg-[var(--spark-grape)]',
}

// ── Region card — compact row, expands inline on tap ───────────────
// Same controlled-accordion pattern as Wheel's SubcategoryCard: isOpen/onToggle
// are props, no internal state, so nothing can go stale on a filter switch.
function RegionCard({ region, isOpen, isExplored, onToggle, onJumpTo, onJumpToGrape }) {
  const anchorGrapes = GRAPES.filter(g => g.regionIds.includes(region.id))
  return (
    <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden mb-2">
      <button onClick={onToggle} className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left">
        <div className="flex items-center gap-2.5 min-w-0">
          {isExplored ? (
            <i className="ti ti-check text-[var(--forest)] text-sm flex-shrink-0" aria-hidden="true"></i>
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--border)] flex-shrink-0" />
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--ink)] truncate">{region.name}</p>
            <p className="text-xs text-[var(--muted)] truncate">{region.country} · {region.grapes}</p>
          </div>
        </div>
        <i className={`ti ${isOpen ? 'ti-chevron-up' : 'ti-chevron-down'} text-sm text-[var(--muted)] flex-shrink-0`} aria-hidden="true"></i>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 border-t border-[var(--border-soft)] pt-3">
          <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1">Style</p>
          <p className="text-sm text-[var(--ink-soft)] mb-3">{region.style}</p>

          {region.onLabel?.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1.5">On the label</p>
              <div className="flex flex-wrap gap-1.5">
                {region.onLabel.map((term, i) => <Badge key={i} variant="default">{term}</Badge>)}
              </div>
            </div>
          )}

          <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1">The story</p>
          <p className="text-sm text-[var(--ink-soft)] leading-relaxed mb-3">{region.story}</p>

          {region.compareTo && (
            <button
              onClick={() => onJumpTo(region.compareTo)}
              className="w-full flex items-center justify-between gap-2 bg-[var(--gold-tint)] border border-[var(--gold)]/25 rounded-lg px-3 py-2.5 text-left mb-1.5"
            >
              <span className="text-xs text-[var(--ink-soft)]">
                <span className="font-medium text-[var(--gold)]">Compare to </span>
                {region.compareNote}
              </span>
              <i className="ti ti-arrow-right text-[var(--gold)] text-xs flex-shrink-0" aria-hidden="true"></i>
            </button>
          )}

          {anchorGrapes.map(grape => (
            <button
              key={grape.id}
              onClick={() => onJumpToGrape(grape.id)}
              className="w-full flex items-center justify-between gap-2 bg-[var(--gold-tint)] border border-[var(--gold)]/25 rounded-lg px-3 py-2.5 text-left mb-1.5"
            >
              <span className="text-xs text-[var(--ink-soft)]">
                <span className="font-medium text-[var(--gold)]">See in Grapes </span>
                {grape.names.join(' / ')}
              </span>
              <i className="ti ti-arrow-right text-[var(--gold)] text-xs flex-shrink-0" aria-hidden="true"></i>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Column span derived from actual label length, not just "has two names" —
// checked against the real 27-grape roster: 19 fit in one 3-col cell, 6 need
// two cells (mostly combined names, plus a couple of long single names like
// Cabernet Sauvignon/Grüner Veltliner), and only the two longest combined
// names (Pinot Gris/Grigio, Muscat Blanc à Petits Grains) need the full row.
function grapeSpan(names) {
  const label = names.join(' / ')
  if (label.length > 24) return 3
  if (label.length > 15) return 2
  return 1
}
const SPAN_CLASS = { 1: '', 2: 'col-span-2', 3: 'col-span-3' }

// ── Grape card — compact tile, expands into a detail card rendered
// below the grid (not inline in the tile itself, matching the
// reviewed mockup rather than RegionCard's own same-card-expands shape).
// Same controlled pattern as RegionCard: isOpen/onToggle are props.
function GrapeTile({ grape, isOpen, isExplored, onToggle }) {
  const span = grapeSpan(grape.names)
  const wide = span > 1
  return (
    <button
      onClick={onToggle}
      className={`relative rounded-2xl px-3 pt-3.5 pb-3 text-left overflow-hidden ${GRAPE_TINT_BG[grape.grapeType]} ${SPAN_CLASS[span]} ${wide ? 'flex items-center justify-between gap-2.5' : ''} ${isOpen ? 'outline outline-2 outline-offset-2 outline-[var(--gold)]' : ''}`}
    >
      {isExplored && (
        <i className={`ti ti-check absolute top-2.5 right-2.5 text-xs ${GRAPE_TEXT[grape.grapeType]}`} aria-hidden="true"></i>
      )}
      <div className={wide ? 'flex-1 min-w-0' : ''}>
        <p className={`text-[10.5px] font-medium uppercase tracking-wide ${GRAPE_TEXT[grape.grapeType]}`}>
          {GRAPE_TYPE_LABEL[grape.grapeType]}{grape.names.length > 1 ? ' · same grape, two names' : ''}
        </p>
        <p className="text-sm font-semibold text-[var(--ink)] leading-tight mt-0.5">{grape.names.join(' / ')}</p>
      </div>
    </button>
  )
}

// One Structure chip — shows the short display value by default (per the
// grapes.js `short` field, see its own header comment), with a "Read more"
// toggle only when the full `value` actually differs from `short` (a few
// fields, like Body: "Full", already are short — no toggle needed there).
// Own local open/closed state per chip is fine here, unlike RegionCard/
// GrapeTile's controlled pattern — this is a leaf-level, purely-cosmetic
// disclosure with no other component needing to know its state.
function StructChip({ tintBg, label, field }) {
  const [open, setOpen] = useState(false)
  const hasMore = field.short && field.short !== field.value
  return (
    <div className={`rounded-lg px-2.5 py-2 ${tintBg}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wide opacity-70 text-[var(--ink)]">{label}</p>
      <p className="text-[13px] font-normal text-[var(--ink)]">{field.short || field.value}</p>
      {hasMore && (
        <button onClick={() => setOpen(o => !o)} className="text-[10.5px] font-medium text-[var(--gold-text)] mt-0.5">
          {open ? 'Show less' : 'Read more'}
        </button>
      )}
      {hasMore && open && (
        <p className="text-[12px] text-[var(--ink-soft)] leading-relaxed mt-1">{field.value}</p>
      )}
    </div>
  )
}

function GrapeDetail({ grape, onJumpToGrape, onJumpToRegion }) {
  const [moreOpen, setMoreOpen] = useState(false)
  const tintBg = GRAPE_TINT_BG[grape.grapeType]
  const text = GRAPE_TEXT[grape.grapeType]
  const dotBg = GRAPE_DOT_BG[grape.grapeType]
  const confusedTargets = grape.confusedWith
    .map(id => GRAPES.find(g => g.id === id))
    .filter(Boolean)

  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-4 mb-2">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div>
          <div className="flex gap-1.5 flex-wrap mb-1">
            {grape.names.map(name => (
              <span key={name} className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${tintBg} ${text}`}>
                {name}
              </span>
            ))}
          </div>
          <p className="font-['Cormorant_Garamond'] italic text-xl text-[var(--ink)]">{grape.names.join(' / ')}</p>
        </div>
      </div>

      <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1">
        <span className={`inline-block w-2 h-2 rounded-[2px] ${dotBg}`} aria-hidden="true"></span>
        Primary aroma
      </p>
      <p className="text-sm text-[var(--ink-soft)] leading-relaxed mb-3">{grape.primaryAroma.value}</p>

      <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1.5">
        <span className={`inline-block w-2 h-2 rounded-[2px] ${dotBg}`} aria-hidden="true"></span>
        Structure
      </p>
      <div className="grid grid-cols-3 gap-1.5 mb-1.5">
        <StructChip tintBg={tintBg} label="Body" field={grape.body} />
        <StructChip tintBg={tintBg} label="Tannin" field={grape.tannin} />
        <StructChip tintBg={tintBg} label="Colour" field={grape.colour} />
      </div>
      <div className="grid grid-cols-2 gap-1.5 mb-3">
        <StructChip tintBg={tintBg} label="Acidity" field={grape.acidity} />
        <StructChip tintBg={tintBg} label="ABV" field={grape.abv} />
      </div>
      <p className="text-[13px] text-[var(--ink-soft)] leading-relaxed mb-4">{grape.styleRange.value}</p>

      <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1">
        <span className={`inline-block w-2 h-2 rounded-[2px] ${dotBg}`} aria-hidden="true"></span>
        Secondary / tertiary character
      </p>
      <p className="text-sm text-[var(--ink-soft)] leading-relaxed mb-4">{grape.secondaryTertiary.value}</p>

      <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1">
        <span className={`inline-block w-2 h-2 rounded-[2px] ${dotBg}`} aria-hidden="true"></span>
        Commonly confused with
      </p>
      <p className="text-sm text-[var(--ink-soft)] leading-relaxed mb-1.5">{grape.confusedWithNote.value}</p>
      {confusedTargets.map(target => (
        <button
          key={target.id}
          onClick={() => onJumpToGrape(target.id)}
          className="w-full flex items-center justify-between gap-2 bg-[var(--gold-tint)] border border-[var(--gold)]/25 rounded-lg px-3 py-2.5 text-left mb-1.5"
        >
          <span className="text-xs text-[var(--ink-soft)]">
            <span className="font-medium text-[var(--gold)]">Compare taste with </span>
            {target.names.join(' / ')}
          </span>
          <i className="ti ti-arrow-right text-[var(--gold)] text-xs flex-shrink-0" aria-hidden="true"></i>
        </button>
      ))}

      <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1 mt-4">
        <span className={`inline-block w-2 h-2 rounded-[2px] ${dotBg}`} aria-hidden="true"></span>
        Food pairing
      </p>
      <p className="text-sm text-[var(--ink-soft)] leading-relaxed mb-4">{grape.foodPairing.value}</p>

      <button
        onClick={() => setMoreOpen(o => !o)}
        className="w-full text-center bg-[var(--border-soft)] rounded-lg py-2.5 text-xs font-medium text-[var(--ink-soft)] mb-4"
      >
        {moreOpen ? 'Hide detail' : 'Show more detail'} (sweetness, finish, prevalence)
      </button>
      {moreOpen && (
        <div className="mb-4 space-y-3">
          <div>
            <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1">Sweetness</p>
            <p className="text-sm text-[var(--ink-soft)] leading-relaxed">{grape.sweetness.value}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1">Finish</p>
            <p className="text-sm text-[var(--ink-soft)] leading-relaxed">{grape.finish.value}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1">Global prevalence</p>
            <p className="text-sm text-[var(--ink-soft)] leading-relaxed">{grape.globalPrevalence.value}</p>
          </div>
        </div>
      )}

      <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1.5">Where to find it</p>
      {grape.regionIds.map(regionId => {
        const region = REGIONS.find(r => r.id === regionId)
        if (!region) return null
        return (
          <button
            key={regionId}
            onClick={() => onJumpToRegion(regionId)}
            className="w-full flex items-center justify-between gap-2 bg-[var(--gold-tint)] border border-[var(--gold)]/25 rounded-lg px-3 py-2.5 text-left mb-1.5"
          >
            <span className="text-xs text-[var(--ink-soft)]">{region.name}</span>
            <i className="ti ti-arrow-right text-[var(--gold)] text-xs flex-shrink-0" aria-hidden="true"></i>
          </button>
        )
      })}
    </div>
  )
}

// ── Classification decoder — standalone reference, not a region ───
const CLASSIFICATION_ROWS = [
  { country: 'France', tiers: 'AOC/AOP → IGP → Vin de France', note: 'Reformed in 2012 — an older 4-tier system (with "VDQS") is now over a decade out of date if you see it referenced.' },
  { country: 'Italy', tiers: 'DOCG (~78) → DOC (~329) → IGT (~120+) → Vino da Tavola', note: 'Structurally unchanged for decades, just grown in count over time.' },
  { country: 'Spain', tiers: 'DOCa (Rioja + Priorat only) → DO (~69) → Vino de la Tierra', note: 'Only two regions have ever reached the top DOCa tier.' },
  { country: 'Germany', tiers: 'Two systems running in parallel right now', note: 'A traditional ripeness ladder (Kabinett → Spätlese → Auslese) plus a newer geography ladder (Village → Grosse Lage), mandatory from the 2026 vintage. Genuinely mid-transition.' },
  { country: 'USA & New World', tiers: 'No quality tier at all', note: 'AVAs define geography only — unlike AOC/DOCG/DO, they don\u2019t rank quality.' },
]

function ClassificationDecoder({ isOpen, onToggle }) {
  return (
    <div className="bg-[var(--gold-tint)] border border-[var(--gold)]/25 rounded-xl overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
        <i className="ti ti-key text-[var(--gold)] flex-shrink-0" aria-hidden="true"></i>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--ink)]">Classification decoder</p>
          <p className="text-xs text-[var(--ink-soft)]">What AOC, DOC, DOCG and DO actually mean</p>
        </div>
        <i className={`ti ${isOpen ? 'ti-chevron-up' : 'ti-chevron-down'} text-[var(--gold)] text-sm flex-shrink-0`} aria-hidden="true"></i>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-1">
          <p className="text-sm text-[var(--ink-soft)] leading-relaxed mb-3">
            Nearly every country's system is answering the same question, just with different words: top tier means "from exactly this place, by these specific rules," base tier means "could be from almost anywhere."
          </p>
          <div className="space-y-2.5">
            {CLASSIFICATION_ROWS.map((row) => (
              <div key={row.country} className="bg-white/60 rounded-lg p-3">
                <p className="text-xs font-medium text-[var(--ink)] mb-0.5">{row.country}</p>
                <p className="text-xs text-[var(--gold)] font-medium mb-1">{row.tiers}</p>
                <p className="text-xs text-[var(--ink-soft)] leading-relaxed">{row.note}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main component ──────────────────────────────────────────────
export default function Regions() {
  const navigate = useNavigate()
  const {
    markModuleComplete, unmarkModuleComplete, completedModules,
    exerciseProgress, toggleExercise, resetExerciseProgress,
  } = useAppStore()

  const [world, setWorld] = useState('old')
  const [openId, setOpenId] = useState(null)
  const [classificationOpen, setClassificationOpen] = useState(false)

  // Grapes is a separate view mode, not a third `world` value — grape
  // entries have no `tier`/`world`, so keeping `world` strictly 'old'/'new'
  // means the existing REGIONS.filter/tiers logic below needs no changes.
  const [viewMode, setViewMode] = useState('regions')
  const [openGrapeId, setOpenGrapeId] = useState(null)
  const [grapeTypeFilter, setGrapeTypeFilter] = useState('all')

  // Derived directly from the store — same reasoning as every other module
  // with a completion state (see Wheel, Walkthrough, Nose).
  const finished = completedModules.includes('regions')

  const exploredCount = REGIONS.filter(r => exerciseProgress[`region-${r.id}`]).length
  const allExplored = exploredCount === REGIONS.length

  function markExplored(id) {
    if (!exerciseProgress[`region-${id}`]) toggleExercise(`region-${id}`)
  }

  function toggleRegion(id) {
    const opening = openId !== id
    setOpenId(opening ? id : null)
    if (opening) markExplored(id)
  }

  function markGrapeExplored(id) {
    if (!exerciseProgress[`grape-${id}`]) toggleExercise(`grape-${id}`)
  }

  // The detail card renders once, below the *entire* tile grid — with 27+
  // grapes, tapping a tile near the bottom means the detail appears far
  // off-screen with no scroll at all, and closing it previously left the
  // page wherever it happened to be, forcing a manual scroll back to find
  // the tile. Fixed without a full-screen overlay or route change (Marina
  // chose to keep this consistent with Regions.jsx's inline-everything
  // pattern rather than reach for either): opening scrolls down to the
  // detail card itself so it's immediately visible; closing scrolls back
  // up to the tapped tile's own position in the grid.
  function toggleGrape(id) {
    const opening = openGrapeId !== id
    setOpenGrapeId(opening ? id : null)
    if (opening) markGrapeExplored(id)
    requestAnimationFrame(() => {
      const targetId = opening ? 'grape-detail' : `grape-${id}`
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: opening ? 'start' : 'center' })
    })
  }

  // Jumping via "Compare to" or a grape's "Where to find it" link may cross
  // Old World / New World, and may originate from the Grapes view — switch
  // the toggle to match and land back on the Regions view, then scroll.
  function jumpTo(id) {
    const target = REGIONS.find(r => r.id === id)
    if (!target) return
    setViewMode('regions')
    setWorld(target.world)
    setOpenId(id)
    markExplored(id)
    requestAnimationFrame(() => {
      document.getElementById(`region-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  // Grape → grape "Compare taste with" link — stays within the Grapes view.
  function jumpToGrape(id) {
    const target = GRAPES.find(g => g.id === id)
    if (!target) return
    setViewMode('grapes')
    setOpenGrapeId(id)
    markGrapeExplored(id)
    requestAnimationFrame(() => {
      document.getElementById('grape-detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  function completeModule() {
    markModuleComplete('regions')
  }

  // Resets to exactly first-open state, same "Start over" name/behavior as
  // Walkthrough, Nose, and Wheel — clears only this module's own progress.
  // Grapes exploration rides on the same 'regions' module completion state
  // (no separate Grapes progress/completion concept, per the original
  // toggle-mode design decision), so its own exercise keys reset here too.
  function startOver() {
    unmarkModuleComplete('regions')
    resetExerciseProgress(REGION_KEYS)
    resetExerciseProgress(GRAPE_KEYS)
    setOpenId(null)
    setOpenGrapeId(null)
    setWorld('old')
    setViewMode('regions')
    setGrapeTypeFilter('all')
  }

  const visible = REGIONS.filter(r => r.world === world)
  const tiers = [1, 2, 3].filter(t => visible.some(r => r.tier === t))

  return (
    <div className="max-w-2xl mx-auto pb-8">
      <div className="bg-gradient-to-br from-[var(--forest)] to-[var(--forest-dark)] px-5 pt-8 pb-5 md:rounded-b-2xl md:mx-4 mb-6">
        <button onClick={() => navigate('/learn')} className="flex items-center gap-2 text-white/60 hover:text-white text-sm mb-3 transition-colors">
          <i className="ti ti-arrow-left" aria-hidden="true"></i> Back to lessons
        </button>
        <p className="text-xs tracking-[0.1em] text-[var(--gold)] uppercase font-medium mb-2">Old World, New World, at a glance</p>
        <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-5xl text-white italic leading-tight">Regions and Grapes</h1>
      </div>

      <div className="px-4">

        {/* Inline notice, not a full-page takeover — matches Walkthrough,
            Nose, and Wheel. Everything below stays visible and interactive. */}
        {finished && (
          <div className="bg-[var(--gold-tint)] border border-[var(--gold)]/25 rounded-xl px-4 py-4 mb-6 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[var(--gold)] flex items-center justify-center flex-shrink-0">
              <i className="ti ti-check text-white text-base" aria-hidden="true"></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--ink)] mb-1">All {REGIONS.length} explored.</p>
              <p className="text-sm text-[var(--ink-soft)] leading-relaxed mb-3">
                Next time a bottle mentions a place you don't recognize, you've got a real shot at guessing what's in the glass before you read the label.
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

        <p className="text-xs text-[var(--muted)] mb-2">{exploredCount} of {REGIONS.length} regions explored</p>
        <div className="h-1 bg-[var(--border)] rounded-full mb-6 overflow-hidden">
          <div className="h-full bg-[var(--forest)] rounded-full transition-all duration-300" style={{ width: `${(exploredCount / REGIONS.length) * 100}%` }} />
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
          {['old', 'new'].map(w => (
            <button
              key={w}
              onClick={() => { setViewMode('regions'); setWorld(w) }}
              className={`py-2.5 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'regions' && world === w ? 'bg-[var(--forest)] text-white' : 'bg-white border border-[var(--border)] text-[var(--muted)]'
              }`}
            >
              {WORLD_LABEL[w]}
            </button>
          ))}
          <button
            onClick={() => setViewMode('grapes')}
            className={`py-2.5 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'grapes' ? 'bg-[var(--forest)] text-white' : 'bg-white border border-[var(--border)] text-[var(--muted)]'
            }`}
          >
            Grapes
          </button>
        </div>

        {viewMode === 'regions' && (
          <div>
            {tiers.map(tier => (
              <div key={tier} className="mb-5">
                <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-2">
                  Tier {tier} — {TIER_LABEL[tier]}
                </p>
                {visible.filter(r => r.tier === tier).map(region => (
                  <div key={region.id} id={`region-${region.id}`}>
                    <RegionCard
                      region={region}
                      isOpen={openId === region.id}
                      isExplored={!!exerciseProgress[`region-${region.id}`]}
                      onToggle={() => toggleRegion(region.id)}
                      onJumpTo={jumpTo}
                      onJumpToGrape={jumpToGrape}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {viewMode === 'grapes' && (
          <div className="mb-5">
            <div className="flex gap-1.5 mb-4 overflow-x-auto">
              {['all', 'red', 'white', 'sparkling'].map(t => (
                <button
                  key={t}
                  onClick={() => setGrapeTypeFilter(t)}
                  className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1.5 border transition-colors ${
                    grapeTypeFilter === t
                      ? 'bg-[var(--forest-tint)] border-[var(--forest-mid)] text-[var(--ink)]'
                      : 'bg-white border-[var(--border)] text-[var(--muted)]'
                  }`}
                >
                  {t !== 'all' && (
                    <span className={`w-2 h-2 rounded-full ${GRAPE_DOT_BG[t]}`} aria-hidden="true"></span>
                  )}
                  {GRAPE_TYPE_LABEL[t]}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2.5 mb-4">
              {GRAPES.filter(g => grapeTypeFilter === 'all' || g.grapeType === grapeTypeFilter).map(grape => (
                <div key={grape.id} id={`grape-${grape.id}`}>
                  <GrapeTile
                    grape={grape}
                    isOpen={openGrapeId === grape.id}
                    isExplored={!!exerciseProgress[`grape-${grape.id}`]}
                    onToggle={() => toggleGrape(grape.id)}
                  />
                </div>
              ))}
            </div>

            {openGrapeId && (
              <div id="grape-detail">
                <GrapeDetail
                  grape={GRAPES.find(g => g.id === openGrapeId)}
                  onJumpToGrape={jumpToGrape}
                  onJumpToRegion={jumpTo}
                />
              </div>
            )}
          </div>
        )}

        <div className="mt-6 mb-6">
          <ClassificationDecoder isOpen={classificationOpen} onToggle={() => setClassificationOpen(o => !o)} />
        </div>

        {allExplored && !finished && (
          <button
            onClick={completeModule}
            className="w-full py-3 rounded-xl text-white text-sm font-medium transition-colors bg-[var(--forest)] hover:bg-[var(--forest-dark)]"
          >
            Complete module ✓
          </button>
        )}
      </div>
    </div>
  )
}
