import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// GTM's default pageview trigger only fires on initial load, not on React
// Router's client-side navigation — push a virtual pageview on every route
// change instead. Mount once near the app root, inside <BrowserRouter>.
export function useGtmPageview() {
  const location = useLocation()

  useEffect(() => {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: 'pageview',
      page: location.pathname + location.search,
    })
  }, [location])
}
