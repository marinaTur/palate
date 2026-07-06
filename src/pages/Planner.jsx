import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../store/useAppStore'
import { matchSamplePlan } from '../data/samplePlans'
import { Button, Card, Badge } from '../components/ui'

export default function Planner() {
  const { t, i18n } = useTranslation()
  const { lastPlan, setLastPlan } = useAppStore()
  const [inputs, setInputs] = useState({ wines: '', foods: '', season: '', guests: '', notes: '' })
  const [plan, setPlan]     = useState(lastPlan)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)

  const set = (k, v) => setInputs(p => ({ ...p, [k]: v }))
  const hasAnyInput = Object.values(inputs).some(v => v.trim())

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
        <div className="bg-[var(--gold-light)] border border-[var(--gold)]/20 rounded-lg px-4 py-2.5 mb-4 flex items-start gap-2 print:hidden">
          <span className="text-[var(--gold)] text-sm mt-0.5">✦</span>
          <p className="text-xs text-[var(--ink-soft)] leading-relaxed">{t('planner.demoNotice')}</p>
        </div>

        {/* Input form */}
        <div className="bg-white border border-[var(--border)] rounded-xl p-5 mb-6 print:hidden">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1.5">{t('planner.winesLabel')}</label>
              <textarea rows={2} value={inputs.wines} onChange={e => set('wines', e.target.value)}
                placeholder={t('planner.winesPlaceholder')} className={inputCls + " resize-none"} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1.5">{t('planner.foodsLabel')}</label>
                <input value={inputs.foods} onChange={e => set('foods', e.target.value)} placeholder={t('planner.foodsPlaceholder')} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1.5">{t('planner.seasonLabel')}</label>
                <select value={inputs.season} onChange={e => set('season', e.target.value)} className={inputCls}>
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
                <input value={inputs.guests} onChange={e => set('guests', e.target.value)} placeholder={t('planner.guestsPlaceholder')} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1.5">{t('planner.notesLabel')}</label>
                <input value={inputs.notes} onChange={e => set('notes', e.target.value)} placeholder={t('planner.notesPlaceholder')} className={inputCls} />
              </div>
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
            <button
              onClick={generate}
              disabled={loading || !hasAnyInput}
              className="w-full py-3 rounded-xl bg-[var(--forest)] hover:bg-[var(--forest-dark)] text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? t('planner.generatingButton') : t('planner.generateButton')}
            </button>
          </div>
        </div>

        {/* Plan output */}
        {plan && (
          <div className="space-y-4">
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
              <div className="bg-[var(--gold-light)] border border-[var(--gold)]/25 rounded-xl p-5">
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
        )}
      </div>
    </div>
  )
}
