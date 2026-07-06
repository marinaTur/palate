import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../store/useAppStore'
import { Badge } from '../components/ui'

const EMPTY = { wine: '', region: '', vintage: '', appearance: '', nose: '', palate: '', finish: '', score: '', notes: '' }

export default function Journal() {
  const { t, i18n } = useTranslation()
  const { journalEntries, addJournalEntry, deleteJournalEntry } = useAppStore()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  function save() {
    if (!form.wine.trim()) return
    addJournalEntry(form)
    setForm(EMPTY); setShowForm(false)
  }

  function formatDate(iso) {
    const locale = i18n.language?.startsWith('ru') ? 'ru-RU' : 'en-GB'
    return new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const inputCls = "w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--forest)] placeholder:text-[var(--muted)]/60 bg-white"

  const FIELDS = [
    { key: 'appearance', label: t('journal.appearanceLabel'), ph: t('journal.appearancePlaceholder') },
    { key: 'nose',       label: t('journal.noseLabel'),       ph: t('journal.nosePlaceholder') },
    { key: 'palate',     label: t('journal.palateLabel'),     ph: t('journal.palatePlaceholder') },
    { key: 'finish',     label: t('journal.finishLabel'),     ph: t('journal.finishPlaceholder') },
  ]

  return (
    <div className="max-w-2xl mx-auto pb-6">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[var(--forest)] to-[var(--forest-dark)] px-5 pt-12 pb-6 md:rounded-b-2xl md:mx-4 mb-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs tracking-[0.1em] text-white/45 uppercase mb-2">{t('journal.eyebrow')}</p>
            <h1 className="font-['Cormorant_Garamond'] text-5xl text-white italic leading-none">{t('journal.title')}</h1>
          </div>
          <button
            onClick={() => setShowForm(s => !s)}
            className={`text-sm px-4 py-2 rounded-xl font-medium transition-colors flex-shrink-0 ${
              showForm
                ? 'bg-white/15 text-white border border-white/20'
                : 'bg-[var(--burgundy)] hover:bg-[var(--burgundy-dark)] text-white'
            }`}
          >
            {showForm ? t('journal.cancel') : `+ ${t('journal.addWine')}`}
          </button>
        </div>
      </div>

      <div className="px-4">
        {/* Add entry form */}
        {showForm && (
          <div className="bg-white border border-[var(--border)] rounded-xl p-5 mb-6">
            <h2 className="text-xl text-[var(--ink)] mb-4">{t('journal.formTitle')}</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1">{t('journal.wineNameLabel')} *</label>
                  <input value={form.wine} onChange={e => set('wine', e.target.value)} placeholder={t('journal.wineNamePlaceholder')} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1">{t('journal.regionLabel')}</label>
                  <input value={form.region} onChange={e => set('region', e.target.value)} placeholder={t('journal.regionPlaceholder')} className={inputCls} />
                </div>
              </div>
              {FIELDS.map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1">{f.label}</label>
                  <textarea rows={2} value={form[f.key]} onChange={e => set(f.key, e.target.value)}
                    placeholder={f.ph} className={inputCls + " resize-none"} />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1">{t('journal.scoreLabel')}</label>
                  <input type="number" min="0" max="20" value={form.score} onChange={e => set('score', e.target.value)} placeholder="16" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1">{t('journal.vintageLabel')}</label>
                  <input value={form.vintage} onChange={e => set('vintage', e.target.value)} placeholder="2019" className={inputCls} />
                </div>
              </div>
              <button
                onClick={save} disabled={!form.wine.trim()}
                className="w-full py-3 rounded-xl bg-[var(--forest)] hover:bg-[var(--forest-dark)] text-white text-sm font-medium transition-colors disabled:opacity-40"
              >
                {t('journal.saveButton')}
              </button>
            </div>
          </div>
        )}

        {/* Entries */}
        {journalEntries.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-[var(--forest-light)] flex items-center justify-center mx-auto mb-4">
              <i className="ti ti-notebook text-[var(--forest)] text-2xl" aria-hidden="true"></i>
            </div>
            <p className="text-[var(--ink-soft)] font-medium mb-1">{t('journal.emptyTitle')}</p>
            <p className="text-sm text-[var(--muted)]">{t('journal.emptySubtitle')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {journalEntries.map(e => (
              <div key={e.id} className="bg-white border border-[var(--border)] rounded-xl p-5 group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-medium text-[var(--ink)]">{e.wine}</p>
                      {e.score && <Badge variant="forest">{e.score}/20</Badge>}
                      {e.vintage && <Badge variant="default">{e.vintage}</Badge>}
                    </div>
                    {e.region && <p className="text-xs text-[var(--muted)] mb-2">{e.region}</p>}
                    {e.nose   && <p className="text-sm text-[var(--ink-soft)] mb-1"><span className="text-xs text-[var(--muted)] uppercase tracking-wide mr-1">{t('journal.noseLabel')}</span>{e.nose}</p>}
                    {e.palate && <p className="text-sm text-[var(--ink-soft)]"><span className="text-xs text-[var(--muted)] uppercase tracking-wide mr-1">{t('journal.palateLabel')}</span>{e.palate}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <p className="text-xs text-[var(--muted)]">{formatDate(e.date)}</p>
                    <button onClick={() => deleteJournalEntry(e.id)}
                      className="text-xs text-[var(--muted)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                      {t('journal.remove')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
