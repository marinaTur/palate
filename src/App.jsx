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
import PrivacyPolicy from './pages/PrivacyPolicy'

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

  // Analytics deliberately disabled for now (Marina's call, 2026-08-31) —
  // GTM/Metrica never load, the consent banner never shows, and the
  // /privacy-policy route is unreachable. Do not re-enable any of this
  // (uncomment below) without checking with her first.
  // const cookieConsent = useAppStore(s => s.cookieConsent)
  // useEffect(() => {
  //   if (cookieConsent === 'accepted') {
  //     loadGtm()
  //     loadYm()
  //   }
  // }, [cookieConsent])

  return (
    <BrowserRouter>
      {/* <GtmPageviewTracker />
      <YmPageviewTracker /> */}
      <Layout>
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/learn/*"   element={<Learn />} />
          <Route path="/planner"   element={<Planner />} />
          <Route path="/journal"   element={<Journal />} />
          {/* <Route path="/privacy-policy" element={<PrivacyPolicy />} /> */}
        </Routes>
      </Layout>
      {/* <ConsentBanner /> */}
    </BrowserRouter>
  )
}
