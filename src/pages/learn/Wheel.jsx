import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../../store/useAppStore'
import { ModuleCompletionButton } from '../../components/ModuleCompletionButton'

// ── Data ─────────────────────────────────────────────────────────

const ORIGIN_INFO = {
  primary: {
    labelKey: 'wheel.originPrimary',
    color: 'var(--forest)',
    bg: '#E4EDE0',
    descKey: 'wheel.originPrimaryDesc',
  },
  secondary: {
    labelKey: 'wheel.originSecondary',
    color: '#7A5230',
    bg: '#F0E6DC',
    descKey: 'wheel.originSecondaryDesc',
  },
  tertiary: {
    labelKey: 'wheel.originTertiary',
    color: '#6B4A3A',
    bg: '#EFE6E0',
    descKey: 'wheel.originTertiaryDesc',
  },
}

const CATEGORIES = [
  {
    id: 'fruit',
    nameKey: 'wheel.categoryFruit',
    color: '#C0392B',
    origins: ['primary'],
    introKey: 'wheel.categoryFruitIntro',
    subcategories: [
      { nameKey: 'wheel.fruitCitrus', descriptorsKey: 'wheel.fruitCitrusDescriptors', winesKey: 'wheel.fruitCitrusWines' },
      { nameKey: 'wheel.fruitStone', descriptorsKey: 'wheel.fruitStoneDescriptors', winesKey: 'wheel.fruitStoneWines' },
      { nameKey: 'wheel.fruitBerry', descriptorsKey: 'wheel.fruitBerryDescriptors', winesKey: 'wheel.fruitBerryWines' },
      { nameKey: 'wheel.fruitTropical', descriptorsKey: 'wheel.fruitTropicalDescriptors', winesKey: 'wheel.fruitTropicalWines' },
      { nameKey: 'wheel.fruitDried', descriptorsKey: 'wheel.fruitDriedDescriptors', winesKey: 'wheel.fruitDriedWines', noteKey: 'wheel.fruitDriedNote' },
    ],
  },
  {
    id: 'floral',
    nameKey: 'wheel.categoryFloral',
    color: '#B8558A',
    origins: ['primary'],
    introKey: 'wheel.categoryFloralIntro',
    subcategories: [
      { nameKey: 'wheel.floralWhite', descriptorsKey: 'wheel.floralWhiteDescriptors', winesKey: 'wheel.floralWhiteWines' },
      { nameKey: 'wheel.floralRose', descriptorsKey: 'wheel.floralRoseDescriptors', winesKey: 'wheel.floralRoseWines' },
    ],
  },
  {
    id: 'herbal',
    nameKey: 'wheel.categoryHerbal',
    color: '#5A8A3C',
    origins: ['primary'],
    introKey: 'wheel.categoryHerbalIntro',
    subcategories: [
      { nameKey: 'wheel.herbalFresh', descriptorsKey: 'wheel.herbalFreshDescriptors', winesKey: 'wheel.herbalFreshWines' },
      { nameKey: 'wheel.herbalVegetal', descriptorsKey: 'wheel.herbalVegetalDescriptors', winesKey: 'wheel.herbalVegetalWines' },
    ],
  },
  {
    id: 'spice',
    nameKey: 'wheel.categorySpice',
    color: 'var(--gold)',
    origins: ['primary', 'secondary'],
    introKey: 'wheel.categorySpiceIntro',
    subcategories: [
      { nameKey: 'wheel.spicePepper', descriptorsKey: 'wheel.spicePepperDescriptors', winesKey: 'wheel.spicePepperWines', noteKey: 'wheel.spicePepperNote' },
      { nameKey: 'wheel.spiceBaking', descriptorsKey: 'wheel.spiceBakingDescriptors', winesKey: 'wheel.spiceBakingWines' },
    ],
  },
  {
    id: 'earth',
    nameKey: 'wheel.categoryEarth',
    color: '#6B4A3A',
    origins: ['tertiary'],
    introKey: 'wheel.categoryEarthIntro',
    subcategories: [
      { nameKey: 'wheel.earthMineral', descriptorsKey: 'wheel.earthMineralDescriptors', winesKey: 'wheel.earthMineralWines' },
      { nameKey: 'wheel.earthForest', descriptorsKey: 'wheel.earthForestDescriptors', winesKey: 'wheel.earthForestWines' },
    ],
  },
  {
    id: 'oak',
    nameKey: 'wheel.categoryOak',
    color: '#7A5230',
    origins: ['secondary'],
    introKey: 'wheel.categoryOakIntro',
    subcategories: [
      { nameKey: 'wheel.oakSweet', descriptorsKey: 'wheel.oakSweetDescriptors', winesKey: 'wheel.oakSweetWines', noteKey: 'wheel.oakSweetNote' },
      { nameKey: 'wheel.oakToasted', descriptorsKey: 'wheel.oakToastedDescriptors', winesKey: 'wheel.oakToastedWines' },
    ],
  },
  {
    id: 'vegetative',
    nameKey: 'wheel.categoryVegetative',
    color: '#4A7A5C',
    origins: ['primary'],
    introKey: 'wheel.categoryVegetativeIntro',
    subcategories: [
      { nameKey: 'wheel.vegetativeGreen', descriptorsKey: 'wheel.vegetativeGreenDescriptors', winesKey: 'wheel.vegetativeGreenWines' },
      { nameKey: 'wheel.vegetativeCanned', descriptorsKey: 'wheel.vegetativeCannedDescriptors', winesKey: 'wheel.vegetativeCannedWines' },
      { nameKey: 'wheel.vegetativeHay', descriptorsKey: 'wheel.vegetativeHayDescriptors', winesKey: 'wheel.vegetativeHayWines' },
    ],
  },
  {
    id: 'chemical',
    nameKey: 'wheel.categoryChemical',
    color: '#6B7280',
    origins: ['secondary'],
    introKey: 'wheel.categoryChemicalIntro',
    subcategories: [
      { nameKey: 'wheel.chemicalSulfur', descriptorsKey: 'wheel.chemicalSulfurDescriptors', winesKey: 'wheel.chemicalSulfurWines', noteKey: 'wheel.chemicalSulfurNote' },
      { nameKey: 'wheel.chemicalFermentation', descriptorsKey: 'wheel.chemicalFermentationDescriptors', winesKey: 'wheel.chemicalFermentationWines' },
      { nameKey: 'wheel.chemicalPetrol', descriptorsKey: 'wheel.chemicalPetrolDescriptors', winesKey: 'wheel.chemicalPetrolWines', noteKey: 'wheel.chemicalPetrolNote' },
    ],
  },
]

const WHEEL_KEYS = CATEGORIES.map(c => `wheel-${c.id}`)

// ── Wheel geometry — two concentric rings ───────────────────────
// Inner ring = 6 families (equal wedges). Outer ring = each family's
// own aromas, subdividing that family's angular span proportionally —
// so a family with 5 aromas gets thinner outer slices than one with 2.
// This mirrors the real, printed wine aroma wheels this module is
// modeled on (inner tier = broad family, outer tier = specific aroma).

function polarToCartesian(cx, cy, r, angleDeg) {
  const a = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}

// Annular (donut-slice) wedge, from rInner to rOuter, startAngle to endAngle.
function annularWedgePath(cx, cy, rInner, rOuter, startAngle, endAngle) {
  const p1 = polarToCartesian(cx, cy, rOuter, startAngle)
  const p2 = polarToCartesian(cx, cy, rOuter, endAngle)
  const p3 = polarToCartesian(cx, cy, rInner, endAngle)
  const p4 = polarToCartesian(cx, cy, rInner, startAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return `M ${p1.x} ${p1.y} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${rInner} ${rInner} 0 ${largeArc} 0 ${p4.x} ${p4.y} Z`
}

function labelPosition(cx, cy, r, startAngle, endAngle) {
  const mid = (startAngle + endAngle) / 2
  return polarToCartesian(cx, cy, r, mid)
}

// Lightens a hex color toward white by `amt` (0–1) — used for the outer
// ring so each aroma reads as "belonging to" its family's color.
function lightenColor(hex, amt) {
  const n = parseInt(hex.slice(1), 16)
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
  r = Math.round(r + (255 - r) * amt)
  g = Math.round(g + (255 - g) * amt)
  b = Math.round(b + (255 - b) * amt)
  return `rgb(${r}, ${g}, ${b})`
}

// ── Sub-components ───────────────────────────────────────────────

function OriginBadge({ origin }) {
  const { t } = useTranslation()
  const info = ORIGIN_INFO[origin]
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: info.bg, color: info.color }}>
      {t(info.labelKey)}
    </span>
  )
}

// Controlled by the parent (isOpen/onToggle as props, no internal state) so
// the parent's openSubs array stays the single source of truth.
function SubcategoryCard({ sub, categoryColor, isOpen, onToggle }) {
  const { t } = useTranslation()
  const descriptors = t(sub.descriptorsKey).split(' · ')
  return (
    <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden mb-2">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: categoryColor }} />
          <span className="text-sm font-medium text-[var(--ink)]">{t(sub.nameKey)}</span>
        </div>
        <i className={`ti ${isOpen ? 'ti-chevron-up' : 'ti-chevron-down'} text-sm text-[var(--muted)]`} aria-hidden="true"></i>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 border-t border-[var(--border-soft)] pt-3">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {descriptors.map((d, i) => (
              <span key={i} className="text-xs bg-[var(--border-soft)] text-[var(--ink-soft)] px-2.5 py-1 rounded-full">{d}</span>
            ))}
          </div>
          <div className="flex items-start gap-2 mb-2">
            <span className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide flex-shrink-0 mt-0.5">{t('wheel.findItIn')}</span>
            <span className="text-sm text-[var(--burgundy)] font-medium">{t(sub.winesKey)}</span>
          </div>
          {sub.noteKey && (
            <p className="text-xs text-[var(--forest)] bg-[var(--forest-light)] rounded-lg px-3 py-2 mt-2 leading-relaxed">
              ✦ {t(sub.noteKey)}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────

export default function Wheel() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const {
    markModuleComplete, unmarkModuleComplete, completedModules,
    exerciseProgress, toggleExercise, resetExerciseProgress,
  } = useAppStore()

  const [activeCategory, setActiveCategory] = useState(null)
  const [openSubs, setOpenSubs] = useState([])
  const detailRef = useRef(null)

  const finished = completedModules.includes('wheel')

  const n = CATEGORIES.length
  const wedgeAngle = 360 / n
  const size = 320
  const cx = size / 2
  const cy = size / 2
  const rInner0 = 50
  const rInner1 = 112
  const rOuter0 = 116
  const rOuter1 = 154

  const exploredCount = CATEGORIES.filter(c => exerciseProgress[`wheel-${c.id}`]).length
  const allExplored = exploredCount === CATEGORIES.length

  function selectCategory(id) {
    setActiveCategory(prev => (prev === id ? null : id))
    setOpenSubs([])
  }

  function selectOuterWedge(catId, subIndex) {
    const alreadyFocused = activeCategory === catId && openSubs.length === 1 && openSubs[0] === subIndex
    setActiveCategory(catId)
    setOpenSubs(alreadyFocused ? [] : [subIndex])
    if (!alreadyFocused) markSubExplored(catId)
    requestAnimationFrame(() => {
      detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  function toggleSub(index) {
    setOpenSubs(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index])
  }

  function markSubExplored(catId) {
    if (!exerciseProgress[`wheel-${catId}`]) {
      toggleExercise(`wheel-${catId}`)
    }
  }

  function completeModule() {
    markModuleComplete('wheel')
  }

  // Resets to exactly first-open state: no category selected, no categories
  // marked explored, module un-completed. Same "Start over" behavior/name as
  // Walkthrough and Nose.
  function startOver() {
    unmarkModuleComplete('wheel')
    resetExerciseProgress(WHEEL_KEYS)
    setActiveCategory(null)
    setOpenSubs([])
  }

  const active = CATEGORIES.find(c => c.id === activeCategory)
  const focusedSub = active && openSubs.length === 1 ? active.subcategories[openSubs[0]] : null

  return (
    <div className="max-w-2xl mx-auto pb-8">

      <div className="bg-gradient-to-br from-[var(--forest)] to-[var(--forest-dark)] px-5 pt-8 pb-5 md:rounded-b-2xl md:mx-4 mb-6">
        <button onClick={() => navigate('/learn')} className="flex items-center gap-2 text-white/60 hover:text-white text-sm mb-3 transition-colors">
          <i className="ti ti-arrow-left" aria-hidden="true"></i> {t('wheel.back')}
        </button>
        <p className="text-xs tracking-[0.1em] text-[var(--gold)] uppercase font-medium mb-2">{t('wheel.eyebrow')}</p>
        <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-5xl text-white italic leading-tight">{t('wheel.title')}</h1>
      </div>

      <div className="px-4">

        {/* Inline notice, not a full-page takeover — matches Walkthrough and
            Nose. Everything below stays visible and interactive. */}
        {finished && (
          <div className="bg-[var(--gold-tint)] border border-[var(--gold)]/25 rounded-xl px-4 py-4 mb-6 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[var(--gold)] flex items-center justify-center flex-shrink-0">
              <i className="ti ti-check text-white text-base" aria-hidden="true"></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--ink)] mb-1">{t('wheel.completeNotice')}</p>
              <p className="text-sm text-[var(--ink-soft)] leading-relaxed mb-3">
                {t('wheel.completeNoticeSub')}
              </p>
              <ModuleCompletionButton onClick={startOver} label={t('wheel.startOver')} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 mb-6">
          {Object.entries(ORIGIN_INFO).map(([key, info]) => (
            <div key={key} className="rounded-xl px-3 py-3" style={{ background: info.bg }}>
              <p className="text-xs font-medium mb-1" style={{ color: info.color }}>{t(info.labelKey)}</p>
              <p className="text-xs leading-snug" style={{ color: info.color, opacity: 0.85 }}>{t(info.descKey)}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-[var(--muted)] mb-2">{t('wheel.progress', { count: exploredCount })}</p>
        <div className="flex gap-1 mb-6">
          {CATEGORIES.map(c => (
            <div key={c.id} className="flex-1 h-0.5 rounded-full transition-all duration-300"
              style={{ background: exerciseProgress[`wheel-${c.id}`] ? c.color : 'var(--border)' }} />
          ))}
        </div>

        <div className="flex justify-center mb-2">
          <svg viewBox={`0 0 ${size} ${size}`} width="290" height="290" role="img" aria-label="Interactive two-ring flavour wheel: inner ring is aroma families, outer ring is specific aromas within each family">
            <title>{t('wheel.title')}</title>
            {CATEGORIES.map((cat, i) => {
              const startAngle = i * wedgeAngle
              const endAngle = (i + 1) * wedgeAngle
              const isActive = activeCategory === cat.id
              const isExplored = !!exerciseProgress[`wheel-${cat.id}`]
              const innerLabelPos = labelPosition(cx, cy, (rInner0 + rInner1) / 2, startAngle, endAngle)
              const subAngle = (endAngle - startAngle) / cat.subcategories.length
              return (
                <g key={cat.id}>
                  <path
                    className="wheel-wedge"
                    onClick={() => selectCategory(cat.id)}
                    d={annularWedgePath(cx, cy, rInner0, rInner1, startAngle, endAngle)}
                    fill={cat.color}
                    opacity={isActive ? 1 : isExplored ? 0.9 : 0.65}
                    stroke={isActive ? 'var(--gold)' : '#F7F4EF'}
                    strokeWidth={isActive ? 3 : 2}
                    style={{ cursor: 'pointer', transition: 'opacity 0.25s ease, stroke-width 0.25s ease' }}
                  />
                  <text x={innerLabelPos.x} y={innerLabelPos.y} textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="500" fill="#fff" style={{ pointerEvents: 'none' }}>
                    {t(cat.nameKey).split(' ')[0]}
                  </text>
                  {isExplored && (
                    <text x={innerLabelPos.x} y={innerLabelPos.y + 14} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="#fff" style={{ pointerEvents: 'none' }}>
                      ✓
                    </text>
                  )}
                  {cat.subcategories.map((sub, j) => {
                    const s0 = startAngle + j * subAngle
                    const s1 = startAngle + (j + 1) * subAngle
                    const isSubFocused = isActive && openSubs.length === 1 && openSubs[0] === j
                    const subLabelPos = labelPosition(cx, cy, (rOuter0 + rOuter1) / 2, s0, s1)
                    return (
                      <g key={j}>
                        <path
                          className="wheel-wedge"
                          onClick={() => selectOuterWedge(cat.id, j)}
                          d={annularWedgePath(cx, cy, rOuter0, rOuter1, s0, s1)}
                          fill={lightenColor(cat.color, 0.45)}
                          opacity={isSubFocused ? 1 : isActive ? 0.85 : activeCategory ? 0.3 : 0.75}
                          stroke={isSubFocused ? 'var(--gold)' : '#F7F4EF'}
                          strokeWidth={isSubFocused ? 2.5 : 1.5}
                          style={{ cursor: 'pointer', transition: 'opacity 0.25s ease, stroke-width 0.25s ease' }}
                        />
                        <text
                          x={subLabelPos.x}
                          y={subLabelPos.y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize="8"
                          fontWeight="500"
                          fill={cat.color}
                          style={{ pointerEvents: 'none' }}
                        >
                          {t(sub.nameKey).split(' ')[0]}
                        </text>
                      </g>
                    )
                  })}
                </g>
              )
            })}
            <circle cx={cx} cy={cy} r={rInner0 - 6} fill="#F7F4EF" stroke="var(--border)" strokeWidth="1" />
            <text x={cx} y={cy - 6} textAnchor="middle" fontSize="12" fontWeight="500" fill="var(--ink)">
              {active ? t(active.nameKey).split(' ')[0] : 'Tap a'}
            </text>
            <text x={cx} y={cy + 10} textAnchor="middle" fontSize="12" fontWeight="500" fill="var(--ink)">
              {active ? (focusedSub ? t(focusedSub.nameKey) : `${active.subcategories.length} aromas`) : 'slice'}
            </text>
          </svg>
        </div>

        <div ref={detailRef}>
          {active ? (
            <div className="mt-4">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: active.color }} />
                <h2 className="font-['Cormorant_Garamond'] text-2xl text-[var(--ink)]">{t(active.nameKey)}</h2>
                <div className="flex gap-1 ml-auto">
                  {active.origins.map(o => <OriginBadge key={o} origin={o} />)}
                </div>
              </div>
              <p className="text-sm text-[var(--ink-soft)] leading-relaxed mb-4">{t(active.introKey)}</p>

              {active.subcategories.map((sub, i) => (
                <SubcategoryCard
                  key={i}
                  sub={sub}
                  categoryColor={active.color}
                  isOpen={openSubs.includes(i)}
                  onToggle={() => { toggleSub(i); markSubExplored(active.id) }}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--muted)] text-center mt-4 mb-2">{t('wheel.tapInstructions')}</p>
          )}
        </div>

        {allExplored && !finished && (
          <button
            onClick={completeModule}
            className="w-full mt-6 py-3 rounded-xl text-white text-sm font-medium transition-colors bg-[var(--forest)] hover:bg-[var(--forest-dark)]"
          >
            {t('wheel.completeModuleButton')}
          </button>
        )}
      </div>
    </div>
  )
}
