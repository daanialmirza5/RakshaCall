import { AlertTriangle, FileText, Mic, MicOff, ShieldCheck, Sparkles, Trash2, Workflow, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { analyzeCallerText } from '../lib/detectionEngine'
import { generateIncidentId, type IncidentReportData } from '../lib/incidentReportUtils'
import { useSpeechRecognition } from '../lib/speechRecognition'
import { usePasteAnalyzeWorkflow } from '../lib/workflowObservers'
import { useAppSettings } from '../i18n/LanguageContext'
import { LANG_TO_BCP47 } from '../i18n/strings'
import { IncidentReportModal } from './IncidentReportModal'
import { RiskMeter } from './RiskMeter'
import { TacticsList } from './TacticsList'
import { WarningOverlay } from './WarningOverlay'
import { WorkflowVisualizer } from './workflow/WorkflowVisualizer'

export function PasteAnalyze() {
  const { strings, lang } = useAppSettings()
  const [text, setText] = useState('')
  const [warningDismissed, setWarningDismissed] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [architectureOpen, setArchitectureOpen] = useState(false)
  const speech = useSpeechRecognition(lang)
  const t = strings.paste

  const combinedText = speech.listening || speech.transcript ? `${text} ${speech.transcript}`.trim() : text
  const result = useMemo(() => analyzeCallerText(combinedText), [combinedText])

  // Purely additive: reports this screen's real state onto the Live Runtime Workflow event bus.
  usePasteAnalyzeWorkflow(
    combinedText,
    result.matchedCategories.length,
    result.score,
    result.level,
    speech.supported,
    speech.micState,
    speech.transcript,
    LANG_TO_BCP47[lang],
  )

  // A lightweight, one-shot incident snapshot for the paste-analysis flow —
  // deliberately not the full live-call useIncidentReport (no scenario, no
  // playback timeline to track here), reusing the same report component so
  // there's still only one report UI in the app. Rebuilt fresh each time the
  // report is opened, from whatever's in the textarea right now.
  const [reportData, setReportData] = useState<IncidentReportData | null>(null)
  const openReport = () => {
    setReportData({
      incidentId: generateIncidentId(),
      generatedAt: Date.now(),
      source: 'paste-analysis',
      callerName: null,
      scenarioTitle: null,
      scamTypeKey: null,
      durationMs: null,
      peakScore: result.score,
      finalScore: result.score,
      finalLevel: result.level,
      matchedCategories: result.matchedCategories,
      timeline: [],
    })
    setReportOpen(true)
  }

  const micErrorMessage =
    speech.micState === 'permission-denied'
      ? t.micPermissionDenied
      : speech.micState === 'no-mic'
        ? t.micNoMic
        : speech.micState === 'error'
          ? t.micError
          : null

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-6 text-center">
        <h1 className="font-display text-3xl font-extrabold text-ink-50">{t.title}</h1>
        <p className="mt-2 text-ink-300">{t.subtitle}</p>
      </div>

      <div className="rounded-2xl border border-ink-700 bg-ink-900/60 p-4">
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setWarningDismissed(false)
          }}
          placeholder={t.placeholder}
          rows={6}
          className="w-full resize-none rounded-xl border border-ink-700 bg-ink-950 p-4 text-ink-100 placeholder:text-ink-500 focus:border-brand-400 focus:outline-none"
        />

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              setText('')
              speech.reset()
              setWarningDismissed(false)
            }}
            className="flex items-center gap-1.5 rounded-lg border border-ink-600 px-3 py-2 text-sm font-medium text-ink-200 hover:bg-ink-800"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            {t.clearButton}
          </button>

          {speech.supported && (
            <button
              type="button"
              onClick={() => (speech.listening ? speech.stop() : speech.start())}
              aria-pressed={speech.listening}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                speech.listening
                  ? 'bg-danger-500 text-white hover:bg-danger-600'
                  : 'bg-ink-800 text-ink-100 hover:bg-ink-700'
              }`}
            >
              {speech.listening ? <MicOff className="h-4 w-4" aria-hidden /> : <Mic className="h-4 w-4" aria-hidden />}
              {speech.listening ? t.micListening : t.micStart}
            </button>
          )}
        </div>

        {speech.supported && (
          <p className="mt-3 flex items-start gap-1.5 text-xs text-ink-500">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            {t.micPrivacyNote}
          </p>
        )}

        {!speech.supported && (
          <p className="mt-3 flex items-start gap-1.5 text-xs text-ink-500">
            <MicOff className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            {t.micUnsupportedNote}
          </p>
        )}

        {micErrorMessage && (
          <p role="alert" className="mt-3 flex items-start gap-1.5 rounded-lg bg-caution-500/10 p-2.5 text-xs text-caution-300">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            {micErrorMessage}
          </p>
        )}
      </div>

      {combinedText.trim().length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <RiskMeter score={result.score} level={result.level} />
          <TacticsList matched={result.matchedCategories} />
        </div>
      )}

      {result.matchedCategories.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={() => setArchitectureOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-ink-800 px-3 py-2 text-sm font-medium text-ink-200 hover:bg-ink-700"
          >
            <Workflow className="h-4 w-4" aria-hidden />
            Runtime Observatory
          </button>
          <button
            type="button"
            onClick={openReport}
            className="flex items-center gap-1.5 rounded-lg bg-ink-800 px-3 py-2 text-sm font-medium text-ink-200 hover:bg-ink-700"
          >
            <FileText className="h-4 w-4" aria-hidden />
            {strings.warning.viewSummaryButton}
          </button>
        </div>
      )}

      {combinedText.trim().length === 0 && (
        <div className="mt-6 flex items-center gap-2 rounded-2xl border border-dashed border-ink-700 p-4 text-sm text-ink-400">
          <Sparkles className="h-4 w-4" aria-hidden />
          {t.liveNote}
        </div>
      )}

      {!warningDismissed && (
        <div className="mt-5">
          <WarningOverlay
            level={result.level}
            score={result.score}
            matched={result.matchedCategories}
            onDismiss={() => setWarningDismissed(true)}
            onOpenReport={openReport}
          />
        </div>
      )}

      {reportData && <IncidentReportModal open={reportOpen} onClose={() => setReportOpen(false)} data={reportData} />}

      {architectureOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
          onClick={() => setArchitectureOpen(false)}
        >
          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setArchitectureOpen(false)}
              aria-label="Close runtime observatory view"
              className="absolute -top-3 -right-3 z-10 rounded-full bg-ink-900 p-1.5 text-ink-300 shadow-md hover:bg-ink-800 hover:text-ink-100"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
            <WorkflowVisualizer defaultWorkflowId="manualAnalysis" />
          </div>
        </div>
      )}
    </div>
  )
}
