import { AnimatePresence, motion } from 'framer-motion'
import { AlertOctagon, FileText, PhoneOff, ShieldAlert, TriangleAlert, UserRound } from 'lucide-react'
import { useState } from 'react'
import { useAppSettings } from '../i18n/LanguageContext'
import type { RiskLevel } from '../data/signals'
import type { MatchedCategory } from '../lib/detectionEngine'
import { CitizenActionHub } from './CitizenActionHub'
import { TrustedContactPanel } from './TrustedContactPanel'

interface WarningOverlayProps {
  level: RiskLevel
  score: number
  matched: MatchedCategory[]
  onDismiss: () => void
  onOpenReport: () => void
}

/**
 * HIGH risk = full-screen takeover (the moment the demo is built around).
 * MEDIUM risk = a calmer inline banner, phrased as a question rather than an
 * alarm, so the system doesn't cry wolf and lose the user's trust before a
 * real HIGH event.
 *
 * Structure for HIGH (deliberately in this order, per the product's
 * "detect -> explain -> warn -> guide -> help" principle): what was
 * detected -> why that's dangerous (score/tactic count) -> what to do right
 * now -> how to get help. Every number and tactic label here comes straight
 * from the real detection engine passed in via props — nothing here scores
 * or classifies anything itself. Language stays in terms of "high-risk scam
 * pattern detected", never "this is definitely a scam" — RakshaCall can be
 * wrong, and the user should still verify independently.
 */
export function WarningOverlay({ level, score, matched, onDismiss, onOpenReport }: WarningOverlayProps) {
  const { strings } = useAppSettings()
  const [contactOpen, setContactOpen] = useState(false)
  const [actionHubOpen, setActionHubOpen] = useState(false)

  if (level === 'LOW') return null

  const isHigh = level === 'HIGH'
  const actions = isHigh ? strings.warning.recommendedActionsHigh : strings.warning.recommendedActionsMedium
  const title = isHigh ? strings.warning.highTitle : strings.warning.mediumTitle

  if (!isHigh) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-caution-500/40 bg-caution-500/10 p-4"
          role="alert"
        >
          <div className="flex items-start gap-3">
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-caution-400" aria-hidden />
            <div className="flex-1">
              <p className="font-display font-bold text-caution-300">{title}</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-ink-200">
                {actions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setActionHubOpen(true)}
                className="mt-2 text-xs font-semibold text-caution-300 underline decoration-dotted hover:text-caution-200"
              >
                {strings.warning.mediumGetHelpLink}
              </button>
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
        <CitizenActionHub open={actionHubOpen} onClose={() => setActionHubOpen(false)} />
      </>
    )
  }

  const tacticsCountLabel = strings.warning.tacticsCountLabel.replace('{count}', String(matched.length))

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
              <ShieldAlert className="h-9 w-9" aria-hidden />
            </motion.div>
            <h2 className="font-display text-2xl font-extrabold text-danger-300 sm:text-3xl">{title}</h2>
            <p className="mt-1 text-xs text-ink-400">{strings.warning.patternDisclaimer}</p>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-2xl bg-ink-800/70 p-4">
            <div>
              <p className="text-xs font-medium text-ink-400">{strings.warning.riskScoreLabel}</p>
              <p className="font-display text-3xl font-extrabold text-danger-300">{score}/100</p>
            </div>
            <p className="max-w-[10rem] text-right text-sm font-medium text-ink-200">{tacticsCountLabel}</p>
          </div>

          <div className="mt-4 rounded-2xl bg-ink-800/70 p-4">
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

          <div className="mt-4">
            <p className="mb-2 text-sm font-semibold text-ink-100">{strings.warning.immediateActionsTitle}</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {(
                [
                  ['stopTitle', 'stopBody'],
                  ['noShareTitle', 'noShareBody'],
                  ['disconnectTitle', 'disconnectBody'],
                  ['verifyTitle', 'verifyBody'],
                ] as const
              ).map(([titleKey, bodyKey]) => (
                <div key={titleKey} className="rounded-xl border border-danger-500/30 bg-danger-500/5 p-3">
                  <p className="text-xs font-extrabold tracking-wide text-danger-300">{strings.warning.immediateActions[titleKey]}</p>
                  <p className="mt-0.5 text-xs text-ink-200">{strings.warning.immediateActions[bodyKey]}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-ink-700 p-4">
            <p className="mb-2 text-sm font-semibold text-ink-100">{strings.warning.recommendedActionTitle}</p>
            <ul className="list-inside list-disc space-y-1.5 text-sm text-ink-200">
              {actions.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setActionHubOpen(true)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-danger-500 px-4 py-3.5 font-bold text-white transition hover:bg-danger-600"
              >
                <AlertOctagon className="h-5 w-5" aria-hidden />
                {strings.warning.getHelpButton}
              </button>
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-ink-600 px-4 py-3.5 font-semibold text-ink-100 transition hover:bg-ink-800"
              >
                <UserRound className="h-5 w-5" aria-hidden />
                {strings.trustedContact.alertButton}
              </button>
            </div>
            <button
              type="button"
              onClick={onOpenReport}
              className="flex items-center justify-center gap-2 rounded-xl border border-ink-700 px-4 py-2.5 text-sm font-semibold text-ink-300 transition hover:bg-ink-800"
            >
              <FileText className="h-4 w-4" aria-hidden />
              {strings.warning.viewSummaryButton}
            </button>
            <button
              type="button"
              onClick={onDismiss}
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-ink-400 transition hover:bg-ink-800 hover:text-ink-200"
            >
              <PhoneOff className="h-4 w-4" aria-hidden />
              {strings.warning.imSafe}
            </button>
          </div>
        </motion.div>

        <TrustedContactPanel open={contactOpen} onClose={() => setContactOpen(false)} matched={matched} />
        <CitizenActionHub open={actionHubOpen} onClose={() => setActionHubOpen(false)} />
      </motion.div>
    </AnimatePresence>
  )
}
