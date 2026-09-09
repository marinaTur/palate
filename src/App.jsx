import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ConsentBanner } from './components/ConsentBanner'
import { AgeGate } from './components/AgeGate'
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

  const cookieConsent = useAppStore(s => s.cookieConsent)
  useEffect(() => {
    if (cookieConsent === 'accepted') {
      loadGtm()
      loadYm()
    }
  }, [cookieConsent])

  return (
    <BrowserRouter>
      <AgeGate />
      {/* <GtmPageviewTracker /> */}
      <YmPageviewTracker />
      <Layout>
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/learn/*"   element={<Learn />} />
          <Route path="/planner"   element={<Planner />} />
          <Route path="/journal"   element={<Journal />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </Layout>
      <ConsentBanner />
    </BrowserRouter>
  )
}
