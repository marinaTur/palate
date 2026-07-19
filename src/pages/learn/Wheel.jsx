import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'

// ── Data ─────────────────────────────────────────────────────────

const ORIGIN_INFO = {
  primary: {
    label: 'Primary',
    color: '#264D3B',
    bg: '#E4EDE0',
    desc: 'From the grape itself — fruit, floral, herbal notes. This is what you catch on the first sniff, before swirling.',
  },
  secondary: {
    label: 'Secondary',
    color: '#7A5230',
    bg: '#F0E6DC',
    desc: 'From winemaking — oak, toast, vanilla, butter. Released and amplified once you swirl.',
  },
  tertiary: {
    label: 'Tertiary',
    color: '#6B4A3A',
    bg: '#EFE6E0',
    desc: 'From aging — earth, leather, dried fruit, mushroom. Found mostly in mature wines.',
  },
}

const CATEGORIES = [
  {
    id: 'fruit',
    name: 'Fruit',
    color: '#C0392B',
    origins: ['primary'],
    intro: 'The most common family in wine — and usually the easiest to spot.',
    subcategories: [
      { name: 'Citrus', descriptors: ['Lemon', 'Grapefruit', 'Lime'], wineConnection: 'Sauvignon Blanc · Riesling' },
      { name: 'Stone fruit', descriptors: ['Peach', 'Apricot', 'Nectarine'], wineConnection: 'Viognier · Chardonnay' },
      { name: 'Berry', descriptors: ['Strawberry', 'Raspberry', 'Blackcurrant', 'Blackberry'], wineConnection: 'Pinot Noir · Cabernet Sauvignon' },
      { name: 'Tropical', descriptors: ['Pineapple', 'Mango', 'Passionfruit'], wineConnection: 'New Zealand Sauvignon Blanc' },
      { name: 'Dried & cooked', descriptors: ['Raisin', 'Fig', 'Prune', 'Baked apple'], wineConnection: 'Amarone · aged Rioja · Port', note: 'Same fresh-vs-dried shift you trained in Nose Training, Week 2.' },
    ],
  },
  {
    id: 'floral',
    name: 'Floral',
    color: '#B8558A',
    origins: ['primary'],
    intro: 'Delicate and volatile — usually strongest on the very first sniff, before it fades.',
    subcategories: [
      { name: 'White flowers', descriptors: ['Elderflower', 'Orange blossom'], wineConnection: 'Riesling · Muscat' },
      { name: 'Rose & violet', descriptors: ['Rose petal', 'Violet'], wineConnection: 'Gewürztraminer · Nebbiolo' },
    ],
  },
  {
    id: 'herbal',
    name: 'Herbal & Green',
    color: '#5A8A3C',
    origins: ['primary'],
    intro: 'Fresh, sometimes sharp — comes directly from the grape and its leaves.',
    subcategories: [
      { name: 'Fresh herb', descriptors: ['Mint', 'Basil', 'Thyme'], wineConnection: 'Sauvignon Blanc' },
      { name: 'Vegetal', descriptors: ['Green bell pepper', 'Grass', 'Asparagus'], wineConnection: 'Sauvignon Blanc · Cabernet Franc' },
    ],
  },
  {
    id: 'spice',
    name: 'Spice',
    color: '#B98A3D',
    origins: ['primary', 'secondary'],
    intro: 'Some spice comes from the grape itself, some from the oak barrel — this category spans both.',
    subcategories: [
      { name: 'Pepper', descriptors: ['Black pepper', 'White pepper'], wineConnection: 'Syrah / Shiraz · Grüner Veltliner', note: 'This is rotundone — the same compound you trained with in Nose Training, Week 4.' },
      { name: 'Baking spice', descriptors: ['Cinnamon', 'Clove', 'Vanilla', 'Nutmeg'], wineConnection: 'Oak-aged reds · Rioja' },
    ],
  },
  {
    id: 'earth',
    name: 'Earth & Mineral',
    color: '#6B4A3A',
    origins: ['tertiary'],
    intro: 'Often the sign of an aged wine, or a very specific terroir. Subtle, and easy to miss at first.',
    subcategories: [
      { name: 'Mineral', descriptors: ['Wet stone', 'Flint', 'Chalk'], wineConnection: 'Chablis · Sancerre' },
      { name: 'Forest floor', descriptors: ['Mushroom', 'Wet leaves', 'Truffle'], wineConnection: 'Aged Pinot Noir · Burgundy' },
    ],
  },
  {
    id: 'oak',
    name: 'Oak & Toast',
    color: '#7A5230',
    origins: ['secondary'],
    intro: 'Not from the grape at all — this is entirely a winemaking decision, from time spent in barrel.',
    subcategories: [
      { name: 'Sweet oak', descriptors: ['Vanilla', 'Coconut', 'Caramel'], wineConnection: 'American oak · Chardonnay', note: 'Same vanilla + cedar exercise from Nose Training, Week 4.' },
      { name: 'Toasted oak', descriptors: ['Toast', 'Smoke', 'Cedar'], wineConnection: 'French oak · Cabernet' },
    ],
  },
]

const WHEEL_KEYS = CATEGORIES.map(c => `wheel-${c.id}`)

// ── Wheel geometry — 6 equal wedges ─────────────────────────────

function polarToCartesian(cx, cy, r, angleDeg) {
  const a = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}

function wedgePath(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle)
  const end = polarToCartesian(cx, cy, r, startAngle)
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`
}

function labelPosition(cx, cy, r, startAngle, endAngle) {
  const mid = (startAngle + endAngle) / 2
  return polarToCartesian(cx, cy, r * 0.68, mid)
}

// ── Sub-components ───────────────────────────────────────────────

function OriginBadge({ origin }) {
  const info = ORIGIN_INFO[origin]
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: info.bg, color: info.color }}>
      {info.label}
    </span>
  )
}

// Fully controlled now — no internal state — so it can never carry stale
// "open" state across a category switch (fix for issue #1).
function SubcategoryCard({ sub, categoryColor, isOpen, onToggle }) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden mb-2">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: categoryColor }} />
          <span className="text-sm font-medium text-[var(--ink)]">{sub.name}</span>
        </div>
        <i className={`ti ${isOpen ? 'ti-chevron-up' : 'ti-chevron-down'} text-sm text-[var(--muted)]`} aria-hidden="true"></i>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 border-t border-[var(--border-soft)] pt-3">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {sub.descriptors.map((d, i) => (
              <span key={i} className="text-xs bg-[var(--border-soft)] text-[var(--ink-soft)] px-2.5 py-1 rounded-full">{d}</span>
            ))}
          </div>
          <div className="flex items-start gap-2 mb-2">
            <span className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide flex-shrink-0 mt-0.5">Find it in</span>
            <span className="text-sm text-[var(--burgundy)] font-medium">{sub.wineConnection}</span>
          </div>
          {sub.note && (
            <p className="text-xs text-[var(--forest)] bg-[var(--forest-light)] rounded-lg px-3 py-2 mt-2 leading-relaxed">
              ✦ {sub.note}
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
  const {
    markModuleComplete, unmarkModuleComplete, completedModules,
    exerciseProgress, toggleExercise, resetExerciseProgress,
  } = useAppStore()

  const [activeCategory, setActiveCategory] = useState(null)
  // Which subcategory cards are open, for the CURRENTLY selected category only.
  // Reset to empty every time a wedge is tapped — this is what guarantees
  // the sub-list always opens closed (fix #1), regardless of prior state.
  const [openSubs, setOpenSubs] = useState([])

  // Derived directly from the store — never a separate local flag that could
  // fall out of sync with completedModules.
  const finished = completedModules.includes('wheel')

  const n = CATEGORIES.length
  const wedgeAngle = 360 / n
  const size = 300
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 4

  const exploredCount = CATEGORIES.filter(c => exerciseProgress[`wheel-${c.id}`]).length
  const allExplored = exploredCount === CATEGORIES.length

  function selectCategory(id) {
    setActiveCategory(prev => (prev === id ? null : id))
    setOpenSubs([]) // always start the sub-list closed on any wheel tap
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

  // Fix #3 — resets the module to exactly its first-open state:
  // no category selected, no categories marked explored, module un-completed.
  function startOver() {
    unmarkModuleComplete('wheel')
    resetExerciseProgress(WHEEL_KEYS)
    setActiveCategory(null)
    setOpenSubs([])
  }

  const active = CATEGORIES.find(c => c.id === activeCategory)

  return (
    <div className="max-w-2xl mx-auto pb-8">

      {/* Hero — compact, matching Home/Learn proportions */}
      <div className="bg-gradient-to-br from-[var(--forest)] to-[var(--forest-dark)] px-5 pt-8 pb-5 md:rounded-b-2xl md:mx-4 mb-6">
        <button onClick={() => navigate('/learn')} className="flex items-center gap-2 text-white/60 hover:text-white text-sm mb-3 transition-colors">
          <i className="ti ti-arrow-left" aria-hidden="true"></i> Back to lessons
        </button>
        <p className="text-xs tracking-[0.1em] text-[var(--gold)] uppercase font-medium mb-2">Explore aromas interactively</p>
        <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-5xl text-white italic leading-tight">Flavour wheel</h1>
      </div>

      <div className="px-4">

        {/* Fix #2 — inline congratulations notice, NOT a full-page takeover.
            Everything below stays visible and interactive. */}
        {finished && (
          <div className="bg-[var(--gold-light)] border border-[var(--gold)]/25 rounded-xl px-4 py-4 mb-6 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[var(--gold)] flex items-center justify-center flex-shrink-0">
              <i className="ti ti-check text-white text-base" aria-hidden="true"></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--ink)] mb-1">You have a vocabulary now.</p>
              <p className="text-sm text-[var(--ink-soft)] leading-relaxed mb-3">
                Next time you taste, don't try to find every aroma. Just ask: is this Primary, Secondary, or Tertiary?
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

        {/* Primary / Secondary / Tertiary framework */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {Object.entries(ORIGIN_INFO).map(([key, info]) => (
            <div key={key} className="rounded-xl px-3 py-3" style={{ background: info.bg }}>
              <p className="text-xs font-medium mb-1" style={{ color: info.color }}>{info.label}</p>
              <p className="text-xs leading-snug" style={{ color: info.color, opacity: 0.85 }}>{info.desc}</p>
            </div>
          ))}
        </div>

        {/* Progress */}
        <p className="text-xs text-[var(--muted)] mb-2">{exploredCount} of {CATEGORIES.length} categories explored</p>
        <div className="flex gap-1 mb-6">
          {CATEGORIES.map(c => (
            <div key={c.id} className="flex-1 h-0.5 rounded-full transition-all duration-300"
              style={{ background: exerciseProgress[`wheel-${c.id}`] ? c.color : 'var(--border)' }} />
          ))}
        </div>

        {/* The wheel */}
        <div className="flex justify-center mb-2">
          <svg viewBox={`0 0 ${size} ${size}`} width="260" height="260" role="img" aria-label="Interactive flavour wheel with six categories">
            <title>Flavour wheel — tap a category to explore</title>
            {CATEGORIES.map((cat, i) => {
              const startAngle = i * wedgeAngle
              const endAngle = (i + 1) * wedgeAngle
              const isActive = activeCategory === cat.id
              const isExplored = !!exerciseProgress[`wheel-${cat.id}`]
              const labelPos = labelPosition(cx, cy, r, startAngle, endAngle)
              return (
                <g key={cat.id} onClick={() => selectCategory(cat.id)} style={{ cursor: 'pointer' }}>
                  <path
                    d={wedgePath(cx, cy, r, startAngle, endAngle)}
                    fill={cat.color}
                    opacity={isActive ? 1 : isExplored ? 0.85 : 0.65}
                    stroke="#F7F4EF"
                    strokeWidth="3"
                  />
                  <text x={labelPos.x} y={labelPos.y} textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="500" fill="#fff" style={{ pointerEvents: 'none' }}>
                    {cat.name.split(' ')[0]}
                  </text>
                  {isExplored && (
                    <text x={labelPos.x} y={labelPos.y + 16} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#fff" style={{ pointerEvents: 'none' }}>
                      ✓
                    </text>
                  )}
                </g>
              )
            })}
            <circle cx={cx} cy={cy} r={size * 0.16} fill="#F7F4EF" stroke="var(--border)" strokeWidth="1" />
            <text x={cx} y={cy - 4} textAnchor="middle" fontSize="11" fontWeight="500" fill="var(--ink)">Tap a</text>
            <text x={cx} y={cy + 10} textAnchor="middle" fontSize="11" fontWeight="500" fill="var(--ink)">category</text>
          </svg>
        </div>

        {/* Selected category detail */}
        {active ? (
          <div className="mt-4">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: active.color }} />
              <h2 className="font-['Cormorant_Garamond'] text-2xl text-[var(--ink)]">{active.name}</h2>
              <div className="flex gap-1 ml-auto">
                {active.origins.map(o => <OriginBadge key={o} origin={o} />)}
              </div>
            </div>
            <p className="text-sm text-[var(--ink-soft)] leading-relaxed mb-4">{active.intro}</p>

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
          <p className="text-sm text-[var(--muted)] text-center mt-4 mb-2">Tap any wedge above to see its sub-categories, specific aromas, and where to find them in real wine.</p>
        )}

        {/* Complete module — hidden once already finished, since the top notice takes over */}
        {allExplored && !finished && (
          <button
            onClick={completeModule}
            className="w-full mt-6 py-3 rounded-xl text-white text-sm font-medium transition-colors bg-[var(--forest)] hover:bg-[var(--forest-dark)]"
          >
            Complete module ✓
          </button>
        )}
      </div>
    </div>
  )
}
