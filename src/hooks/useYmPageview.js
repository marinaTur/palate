import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Yandex Metrica's counter is initialized with defer:true in index.html, so
// it does NOT auto-send pageviews — every hit, including the first one, must
// be sent explicitly via ym(id, 'hit', url). Mount once near the app root,
// inside <BrowserRouter>. Independent of GTM/dataLayer by design — Metrica
// runs as its own standalone snippet, not a GTM tag (see index.html).
// Counter ID hardcoded here to match index.html's snippet exactly — it's not
// a secret (already visible in the page's own source), so no env var needed.
const COUNTER_ID = 111880697

export function useYmPageview() {
  const location = useLocation()

  useEffect(() => {
    if (!COUNTER_ID || typeof window.ym !== 'function') return
    window.ym(COUNTER_ID, 'hit', location.pathname + location.search)
  }, [location])
}
