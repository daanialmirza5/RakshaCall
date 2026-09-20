import { useEffect, useState } from 'react'
import { AppSettingsProvider, useAppSettings } from './i18n/LanguageContext'
import type { Scenario } from './types'
import { CallScreen } from './components/CallScreen'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Landing } from './components/Landing'
import { PasteAnalyze } from './components/PasteAnalyze'
import { ScenarioSelector } from './components/ScenarioSelector'
import { WorkflowVisualizer } from './components/workflow/WorkflowVisualizer'

export type View = 'landing' | 'picker' | 'call' | 'paste' | 'architecture'

function resolveInitialView(): View {
  if (typeof window === 'undefined') return 'landing'
  const hash = window.location.hash.toLowerCase()
  const search = window.location.search.toLowerCase()
  const pathname = window.location.pathname.toLowerCase()

  if (
    hash.includes('observatory') ||
    hash.includes('architecture') ||
    search.includes('view=observatory') ||
    search.includes('view=architecture') ||
    pathname.endsWith('/architecture') ||
    pathname.endsWith('/architecture/') ||
    pathname.endsWith('/observatory') ||
    pathname.endsWith('/observatory/')
  ) {
    return 'architecture'
  }
  if (hash.includes('paste') || search.includes('view=paste')) return 'paste'
  if (hash.includes('picker') || search.includes('view=picker') || hash.includes('demo')) return 'picker'
  return 'landing'
}

function AppShell() {
  const { largeText } = useAppSettings()
  const [view, setView] = useState<View>(resolveInitialView)
  const [scenario, setScenario] = useState<Scenario | null>(null)

  useEffect(() => {
    const handlePopState = () => {
      setView(resolveInitialView())
    }
    window.addEventListener('popstate', handlePopState)
    window.addEventListener('hashchange', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('hashchange', handlePopState)
    }
  }, [])

  const handleSelectScenario = (s: Scenario) => {
    setScenario(s)
    setView('call')
  }

  const handleNavigate = (newView: View) => {
    setView(newView)
    if (newView === 'architecture') {
      window.location.hash = '/observatory'
    } else if (window.location.hash.includes('observatory') || window.location.hash.includes('architecture')) {
      window.location.hash = ''
    }
  }

  return (
    <div className={`flex min-h-screen flex-col ${largeText ? 'text-[1.125rem]' : ''}`}>
      <Header view={view} onNavigate={handleNavigate} />

      <main className="flex-1">
        {view === 'landing' && <Landing onNavigate={handleNavigate} />}
        {view === 'picker' && <ScenarioSelector onSelect={handleSelectScenario} />}
        {view === 'call' && scenario && <CallScreen scenario={scenario} onExit={() => handleNavigate('picker')} />}
        {view === 'paste' && <PasteAnalyze />}
        {view === 'architecture' && (
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <div className="mb-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="font-display text-2xl font-extrabold text-ink-50">RakshaCall Runtime Observatory</h1>
                  <p className="mt-1 text-sm text-ink-400">
                    A real-time technical observability view into RakshaCall's internal execution engine — every node reflects
                    an actual function execution and state transition via our browser-native BroadcastChannel runtime. Open this
                    observatory in a separate tab or side-by-side window while running a simulated call or pasting a transcript
                    to watch live node execution, risk scoring, and protection interventions in real time.
                  </p>
                </div>
              </div>
            </div>
            <WorkflowVisualizer />
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

function App() {
  return (
    <AppSettingsProvider>
      <AppShell />
    </AppSettingsProvider>
  )
}

export default App

