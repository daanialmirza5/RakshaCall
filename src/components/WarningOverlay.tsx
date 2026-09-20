import { AnimatePresence, motion } from 'framer-motion'
import { PhoneOff, ShieldAlert, TriangleAlert, UserRound } from 'lucide-react'
import { useState } from 'react'
import { useAppSettings } from '../i18n/LanguageContext'
import type { RiskLevel } from '../data/signals'
import type { MatchedCategory } from '../lib/detectionEngine'
import { TrustedContactPanel } from './TrustedContactPanel'

interface WarningOverlayProps {
  level: RiskLevel
  matched: MatchedCategory[]
  onDismiss: () => void
}

/**
 * HIGH risk = full-screen takeover (the moment the demo is built around).
 * MEDIUM risk = a calmer inline banner, phrased as a question rather than an
 * alarm, so the system doesn't cry wolf and lose the user's trust before a
 * real HIGH event.
 */
export function WarningOverlay({ level, matched, onDismiss }: WarningOverlayProps) {
  const { strings } = useAppSettings()
  const [contactOpen, setContactOpen] = useState(false)

  if (level === 'LOW') return null

  const isHigh = level === 'HIGH'
  const actions = isHigh ? strings.warning.recommendedActionsHigh : strings.warning.recommendedActionsMedium
  const title = isHigh ? strings.warning.highTitle : strings.warning.mediumTitle

  if (!isHigh) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-caution-500/40 bg-caution-500/10 p-4"
        role="alert"
      >
        <div className="flex items-start gap-3">
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-caution-400" />
          <div className="flex-1">
            <p className="font-display font-bold text-caution-300">{title}</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-ink-200">
              {actions.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-caution-300 hover:bg-caution-500/20"
          >
            {strings.warning.dismiss}
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-gradient-to-b from-danger-500/20 via-ink-950 to-ink-950 p-5 sm:items-center sm:justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 140, damping: 16 }}
          className="mx-auto w-full max-w-lg rounded-3xl border-2 border-danger-500/60 bg-ink-900 p-6 shadow-2xl shadow-danger-950/50 sm:p-8"
        >
          <div className="flex flex-col items-center text-center">
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-danger-500/15 text-danger-400"
            >
              <ShieldAlert className="h-9 w-9" />
            </motion.div>
            <h2 className="font-display text-2xl font-extrabold text-danger-300 sm:text-3xl">{title}</h2>
          </div>

          <div className="mt-5 rounded-2xl bg-ink-800/70 p-4">
            <p className="mb-2 text-sm font-medium text-ink-300">{strings.warning.explanationIntro}</p>
            <ul className="space-y-1.5">
              {matched.map((m) => (
                <li key={m.id} className="flex items-start gap-2 text-sm text-ink-100">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-danger-400" />
                  {strings.categories[m.id].label}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 rounded-2xl border border-ink-700 p-4">
            <p className="mb-2 text-sm font-semibold text-ink-100">{strings.warning.recommendedActionTitle}</p>
            <ul className="list-inside list-disc space-y-1.5 text-sm text-ink-200">
              {actions.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setContactOpen(true)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-danger-500 px-4 py-3.5 font-bold text-white transition hover:bg-danger-600"
            >
              <UserRound className="h-5 w-5" />
              {strings.trustedContact.alertButton}
            </button>
            <button
              type="button"
              onClick={onDismiss}
              className="flex items-center justify-center gap-2 rounded-xl border border-ink-600 px-4 py-3.5 font-semibold text-ink-200 transition hover:bg-ink-800"
            >
              <PhoneOff className="h-4 w-4" />
              {strings.warning.imSafe}
            </button>
          </div>
        </motion.div>

        <TrustedContactPanel open={contactOpen} onClose={() => setContactOpen(false)} />
      </motion.div>
    </AnimatePresence>
  )
}
