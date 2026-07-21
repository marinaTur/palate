import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../store/useAppStore'
import { Badge } from '../components/ui'
import Walkthrough from './learn/Walkthrough'
import Nose from './learn/Nose'
import Wheel from './learn/Wheel'
import Quiz from './learn/Quiz'

function PageHeader({ title, sub, onBack }) {
  return (
    <div className="bg-gradient-to-br from-[var(--forest)] to-[var(--forest-dark)] px-5 pt-10 pb-6 md:rounded-b-2xl md:mx-4 mb-6">
      <button onClick={onBack} className="flex items-center gap-2 text-white/60 hover:text-white text-sm mb-4 transition-colors">
        <i className="ti ti-arrow-left" aria-hidden="true"></i> Back
      </button>
      <h1 className="font-['Cormorant_Garamond'] text-4xl text-white italic leading-tight">{title}</h1>
      {sub && <p className="text-white/55 text-sm mt-2 font-light">{sub}</p>}
    </div>
  )
}

function ComingSoon({ moduleId }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  return (
    <div>
      <PageHeader
        title={t(`modules.${moduleId}.label`)}
        sub={t(`modules.${moduleId}.sub`)}
        onBack={() => navigate('/learn')}
      />
      <div className="max-w-xl mx-auto px-4 text-center py-16">
        <div className="w-16 h-16 rounded-full bg-[var(--forest-light)] flex items-center justify-center mx-auto mb-4">
          <i className="ti ti-hourglass text-[var(--forest)] text-2xl" aria-hidden="true"></i>
        </div>
        <p className="text-[var(--ink-soft)] font-medium mb-1">{t('learn.comingSoon')}</p>
      </div>
    </div>
  )
}

// Quiz is deliberately excluded here — it's no longer part of the "Lessons"
// directory, reachable instead via its own dashboard plate on Home.
// The /learn/quiz route below still exists and still works.
const MODULE_IDS = ['walkthrough', 'nose', 'wheel', 'bottle']
const MODULE_BADGE = { walkthrough: 'startHere', bottle: 'new' }

function LearnIndex() {
  const { t } = useTranslation()
  const { completedModules } = useAppStore()
  return (
    <div className="max-w-2xl mx-auto pb-6">
      <div className="bg-gradient-to-br from-[var(--forest)] to-[var(--forest-dark)] px-5 pt-12 pb-6 md:rounded-b-2xl md:mx-4 mb-6">
        <p className="text-xs tracking-[0.1em] text-white/45 uppercase mb-2">{t('learn.eyebrow')}</p>
        <h1 className="font-['Cormorant_Garamond'] text-5xl text-white italic leading-none">{t('learn.title')}</h1>
      </div>
      <div className="px-4 space-y-2">
        {MODULE_IDS.map((id, idx) => {
          const done = completedModules.includes(id)
          const badgeKey = MODULE_BADGE[id]
          return (
            <Link key={id} to={id}
              className="flex items-center gap-4 bg-white border border-[var(--border)] rounded-xl px-4 py-4 hover:border-[var(--forest)] transition-colors group">
              <span className={`font-['Cormorant_Garamond'] text-xl w-6 text-center leading-none flex-shrink-0 ${done ? 'text-[var(--forest)]' : 'text-[var(--border)]'}`}>
                {['I','II','III','IV'][idx]}
              </span>
              <div className="flex-1">
                <p className="font-medium text-sm text-[var(--ink)] group-hover:text-[var(--forest)] transition-colors">
                  {t(`modules.${id}.label`)}
                </p>
                <p className="text-xs text-[var(--muted)]">{t(`modules.${id}.sub`)}</p>
              </div>
              <div className="flex items-center gap-2">
                {done ? (
                  <Badge variant="green">{t('modules.done')}</Badge>
                ) : badgeKey ? (
                  <Badge variant="forest">{t(`modules.${badgeKey}`)}</Badge>
                ) : null}
                <i className="ti ti-chevron-right text-[var(--border)] group-hover:text-[var(--forest)] transition-colors text-sm" aria-hidden="true"></i>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default function Learn() {
  return (
    <Routes>
      <Route index element={<LearnIndex />} />
      <Route path="walkthrough" element={<Walkthrough />} />
      <Route path="nose"        element={<Nose />} />
      <Route path="wheel"       element={<Wheel />} />
      <Route path="bottle"      element={<ComingSoon moduleId="bottle" />} />
      <Route path="quiz"        element={<Quiz />} />
    </Routes>
  )
}
