import { useTranslation } from 'react-i18next'
import { useAppStore } from '../store/useAppStore'
import { Button } from './ui/Button'

// Full-screen blocking overlay shown until the visitor confirms they are 18+.
// Independent of cookieConsent/analytics (which are currently disabled) —
// this is a legally-oriented content warning, not a cookie/tracking choice.
// Persists via ageVerified in the store, same convention as cookieConsent.
export function AgeGate() {
  const { t } = useTranslation()
  const ageVerified = useAppStore(s => s.ageVerified)
  const setAgeVerified = useAppStore(s => s.setAgeVerified)

  if (ageVerified === 'confirmed') return null

  const declined = ageVerified === 'declined'

  return (
    <div className="fixed inset-0 z-[100] bg-[var(--forest)] flex items-center justify-center p-6">
      <div className="max-w-sm w-full bg-[var(--cream)] rounded-2xl shadow-2xl px-6 py-8 text-center">
        <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-[var(--burgundy)] text-white flex items-center justify-center font-serif text-2xl font-semibold">
          18+
        </div>

        {declined ? (
          <>
            <h1 className="font-serif text-xl font-semibold text-[var(--ink)] mb-3">
              {t('common.ageGate.declinedTitle')}
            </h1>
            <p className="text-sm text-[var(--ink-soft)] mb-6">
              {t('common.ageGate.declinedMessage')}
            </p>
            <a
              href="https://www.google.com"
              className="inline-flex items-center justify-center w-full rounded-xl bg-white border border-[var(--border)] text-[var(--ink-soft)] text-sm font-medium px-4 py-2.5 hover:border-[var(--forest)] hover:text-[var(--forest)] transition-colors"
            >
              {t('common.ageGate.leaveButton')}
            </a>
          </>
        ) : (
          <>
            <h1 className="font-serif text-xl font-semibold text-[var(--ink)] mb-3">
              {t('common.ageGate.title')}
            </h1>
            <p className="text-sm text-[var(--ink-soft)] mb-6">
              {t('common.ageGate.message')}
            </p>
            <div className="flex flex-col gap-2">
              <Button variant="primary" size="md" className="w-full" onClick={() => setAgeVerified('confirmed')}>
                {t('common.ageGate.confirm')}
              </Button>
              <Button variant="ghost" size="md" className="w-full" onClick={() => setAgeVerified('declined')}>
                {t('common.ageGate.decline')}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
