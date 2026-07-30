import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../store/useAppStore'
import { SAMPLE_PLANS_EN, matchSamplePlan } from '../data/samplePlans'
import { Button, Card, Badge } from '../components/ui'

// Presentation metadata (icon + short category tag) for the demo-scenario
// picker below. Kept here rather than in samplePlans.js so the sample-plan
// data there keeps matching the real AI's output shape exactly (see that
// file's header comment). Not run through i18n, for the same reason the
// scenario titles/content in samplePlans.js aren't — this is English-only
// demo presentation, not app chrome. All icons verified against the
// installed @tabler/icons-webfont build before use.
const SCENARIO_META = {
  'three-reds-classic':    { icon: 'ti-glass',    tag: 'Red flight' },
  'summer-whites':         { icon: 'ti-sun',      tag: 'White flight' },
  'celebration-sparkling': { icon: 'ti-confetti', tag: 'Sparkling' },
  'beginner-friendly':     { icon: 'ti-leaf',     tag: 'Mixed · beginner' },
  'cheese-pairing':        { icon: 'ti-cheese',   tag: 'Mixed · pairing' },
}

export default function Planner() {
  const { t, i18n } = useTranslation()
  const { lastPlan, setLastPlan } = useAppStore()
  const [inputs, setInputs] = useState({ wines: '', foods: '', season: '', guests: '', notes: '' })
  const [plan, setPlan]     = useState(lastPlan)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)
  const resultRef = useRef(null)

  const set = (k, v) => setInputs(p => ({ ...p, [k]: v }))
  const hasAnyInput = Object.values(inputs).some(v => v.trim())

  // Which demo scenario (if any) matches the plan currently on screen.
  // Derived from `plan` itself rather than tracked as separate state, so it
  // can never drift out of sync — same principle used for module completion
  // elsewhere in the app (see CLAUDE.md, Architecture conventions).
  const activeScenarioId = plan
    ? SAMPLE_PLANS_EN.find(s => s.plan.title === plan.title)?.id
    : null

  // One-tap-to-result: picking a demo scenario shows its plan immediately,
  // no intermediate form-fill step. Instant — these are local, curated
  // plans, not a network call, so no artificial loading delay here.
  function selectScenario(sample) {
    setPlan(sample.plan)
    setLastPlan(sample.plan)
    requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  // Custom planner form — currently disabled in the UI below ("Coming
  // soon"). Left fully wired (including this function and the `inputs`
  // state above) so re-enabling later is just removing the disabled state,
  // not rebuilding it. Do not remove.
  async function generate() {
    if (!hasAnyInput) return
    setLoading(true); setError(null)
    try {
      await new Promise(resolve => setTimeout(resolve, 900))
      const result = matchSamplePlan(inputs)
      setPlan(result); setLastPlan(result)
    } catch (e) {
      setError(t('planner.errorMessage'))
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--forest)] placeholder:text-[var(--muted)]/60 bg-white"

  return (
    <div className="max-w-2xl mx-auto pb-6">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[var(--forest)] to-[var(--forest-dark)] px-5 pt-12 pb-6 md:rounded-b-2xl md:mx-4 mb-6">
        <p className="text-xs tracking-[0.1em] text-white/45 uppercase mb-2">{t('planner.eyebrow')}</p>
        <h1 className="font-['Cormorant_Garamond'] text-5xl text-white italic leading-none mb-3">{t('planner.title')}</h1>
        <p className="text-white/55 text-sm font-light">{t('planner.subtitle')}</p>
      </div>

      <div className="px-4">
        {/* Demo notice */}
        <div className="bg-[var(--gold-tint)] border border-[var(--gold)]/20 rounded-lg px-4 py-2.5 mb-4 flex items-start gap-2 print:hidden">
          <span className="text-[var(--gold)] text-sm mt-0.5">✦</span>
          <p className="text-xs text-[var(--ink-soft)] leading-relaxed">{t('planner.demoNotice')}</p>
        </div>

        {/* Demo scenario picker — tap a card, see its full plan instantly */}
        <div className="mb-6 print:hidden">
          <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-3">{t('planner.scenariosLabel')}</p>
          <div className="grid grid-cols-2 gap-2.5">
            {SAMPLE_PLANS_EN.map((sample, i) => {
              const meta = SCENARIO_META[sample.id] || {}
              const isActive = activeScenarioId === sample.id
              // If the list has an odd count, let the last card span both
              // columns instead of leaving an awkward gap.
              const spansFull = i === SAMPLE_PLANS_EN.length - 1 && SAMPLE_PLANS_EN.length % 2 !== 0
              return (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => selectScenario(sample)}
                  aria-pressed={isActive}
                  className={`relative text-left bg-white rounded-xl p-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--forest)] focus-visible:ring-offset-2 ${
                    isActive
                      ? 'border-2 border-[var(--burgundy)]'
                      : 'border border-[var(--border)] hover:border-[var(--forest)]/40'
                  } ${spansFull ? 'col-span-2 flex items-center gap-3' : ''}`}
                >
                  {isActive && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[var(--burgundy)] border-2 border-[var(--cream)] flex items-center justify-center">
                      <i className="ti ti-check text-white text-[10px]" aria-hidden="true"></i>
                    </span>
                  )}
                  <div className={`w-7 h-7 rounded-lg bg-[var(--forest-light)] flex items-center justify-center flex-shrink-0 ${spansFull ? '' : 'mb-2'}`}>
                    <i className={`ti ${meta.icon || 'ti-glass'} text-[var(--forest)] text-sm`} aria-hidden="true"></i>
                  </div>
                  <div className={spansFull ? 'flex-1 min-w-0' : ''}>
                    <p className="text-[13px] font-medium text-[var(--ink)] leading-snug">{sample.plan.title}</p>
                    <div className="mt-1.5"><Badge variant="default">{meta.tag}</Badge></div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Plan output — shows the moment a scenario is tapped above */}
        <div ref={resultRef}>
          {plan ? (
            <div className="space-y-4 mb-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl text-[var(--ink)]">{plan.title}</h2>
                  <p className="text-sm text-[var(--muted)] mt-1">{plan.intro}</p>
                </div>
                <button onClick={() => window.print()}
                  className="text-sm border border-[var(--border)] px-3 py-1.5 rounded-lg text-[var(--muted)] hover:border-[var(--forest)] hover:text-[var(--forest)] transition-colors print:hidden flex-shrink-0">
                  {t('planner.printButton')} ↗
                </button>
              </div>

              {/* Wine cards */}
              {plan.wines?.map((w, i) => (
                <div key={i} className="bg-white border border-[var(--border)] border-l-2 border-l-[var(--burgundy)] rounded-xl rounded-l-none p-5">
                  <div className="flex items-start gap-3">
                    <span className="font-['Cormorant_Garamond'] text-2xl text-[var(--burgundy)] font-medium w-6 flex-shrink-0 leading-tight mt-0.5">{w.order}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-medium text-[var(--ink)]">{w.name}</p>
                        <Badge variant="default">{w.type}</Badge>
                        <Badge variant="gold">{w.servingTemp}</Badge>
                      </div>
                      <p className="text-xs text-[var(--muted)] mb-2">{w.region}</p>
                      <p className="text-sm text-[var(--ink-soft)] mb-3">{w.why}</p>
                      {w.foods?.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1">{t('planner.pairsWith')}</p>
                          <div className="flex flex-wrap gap-1">
                            {w.foods.map((f, j) => <Badge key={j} variant="default">{f}</Badge>)}
                          </div>
                        </div>
                      )}
                      {w.tasting_prompts?.length > 0 && (
                        <details className="mt-2">
                          <summary className="text-xs font-medium text-[var(--forest)] cursor-pointer">{t('planner.tastingPrompts')} ›</summary>
                          <ul className="mt-2 space-y-1">
                            {w.tasting_prompts.map((p, j) => (
                              <li key={j} className="text-xs text-[var(--ink-soft)] pl-3 border-l border-[var(--border)]">{p}</li>
                            ))}
                          </ul>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Food plan */}
              {plan.foodPlan && (
                <div className="bg-[var(--gold-tint)] border border-[var(--gold)]/25 rounded-xl p-5">
                  <p className="text-xs font-medium text-[var(--gold)] uppercase tracking-wide mb-2">{t('planner.foodStrategy')}</p>
                  <p className="text-sm text-[var(--ink-soft)]">{plan.foodPlan}</p>
                </div>
              )}

              {/* Hosting tips */}
              {plan.hostingTips?.length > 0 && (
                <div className="bg-white border border-[var(--border)] rounded-xl p-5">
                  <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-3">{t('planner.hostingTips')}</p>
                  <ul className="space-y-2">
                    {plan.hostingTips.map((tip, i) => (
                      <li key={i} className="text-sm text-[var(--ink-soft)] flex gap-2">
                        <span className="text-[var(--forest)] flex-shrink-0">·</span>{tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 mb-8 print:hidden">
              <p className="text-sm text-[var(--muted)]">{t('planner.emptyHint')}</p>
            </div>
          )}
        </div>

        {/* Custom planner form — disabled ("Coming soon"). Fields stay
            visible so people know it's planned, but nothing here responds
            to input; see `generate()` above for why the logic is kept. */}
        <div className="relative opacity-50 pointer-events-none select-none print:hidden">
          <div className="flex items-center gap-2 mb-3">
            <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">{t('planner.buildOwnLabel')}</p>
            <span className="text-[10px] px-2 py-0.5 rounded-full border border-[var(--muted)]/40 text-[var(--muted)] uppercase tracking-wide">
              {t('planner.comingSoon')}
            </span>
          </div>

          <div className="bg-white border border-[var(--border)] rounded-xl p-5">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1.5">{t('planner.winesLabel')}</label>
                <textarea disabled rows={2} value={inputs.wines} onChange={e => set('wines', e.target.value)}
                  placeholder={t('planner.winesPlaceholder')} className={inputCls + " resize-none"} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1.5">{t('planner.foodsLabel')}</label>
                  <input disabled value={inputs.foods} onChange={e => set('foods', e.target.value)} placeholder={t('planner.foodsPlaceholder')} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1.5">{t('planner.seasonLabel')}</label>
                  <select disabled value={inputs.season} onChange={e => set('season', e.target.value)} className={inputCls}>
                    <option value="">{t('planner.seasonAny')}</option>
                    <option value="spring">{t('planner.seasonSpring')}</option>
                    <option value="summer">{t('planner.seasonSummer')}</option>
                    <option value="autumn">{t('planner.seasonAutumn')}</option>
                    <option value="winter">{t('planner.seasonWinter')}</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1.5">{t('planner.guestsLabel')}</label>
                  <input disabled value={inputs.guests} onChange={e => set('guests', e.target.value)} placeholder={t('planner.guestsPlaceholder')} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1.5">{t('planner.notesLabel')}</label>
                  <input disabled value={inputs.notes} onChange={e => set('notes', e.target.value)} placeholder={t('planner.notesPlaceholder')} className={inputCls} />
                </div>
              </div>
              {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
              <button
                type="button"
                onClick={generate}
                disabled
                className="w-full py-3 rounded-xl bg-[var(--forest)] text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? t('planner.generatingButton') : t('planner.generateButton')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
