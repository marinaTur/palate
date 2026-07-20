import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import vineyardImg from '../assets/vineyard.jpg'

// ── Data ────────────────────────────────────────────────────────
// Quiz is intentionally excluded from this list — it's treated as its own
// standalone feature (more "entertainment" than curriculum), not one of
// the sequential lessons. See its own dashboard plate below instead.
const LESSON_MODULES = [
  { id: 'walkthrough', to: '/learn/walkthrough' },
  { id: 'nose',        to: '/learn/nose' },
  { id: 'wheel',        to: '/learn/wheel' },
  { id: 'bottle',       to: '/learn/bottle' },
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
  const { completedModules, journalEntries, quizHighScore } = useAppStore()

  const [shareCopied, setShareCopied] = useState(false)

  const lessonsTotal = LESSON_MODULES.length
  const lessonsDone  = LESSON_MODULES.filter(m => completedModules.includes(m.id)).length

  // Tip of the day — stable per day, not random on every render
  const todayTip = TIPS[new Date().getDate() % TIPS.length]

  // Hero copy changes after first lesson
  const hasStarted = lessonsDone > 0
  const heroEyebrow = '✦ Your pocket sommelier school'
  const heroHeading = hasStarted ? 'Welcome back.' : 'Learn to taste wine with confidence.'

  // Journal subtitle
  const journalSub = journalEntries.length === 0
    ? 'Start recording your tastings'
    : `${journalEntries.length} tasting ${journalEntries.length === 1 ? 'note' : 'notes'}`

  // Quiz subtitle — shows a real score once the Quiz module has been played,
  // reusing the existing quizHighScore field already in the store.
  const quizSub = quizHighScore > 0 ? `Best score: ${quizHighScore}/4` : 'Test what you know'

  async function handleShare() {
    const shareData = {
      title: 'Palate — Your Pocket Sommelier School',
      text: 'Learn to taste wine with confidence — practical lessons, interactive tools, and personal tasting notes.',
      url: window.location.origin,
    }
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        // User cancelled the native share sheet — nothing to do.
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareData.url)
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    }
  }

  return (
    <div className="max-w-3xl mx-auto pb-8">

      {/* ── Hero — compact, matching Learn's proportions ───────── */}
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
        <div className="relative z-10 px-5 pt-8 pb-5 md:pt-12 md:pb-6">

          {/* Top row: logo + share + language switcher — mobile only */}
          <div className="flex items-center justify-between mb-3 md:hidden">
            <span className="font-['Cormorant_Garamond'] text-xl text-white tracking-tight">Palate</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                aria-label="Share Palate"
                className="w-7 h-7 rounded-full bg-white/12 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0"
              >
                <i className={`ti ${shareCopied ? 'ti-check' : 'ti-share-2'} text-white text-sm`} aria-hidden="true"></i>
              </button>
              <LanguageSwitcher dark />
            </div>
          </div>

          {/* Eyebrow */}
          <p className="text-xs tracking-[0.1em] text-[var(--gold)] uppercase font-medium mb-2">
            {heroEyebrow}
          </p>

          {/* Heading — single line, italic, matching Learn's hero */}
          <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-5xl text-white italic leading-tight">
            {heroHeading}
          </h1>
        </div>
      </div>

      <div className="px-4">

        {/* ── Dashboard — four equal-weight plates ────────────── */}
        <div className="grid grid-cols-2 gap-3 pt-5 mb-6">

          {/* Plan a tasting */}
          <Link to="/planner"
            className="flex flex-col bg-[var(--burgundy)] hover:bg-[var(--burgundy-dark)] transition-colors rounded-xl px-4 py-3.5 min-h-[104px]">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center mb-2">
              <i className="ti ti-wine text-white text-sm" aria-hidden="true"></i>
            </div>
            <p className="font-medium text-sm text-white leading-tight">Plan a tasting</p>
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
            <div className="w-8 h-8 rounded-lg bg-[var(--gold-light)] flex items-center justify-center mb-2">
              <i className="ti ti-trophy text-[var(--gold)] text-sm" aria-hidden="true"></i>
            </div>
            <p className="font-medium text-sm text-[var(--ink)] leading-tight">Quiz</p>
            <p className="text-xs text-[var(--muted)] mt-0.5">{quizSub}</p>
          </Link>

        </div>
      </div>

      {/* ── Tip of the day ──────────────────────────────────────── */}
      <div className="px-4 pt-1">
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
