import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

// GTM's default pageview trigger only fires on initial load, not on React
// Router's client-side navigation — push a virtual pageview on every route
// change instead. Mount once near the app root, inside <BrowserRouter>.
// No-ops until cookie consent is accepted — GTM itself never loads before
// then (see loadAnalytics.js), so this guard just makes that explicit.
export function useGtmPageview() {
  const location = useLocation()
  const cookieConsent = useAppStore(s => s.cookieConsent)

  useEffect(() => {
    if (cookieConsent !== 'accepted') return
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: 'page_view',
      page: location.pathname + location.search,
    })
  }, [location, cookieConsent])
}
