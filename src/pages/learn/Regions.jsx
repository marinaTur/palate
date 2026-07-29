import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import { Badge } from '../../components/ui'
import { REGIONS, WORLD_LABEL, TIER_LABEL, REGION_KEYS } from '../../data/regions'

// ── Region card — compact row, expands inline on tap ───────────────
// Same controlled-accordion pattern as Wheel's SubcategoryCard: isOpen/onToggle
// are props, no internal state, so nothing can go stale on a filter switch.
function RegionCard({ region, isOpen, isExplored, onToggle, onJumpTo }) {
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
              className="w-full flex items-center justify-between gap-2 bg-[var(--gold-light)] border border-[var(--gold)]/25 rounded-lg px-3 py-2.5 text-left"
            >
              <span className="text-xs text-[var(--ink-soft)]">
                <span className="font-medium text-[var(--gold)]">Compare to </span>
                {region.compareNote}
              </span>
              <i className="ti ti-arrow-right text-[var(--gold)] text-xs flex-shrink-0" aria-hidden="true"></i>
            </button>
          )}
        </div>
      )}
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
    <div className="bg-[var(--gold-light)] border border-[var(--gold)]/25 rounded-xl overflow-hidden">
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

  // Jumping via "Compare to" may cross Old World / New World — switch
  // the toggle to match, then open and scroll to the target region.
  function jumpTo(id) {
    const target = REGIONS.find(r => r.id === id)
    if (!target) return
    setWorld(target.world)
    setOpenId(id)
    markExplored(id)
    requestAnimationFrame(() => {
      document.getElementById(`region-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  function completeModule() {
    markModuleComplete('regions')
  }

  // Resets to exactly first-open state, same "Start over" name/behavior as
  // Walkthrough, Nose, and Wheel — clears only this module's own progress.
  function startOver() {
    unmarkModuleComplete('regions')
    resetExerciseProgress(REGION_KEYS)
    setOpenId(null)
    setWorld('old')
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
        <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-5xl text-white italic leading-tight">Regions</h1>
      </div>

      <div className="px-4">

        {/* Inline notice, not a full-page takeover — matches Walkthrough,
            Nose, and Wheel. Everything below stays visible and interactive. */}
        {finished && (
          <div className="bg-[var(--gold-light)] border border-[var(--gold)]/25 rounded-xl px-4 py-4 mb-6 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[var(--gold)] flex items-center justify-center flex-shrink-0">
              <i className="ti ti-check text-white text-base" aria-hidden="true"></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--ink)] mb-1">All 26 explored.</p>
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

        <div className="grid grid-cols-2 gap-2 mb-6">
          {['old', 'new'].map(w => (
            <button
              key={w}
              onClick={() => setWorld(w)}
              className={`py-2.5 rounded-lg text-sm font-medium transition-colors ${
                world === w ? 'bg-[var(--forest)] text-white' : 'bg-white border border-[var(--border)] text-[var(--muted)]'
              }`}
            >
              {WORLD_LABEL[w]}
            </button>
          ))}
        </div>

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
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

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
