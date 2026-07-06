import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../store/useAppStore'
import { Badge } from '../components/ui'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import vineyardImg from '../assets/vineyard.jpg'

// ── Data ────────────────────────────────────────────────────────
const MODULES = [
  { id: 'walkthrough', to: '/learn/walkthrough', label: 'Tasting walkthrough', sub: 'The 5-step ritual, plain language.', duration: '5 min' },
  { id: 'nose',        to: '/learn/nose',         label: 'Train your nose',      sub: '30-day programme, 5 min a day.',   duration: '30 days' },
  { id: 'wheel',       to: '/learn/wheel',        label: 'Flavour wheel',        sub: 'Explore aromas interactively.',     duration: '5 min' },
  { id: 'bottle',      to: '/learn/bottle',       label: 'First bottle guide',   sub: 'One wine, guided from start to finish.', duration: '8 min', badge: 'New' },
  { id: 'quiz',        to: '/learn/quiz',         label: 'Quick quiz',           sub: 'Test what you know — 4 questions.', duration: '4 min' },
]

const TIPS = [
  'Take a first sniff before swirling — the most delicate aromas disappear the moment you swirl.',
  'Tannin is not bitterness. It is a dryness on the gums — like strong tea. Once you feel it, you will recognise it every time.',
  'A long finish is one of the clearest signs of wine quality. Count the seconds after swallowing.',
  'Swirling wakes the wine up. It helps heavier aromas — fruit, earth, spice — escape into the glass.',
  'Write three words immediately after tasting. Your first impressions are always your most honest.',
  'Smell the inside of your wrist to reset your nose between wines. It works better than coffee beans.',
  'Acidity is what makes wine refreshing alongside food. High acidity = the wine makes your mouth water.',
  'Colour at the rim tells you the age. Brick-orange edges on a red wine usually mean it has some years on it.',
]

// ── Component ───────────────────────────────────────────────────
export default function Home() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { completedModules, journalEntries } = useAppStore()

  const total = MODULES.length
  const done  = completedModules.length
  const pct   = total > 0 ? (done / total) * 100 : 0

  // Tip of the day — stable per day, not random on every render
  const todayTip = TIPS[new Date().getDate() % TIPS.length]

  // Hero copy changes after first lesson
  const hasStarted = done > 0
  const heroEyebrow  = '✦ Your pocket sommelier school'
  const heroHeading  = hasStarted ? 'Welcome back.' : 'Learn to taste wine\nwith confidence.'
  const heroBody     = hasStarted
    ? 'Continue your wine journey — your next lesson is ready.'
    : 'Practical lessons, interactive tools,\nand personal tasting notes.'

  // Journal subtitle
  const journalSub = journalEntries.length === 0
    ? 'Start recording your tastings'
    : `${journalEntries.length} tasting ${journalEntries.length === 1 ? 'note' : 'notes'}`

  // Active lesson = first uncompleted
  const activeIdx = MODULES.findIndex(m => !completedModules.includes(m.id))

  return (
    <div className="max-w-3xl mx-auto pb-8">

      {/* ── Hero ───────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--forest)] to-[var(--forest-dark)] md:rounded-b-2xl md:mx-4">

        {/* Vineyard background image — very low opacity */}
        <img
          src={vineyardImg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
          style={{ opacity: 0.07, mixBlendMode: 'luminosity' }}
        />

        {/* Hero content */}
        <div className="relative z-10 px-5 pt-10 pb-7">

          {/* Top row: logo + language switcher — mobile only */}
          <div className="flex items-center justify-between mb-6 md:hidden">
            <span className="font-['Cormorant_Garamond'] text-2xl text-white tracking-tight">Palate</span>
            <LanguageSwitcher dark />
          </div>

          {/* Eyebrow */}
          <p className="text-xs tracking-[0.14em] text-[var(--gold)] uppercase font-medium mb-3">
            {heroEyebrow}
          </p>

          {/* Heading */}
          <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-white leading-tight mb-3" style={{ whiteSpace: 'pre-line' }}>
            {heroHeading}
          </h1>

          {/* Body */}
          <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs font-light" style={{ whiteSpace: 'pre-line' }}>
            {heroBody}
          </p>

          {/* CTA cards */}
          <div className="grid grid-cols-2 gap-3">
            <Link to="/planner"
              className="flex items-center gap-3 bg-[var(--burgundy)] hover:bg-[var(--burgundy-dark)] transition-colors rounded-xl px-4 py-3.5 group">
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                <i className="ti ti-wine text-white text-sm" aria-hidden="true"></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-white leading-tight">Plan a tasting</p>
                <p className="text-xs text-white/55 mt-0.5">Wines • Food • Guests</p>
              </div>
              <i className="ti ti-chevron-right text-white/40 text-sm flex-shrink-0" aria-hidden="true"></i>
            </Link>

            <Link to="/journal"
              className="flex items-center gap-3 bg-white/10 hover:bg-white/15 border border-white/15 transition-colors rounded-xl px-4 py-3.5">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <i className="ti ti-notebook text-white/70 text-sm" aria-hidden="true"></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-white leading-tight">My journal</p>
                <p className="text-xs text-white/45 mt-0.5 truncate">{journalSub}</p>
              </div>
              <i className="ti ti-chevron-right text-white/30 text-sm flex-shrink-0" aria-hidden="true"></i>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Continue learning ───────────────────────────────────── */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-baseline justify-between mb-1">
          <h2 className="font-['Cormorant_Garamond'] text-2xl text-[var(--ink)]">Continue learning</h2>
          <Link to="/learn" className="text-xs text-[var(--muted)] hover:text-[var(--forest)] transition-colors flex items-center gap-1">
            View all <i className="ti ti-chevron-right text-xs" aria-hidden="true"></i>
          </Link>
        </div>

        {/* Progress text */}
        <p className="text-xs text-[var(--muted)] mb-2">
          {done} of {total} {done === 1 ? 'lesson' : 'lessons'} complete
        </p>

        {/* Progress bar — 5 segments */}
        <div className="flex gap-1 mb-5">
          {MODULES.map((m, i) => (
            <div key={m.id} className="flex-1 h-0.5 rounded-full transition-all duration-500"
              style={{ background: completedModules.includes(m.id) ? '#264D3B' : '#E2DDD6' }}
            />
          ))}
        </div>

        {/* Lesson list */}
        <div className="space-y-2">
          {MODULES.map((m, idx) => {
            const isDone   = completedModules.includes(m.id)
            const isActive = idx === activeIdx
            const isLocked = !isDone && idx > activeIdx

            return (
              <div
                key={m.id}
                onClick={() => !isLocked && navigate(m.to)}
                className={`flex items-center gap-4 rounded-xl px-4 py-3.5 transition-colors ${
                  isActive
                    ? 'bg-white border border-[var(--forest)]/30 cursor-pointer hover:border-[var(--forest)]/60'
                    : isDone
                      ? 'bg-white border border-[var(--border)] cursor-pointer hover:border-[var(--forest)]'
                      : 'bg-white border border-[var(--border)] opacity-60 cursor-default'
                }`}
              >
                {/* Roman numeral */}
                <span className={`font-['Cormorant_Garamond'] text-xl w-7 text-center leading-none flex-shrink-0 ${
                  isDone ? 'text-[var(--forest)]' : isActive ? 'text-[var(--forest)]' : 'text-[var(--border)]'
                }`}>
                  {['I','II','III','IV','V'][idx]}
                </span>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`text-sm font-medium ${isDone || isActive ? 'text-[var(--ink)]' : 'text-[var(--muted)]'}`}>
                      {m.label}
                    </p>
                    {m.badge && !isDone && (
                      <span className="text-xs bg-[var(--burgundy)] text-white px-1.5 py-0.5 rounded-md font-medium" style={{ fontSize: 10 }}>
                        {m.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--muted)] mt-0.5 truncate">{m.sub}</p>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* Duration */}
                  <span className="text-xs text-[var(--muted)] bg-[var(--border-soft)] px-2 py-0.5 rounded-full">
                    {m.duration}
                  </span>

                  {/* State indicator */}
                  {isDone ? (
                    <i className="ti ti-check text-[var(--forest)] text-sm" aria-hidden="true"></i>
                  ) : isActive ? (
                    <span className="text-xs font-medium text-[var(--forest)] flex items-center gap-1">
                      Continue <i className="ti ti-arrow-right text-xs" aria-hidden="true"></i>
                    </span>
                  ) : (
                    <i className="ti ti-lock text-[var(--border)] text-sm" aria-hidden="true"></i>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Tip of the day ──────────────────────────────────────── */}
      <div className="px-4 pb-4">
        <div
          onClick={() => navigate('/learn')}
          className="flex items-start gap-4 bg-[var(--gold-light)] border border-[var(--gold)]/20 rounded-xl px-4 py-4 cursor-pointer hover:border-[var(--gold)]/40 transition-colors group"
        >
          <div className="w-9 h-9 rounded-full bg-[var(--gold)] flex items-center justify-center flex-shrink-0 mt-0.5">
            <i className="ti ti-bulb text-white text-base" aria-hidden="true"></i>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[var(--gold)] uppercase tracking-wide mb-1">Tip of the day</p>
            <p className="text-sm text-[var(--ink-soft)] leading-relaxed">{todayTip}</p>
          </div>
          <i className="ti ti-chevron-right text-[var(--gold)]/40 group-hover:text-[var(--gold)] transition-colors text-sm mt-1 flex-shrink-0" aria-hidden="true"></i>
        </div>
      </div>

    </div>
  )
}
