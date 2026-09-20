import { AnimatePresence, motion } from 'framer-motion'
import { Clipboard, Download, FileText, ShieldCheck, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAppSettings } from '../i18n/LanguageContext'
import { buildIncidentSummaryText, formatDurationMs, type IncidentReportData } from '../lib/incidentReportUtils'

interface IncidentReportModalProps {
  open: boolean
  onClose: () => void
  data: IncidentReportData
}

/**
 * A local, session-only "Incident Summary" — deliberately not called a
 * "forensic report": it's a plain-language readout of what the detection
 * engine actually found, built for a stressed person to act on or share,
 * not a certified/legally admissible document. Every field is read from
 * real runtime state (IncidentReportData), nothing here is fabricated.
 */
export function IncidentReportModal({ open, onClose, data }: IncidentReportModalProps) {
  const { strings } = useAppSettings()
  const t = strings.incidentReport
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')

  const summaryText = buildIncidentSummaryText(data, strings)
  const recommendedActions = data.finalLevel === 'HIGH' ? strings.warning.recommendedActionsHigh : strings.warning.recommendedActionsMedium

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
    window.setTimeout(() => setCopyState('idle'), 2500)
  }

  const handleDownload = () => {
    try {
      const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${data.incidentId}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch {
      // Download isn't available in this environment (e.g. some in-app browsers) — Copy still works.
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/40 p-4 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t.title}
            className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-3xl border border-ink-700 bg-ink-900 shadow-2xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-ink-800 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-brand-400">
                  <FileText className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-ink-100">{t.title}</h2>
                  <p className="text-sm text-ink-300">{t.subtitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 text-ink-300 hover:bg-ink-800 hover:text-ink-100"
                aria-label={t.close}
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <InfoRow label={t.idLabel} value={data.incidentId} mono />
                <InfoRow label={t.generatedAtLabel} value={new Date(data.generatedAt).toLocaleString()} />
                <InfoRow label={t.sourceLabel} value={data.source === 'live-call' ? t.sourceLiveCall : t.sourcePaste} />
                {data.scenarioTitle && <InfoRow label={t.scenarioLabel} value={data.scenarioTitle} />}
                <InfoRow label={t.durationLabel} value={data.durationMs !== null ? formatDurationMs(data.durationMs) : t.durationNotAvailable} />
                <InfoRow label={t.scamTypeLabel} value={data.scamTypeKey ? t.scamTypes[data.scamTypeKey] : t.scamTypeUnknown} />
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl border border-ink-700 bg-ink-800/50 p-4">
                <div>
                  <p className="text-xs font-medium text-ink-400">{t.peakScoreLabel}</p>
                  <p className="font-display text-2xl font-extrabold text-ink-50">{data.peakScore}/100</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-ink-400">{t.finalLevelLabel}</p>
                  <p className="font-display text-lg font-bold text-ink-100">{strings.risk[data.finalLevel]}</p>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="mb-2 text-sm font-semibold text-ink-200">{t.detectedTacticsTitle}</h3>
                {data.matchedCategories.length === 0 ? (
                  <p className="text-sm text-ink-400">{t.noTacticsDetected}</p>
                ) : (
                  <ul className="space-y-1.5">
                    {data.matchedCategories.map((m) => (
                      <li key={m.id} className="flex items-start gap-2 text-sm text-ink-200">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-danger-400" />
                        {strings.categories[m.id].label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-4">
                <h3 className="mb-2 text-sm font-semibold text-ink-200">{t.timelineTitle}</h3>
                {data.timeline.length === 0 ? (
                  <p className="text-sm text-ink-400">{t.timelineEmpty}</p>
                ) : (
                  <ol className="space-y-1.5 border-l border-ink-700 pl-3">
                    {data.timeline.map((entry, i) => (
                      <li key={`${entry.categoryId}-${i}`} className="text-sm text-ink-300">
                        <span className="font-mono text-xs text-ink-500">{formatDurationMs(entry.atMs)}</span>{' '}
                        {strings.categories[entry.categoryId].label}
                        <span className="text-ink-500"> — {strings.risk[entry.levelAfter]} ({entry.scoreAfter}/100)</span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>

              {data.matchedCategories.length > 0 && (
                <div className="mt-4">
                  <h3 className="mb-2 text-sm font-semibold text-ink-200">{t.recommendedActionsTitle}</h3>
                  <ul className="list-inside list-disc space-y-1 text-sm text-ink-300">
                    {recommendedActions.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-ink-600 px-4 py-2.5 text-sm font-semibold text-ink-100 transition hover:bg-ink-800"
                >
                  <Clipboard className="h-4 w-4" aria-hidden />
                  {copyState === 'copied' ? t.copiedLabel : t.copyButton}
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-ink-600 px-4 py-2.5 text-sm font-semibold text-ink-100 transition hover:bg-ink-800"
                >
                  <Download className="h-4 w-4" aria-hidden />
                  {t.downloadButton}
                </button>
              </div>
              {copyState === 'failed' && <p className="mt-2 text-center text-xs text-caution-300">{t.copyFailedLabel}</p>}

              <div className="mt-4 flex items-start gap-1.5 rounded-lg bg-ink-800/40 p-3 text-xs text-ink-500">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                <div>
                  <p>{t.privacyNote}</p>
                  <p className="mt-1">{t.disclaimerNote}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs font-medium text-ink-500">{label}</p>
      <p className={`truncate text-ink-200 ${mono ? 'font-mono text-xs' : ''}`}>{value}</p>
    </div>
  )
}
