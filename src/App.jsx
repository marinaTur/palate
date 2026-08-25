import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { useDocumentLanguage } from './hooks/useDocumentLanguage'
import { useGtmPageview } from './hooks/useGtmPageview'
import { useYmPageview } from './hooks/useYmPageview'
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
    </BrowserRouter>
  )
}
