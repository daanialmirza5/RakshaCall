import { useState } from 'react'
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

function AppShell() {
  const { largeText } = useAppSettings()
  const [view, setView] = useState<View>('landing')
  const [scenario, setScenario] = useState<Scenario | null>(null)

  const handleSelectScenario = (s: Scenario) => {
    setScenario(s)
    setView('call')
  }

  return (
    <div className={`flex min-h-screen flex-col ${largeText ? 'text-[1.125rem]' : ''}`}>
      <Header view={view} onNavigate={setView} />

      <main className="flex-1">
        {view === 'landing' && <Landing onNavigate={setView} />}
        {view === 'picker' && <ScenarioSelector onSelect={handleSelectScenario} />}
        {view === 'call' && scenario && <CallScreen scenario={scenario} onExit={() => setView('picker')} />}
        {view === 'paste' && <PasteAnalyze />}
        {view === 'architecture' && (
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <div className="mb-4">
              <h1 className="font-display text-2xl font-extrabold text-ink-50">Live Architecture</h1>
              <p className="mt-1 text-sm text-ink-400">
                A real-time observability view over RakshaCall's own execution — every node reflects an actual function
                call, not a scripted animation. This page shows the last session's real events; for a graph that updates
                live while you watch, open <strong>Live Architecture</strong> from within an active call or Paste
                Analyze, where it stays open alongside the real run.
              </p>
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
