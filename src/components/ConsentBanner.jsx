import { useTranslation } from 'react-i18next'
import { useAppStore } from '../store/useAppStore'
import { loadGtm, loadYm } from '../utils/loadAnalytics'
import { Button } from './ui/Button'

// Docks above the global bottom nav via var(--nav-h), same convention as
// every other bottom-anchored control (see MOBILE_LAYOUT_CONVENTION.md).
// Shown only while cookieConsent is null (never decided) — accepting loads
// GTM/Metrica for the first time; declining just records the choice.
export function ConsentBanner() {
  const { t } = useTranslation()
  const cookieConsent = useAppStore(s => s.cookieConsent)
  const setCookieConsent = useAppStore(s => s.setCookieConsent)

  if (cookieConsent !== null) return null

  function accept() {
    setCookieConsent('accepted')
    loadGtm()
    loadYm()
  }

  function decline() {
    setCookieConsent('declined')
  }

  return (
    <div
      className="fixed left-0 right-0 z-40 bg-white border-t border-[var(--border)] shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-4 py-4"
      style={{ bottom: 'var(--nav-h, 0px)' }}
    >
      <div className="mx-auto max-w-2xl flex flex-col sm:flex-row sm:items-center gap-3">
        <p className="text-sm text-[var(--ink-soft)] flex-1">
          {t('common.cookieConsent.message')}
        </p>
        <div className="flex gap-2 shrink-0">
          <Button variant="secondary" size="sm" onClick={decline}>
            {t('common.cookieConsent.decline')}
          </Button>
          <Button variant="primary" size="sm" onClick={accept}>
            {t('common.cookieConsent.accept')}
          </Button>
        </div>
      </div>
    </div>
  )
}
