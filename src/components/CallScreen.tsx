import { AnimatePresence, motion } from 'framer-motion'
import { FileText, LifeBuoy, PhoneOff, RotateCcw, Radio, Pause as PauseIcon, PhoneOff as EndedIcon, Workflow, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useAppSettings } from '../i18n/LanguageContext'
import type { RiskLevel } from '../data/signals'
import { computeTimelineStage } from '../lib/callPlaybackUtils'
import { useCallPlayback } from '../lib/useCallPlayback'
import { useCallVoice } from '../lib/useCallVoice'
import { useIncidentReport } from '../lib/useIncidentReport'
import { useCallScreenWorkflows } from '../lib/workflowObservers'
import type { Scenario } from '../types'
import { CallTimeline } from './CallTimeline'
import { CitizenActionHub } from './CitizenActionHub'
import { DetectionEventFeed } from './DetectionEventFeed'
import { IncidentReportModal } from './IncidentReportModal'
import { PlaybackControls } from './PlaybackControls'
import { RiskMeter } from './RiskMeter'
import { TacticsList } from './TacticsList'
import { VoiceActivityIndicator } from './VoiceActivityIndicator'
import { WarningOverlay } from './WarningOverlay'
import { WorkflowVisualizer } from './workflow/WorkflowVisualizer'

const LEVEL_RANK: Record<RiskLevel, number> = { LOW: 0, MEDIUM: 1, HIGH: 2 }
/** How close to the bottom (px) the transcript must already be for new lines to auto-scroll it. */
const AUTO_SCROLL_THRESHOLD_PX = 80

export function CallScreen({ scenario, onExit }: { scenario: Scenario; onExit: () => void }) {
  const { strings } = useAppSettings()
  const playback = useCallPlayback(scenario)
  const { visibleLines, result, status, mode, warningEverShown, hasTrigger, playId } = playback
  const voice = useCallVoice(scenario, playback)
  const incidentData = useIncidentReport(scenario, playback)

  const [dismissedAtLevel, setDismissedAtLevel] = useState<RiskLevel | null>(null)
  const [reportOpen, setReportOpen] = useState(false)
  const [actionHubOpen, setActionHubOpen] = useState(false)
  const [architectureOpen, setArchitectureOpen] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const transcriptEndRef = useRef<HTMLDivElement | null>(null)

  // A fresh play-through (restart / instant demo / new scenario) clears any earlier
  // dismissal and closes any report/help modal left open from the previous incident.
  useEffect(() => {
    setDismissedAtLevel(null)
    setReportOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playId])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight
    if (distanceFromBottom < AUTO_SCROLL_THRESHOLD_PX) {
      transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [visibleLines])

  const showWarning =
    result.level !== 'LOW' && (dismissedAtLevel === null || LEVEL_RANK[result.level] > LEVEL_RANK[dismissedAtLevel])
  const canReviewAlert = !showWarning && result.level !== 'LOW'

  // Purely additive: reports this screen's real state onto the Live Runtime
  // Workflow event bus. Never changes playback/voice/incident behavior.
  useCallScreenWorkflows({ scenario, playback, voice, incidentData, showWarning, reportOpen, actionHubOpen })
  const timelineStage = computeTimelineStage(result, warningEverShown)

  const statusBadge =
    status === 'playing'
      ? { label: strings.callScreen.liveLabel, Icon: Radio, pulse: true }
      : status === 'paused'
        ? { label: strings.callScreen.pausedLabel, Icon: PauseIcon, pulse: false }
        : { label: strings.callScreen.callEndedLabel, Icon: EndedIcon, pulse: false }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-800 text-ink-200">
            {scenario.callerName.charAt(0)}
          </div>
          <div>
            <p className="font-display font-bold text-ink-50">{scenario.callerName}</p>
            <p className={`flex items-center gap-1.5 text-xs ${status === 'playing' ? 'text-safe-400' : 'text-ink-400'}`}>
              <statusBadge.Icon className={`h-3 w-3 ${statusBadge.pulse ? 'animate-pulse' : ''}`} aria-hidden />
              {statusBadge.label} · {strings.callScreen.protectionOn}
            </p>
            <div className="mt-0.5">
              <VoiceActivityIndicator state={voice.activityState} />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={playback.restart}
            className="flex items-center gap-1.5 rounded-lg border border-ink-600 px-3 py-2 text-sm font-medium text-ink-200 hover:bg-ink-800"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            {strings.callScreen.restart}
          </button>
          <button
            type="button"
            onClick={onExit}
            className="flex items-center gap-1.5 rounded-lg bg-danger-500 px-3 py-2 text-sm font-semibold text-white hover:bg-danger-600"
          >
            <PhoneOff className="h-4 w-4" aria-hidden />
            {strings.callScreen.endCall}
          </button>
        </div>
      </div>

      <div className="mb-5">
        <CallTimeline stage={timelineStage} />
      </div>

      <div className="mb-5">
        <PlaybackControls
          mode={mode}
          status={status}
          hasTrigger={hasTrigger}
          ttsSupported={voice.ttsSupported}
          voiceEnabled={voice.voiceEnabled}
          onSetSpeed={playback.setSpeed}
          onInstantDemo={playback.startInstantDemo}
          onJumpToTrigger={() => {
            voice.stopSpeaking()
            playback.jumpToTrigger()
          }}
          onPause={playback.pause}
          onResume={playback.resume}
          onToggleVoice={voice.toggleVoice}
        />
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActionHubOpen(true)}
          className="flex min-h-[2.75rem] items-center gap-1.5 rounded-lg bg-ink-800 px-3 py-2 text-sm font-medium text-ink-200 transition hover:bg-ink-700"
        >
          <LifeBuoy className="h-4 w-4" aria-hidden />
          {strings.warning.getHelpButton}
        </button>
        <button
          type="button"
          onClick={() => setReportOpen(true)}
          className={`flex min-h-[2.75rem] items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
            result.level === 'HIGH' ? 'bg-danger-500/15 text-danger-300 hover:bg-danger-500/25' : 'bg-ink-800 text-ink-200 hover:bg-ink-700'
          }`}
        >
          <FileText className="h-4 w-4" aria-hidden />
          {strings.warning.viewSummaryButton}
        </button>
        <button
          type="button"
          onClick={() => setArchitectureOpen(true)}
          className="flex min-h-[2.75rem] items-center gap-1.5 rounded-lg bg-ink-800 px-3 py-2 text-sm font-medium text-ink-200 transition hover:bg-ink-700"
        >
          <Workflow className="h-4 w-4" aria-hidden />
          Runtime Observatory
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div ref={scrollContainerRef} className="h-[420px] overflow-y-auto rounded-2xl border border-ink-700 bg-ink-900/40 p-4">
            <AnimatePresence initial={false}>
              {visibleLines.map((line, i) => {
                const isNewest = i === visibleLines.length - 1
                const speakerLabel = line.speaker === 'caller' ? scenario.callerName : strings.callScreen.youLabel
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-3 flex flex-col ${line.speaker === 'caller' ? 'items-start' : 'items-end'}`}
                  >
                    <span className="mb-1 px-1 text-[11px] font-medium text-ink-500">{speakerLabel}</span>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ring-1 ring-transparent transition-shadow ${
                        line.speaker === 'caller' ? 'bg-ink-800 text-ink-100' : 'bg-brand-500/20 text-ink-50'
                      } ${isNewest ? 'ring-brand-400/50' : ''}`}
                    >
                      {line.text}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
            {status === 'playing' && visibleLines.length < scenario.lines.length && (
              <div className="flex items-center gap-1 px-1 text-ink-500">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-500 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-500 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-500" />
              </div>
            )}
            <div ref={transcriptEndRef} />
          </div>
          {status === 'ended' && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-ink-700 bg-ink-900/40 p-4">
              <div>
                <p className="font-display font-bold text-ink-100">{strings.incidentReport.endedBannerTitle}</p>
                <p className="text-sm text-ink-300">{strings.incidentReport.endedBannerBody}</p>
              </div>
              <button
                type="button"
                onClick={() => setReportOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-2 text-sm font-semibold text-ink-950 hover:bg-brand-400"
              >
                <FileText className="h-4 w-4" aria-hidden />
                {strings.incidentReport.viewButton}
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 lg:col-span-2">
          <RiskMeter score={result.score} level={result.level} />
          <DetectionEventFeed matched={result.matchedCategories} resetSignal={playId} />
          <TacticsList matched={result.matchedCategories} />
        </div>
      </div>

      {canReviewAlert && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => setDismissedAtLevel(null)}
            className="rounded-lg px-3 py-2 text-xs font-semibold text-caution-300 underline decoration-dotted hover:text-caution-200"
          >
            {strings.callScreen.reviewAlert}
          </button>
        </div>
      )}

      {showWarning && (
        <div className="mt-5">
          <WarningOverlay
            level={result.level}
            score={result.score}
            matched={result.matchedCategories}
            onDismiss={() => setDismissedAtLevel(result.level)}
            onOpenReport={() => setReportOpen(true)}
          />
        </div>
      )}

      <CitizenActionHub open={actionHubOpen} onClose={() => setActionHubOpen(false)} />
      <IncidentReportModal open={reportOpen} onClose={() => setReportOpen(false)} data={incidentData} />

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
            <WorkflowVisualizer defaultWorkflowId="liveCall" />
          </div>
        </div>
      )}
    </div>
  )
}
