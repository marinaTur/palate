import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

// Yandex Metrica's counter is initialized with defer:true in loadAnalytics.js,
// so it does NOT auto-send pageviews — every hit, including the first one,
// must be sent explicitly via ym(id, 'hit', url). Mount once near the app
// root, inside <BrowserRouter>. Independent of GTM/dataLayer by design —
// Metrica runs as its own standalone snippet, not a GTM tag.
// Counter ID hardcoded here to match loadAnalytics.js exactly — it's not a
// secret (already visible in the page's own source), so no env var needed.
const COUNTER_ID = 111880697

export function useYmPageview() {
  const location = useLocation()
  const cookieConsent = useAppStore(s => s.cookieConsent)

  useEffect(() => {
    if (cookieConsent !== 'accepted') return
    if (!COUNTER_ID || typeof window.ym !== 'function') return
    window.ym(COUNTER_ID, 'hit', location.pathname + location.search)
  }, [location, cookieConsent])
}
