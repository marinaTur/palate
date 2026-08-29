import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ConsentBanner } from './components/ConsentBanner'
import { useDocumentLanguage } from './hooks/useDocumentLanguage'
import { useGtmPageview } from './hooks/useGtmPageview'
import { useYmPageview } from './hooks/useYmPageview'
import { useAppStore } from './store/useAppStore'
import { loadGtm, loadYm } from './utils/loadAnalytics'
import Home    from './pages/Home'
import Learn   from './pages/Learn'
import Planner from './pages/Planner'
import Journal from './pages/Journal'

function GtmPageviewTracker() {
  useGtmPageview()
  return null
}

function YmPageviewTracker() {
  useYmPageview()
  return null
}

export default function App() {
  useDocumentLanguage()
  const cookieConsent = useAppStore(s => s.cookieConsent)

  // Returning visitor who already accepted — load analytics immediately,
  // no need to show the banner again.
  useEffect(() => {
    if (cookieConsent === 'accepted') {
      loadGtm()
      loadYm()
    }
  }, [cookieConsent])

  return (
    <BrowserRouter>
      <GtmPageviewTracker />
      <YmPageviewTracker />
      <Layout>
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/learn/*"   element={<Learn />} />
          <Route path="/planner"   element={<Planner />} />
          <Route path="/journal"   element={<Journal />} />
        </Routes>
      </Layout>
      <ConsentBanner />
    </BrowserRouter>
  )
}
