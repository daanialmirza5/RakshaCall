import { motion } from 'framer-motion'
import { PhoneCall, ShieldAlert, ShieldCheck } from 'lucide-react'
import { NORMAL_SCENARIOS, SCAM_SCENARIOS } from '../data/scenarios'
import { useAppSettings } from '../i18n/LanguageContext'
import type { Scenario } from '../types'

function ScenarioCard({ scenario, onSelect }: { scenario: Scenario; onSelect: (s: Scenario) => void }) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -3 }}
      onClick={() => onSelect(scenario)}
      className="flex flex-col items-start rounded-2xl border border-ink-700 bg-ink-900/60 p-5 text-left transition hover:border-brand-400/60 hover:bg-ink-900"
    >
      <div
        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${
          scenario.isScam ? 'bg-danger-500/15 text-danger-400' : 'bg-safe-500/15 text-safe-400'
        }`}
      >
        {scenario.isScam ? <ShieldAlert className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
      </div>
      <h3 className="font-display font-bold text-ink-50">{scenario.title}</h3>
      <p className="mt-1 text-sm text-ink-300">{scenario.description}</p>
      <span className="mt-3 flex items-center gap-1.5 text-xs font-medium text-ink-400">
        <PhoneCall className="h-3.5 w-3.5" />
        {scenario.callerName}
      </span>
    </motion.button>
  )
}

export function ScenarioSelector({ onSelect }: { onSelect: (s: Scenario) => void }) {
  const { strings } = useAppSettings()
  const t = strings.scenarioPicker

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-extrabold text-ink-50">{t.title}</h1>
        <p className="mt-2 text-ink-300">{t.subtitle}</p>
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-danger-400">{t.scamLabel}</h2>
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SCAM_SCENARIOS.map((s) => (
          <ScenarioCard key={s.id} scenario={s} onSelect={onSelect} />
        ))}
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-safe-400">{t.normalLabel}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {NORMAL_SCENARIOS.map((s) => (
          <ScenarioCard key={s.id} scenario={s} onSelect={onSelect} />
        ))}
      </div>
    </div>
  )
}
