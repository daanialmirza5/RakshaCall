import { AnimatePresence, motion } from 'framer-motion'
import { PhoneOff, RotateCcw, Radio, Pause as PauseIcon, PhoneOff as EndedIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useAppSettings } from '../i18n/LanguageContext'
import type { RiskLevel } from '../data/signals'
import { computeTimelineStage } from '../lib/callPlaybackUtils'
import { useCallPlayback } from '../lib/useCallPlayback'
import type { Scenario } from '../types'
import { CallTimeline } from './CallTimeline'
import { DetectionEventFeed } from './DetectionEventFeed'
import { PlaybackControls } from './PlaybackControls'
import { RiskMeter } from './RiskMeter'
import { TacticsList } from './TacticsList'
import { WarningOverlay } from './WarningOverlay'

const LEVEL_RANK: Record<RiskLevel, number> = { LOW: 0, MEDIUM: 1, HIGH: 2 }
/** How close to the bottom (px) the transcript must already be for new lines to auto-scroll it. */
const AUTO_SCROLL_THRESHOLD_PX = 80

export function CallScreen({ scenario, onExit }: { scenario: Scenario; onExit: () => void }) {
  const { strings } = useAppSettings()
  const playback = useCallPlayback(scenario)
  const { visibleLines, result, status, mode, warningEverShown, hasTrigger, playId } = playback

  const [dismissedAtLevel, setDismissedAtLevel] = useState<RiskLevel | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const transcriptEndRef = useRef<HTMLDivElement | null>(null)

  // A fresh play-through (restart / instant demo / new scenario) clears any earlier dismissal.
  useEffect(() => {
    setDismissedAtLevel(null)
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
          onSetSpeed={playback.setSpeed}
          onInstantDemo={playback.startInstantDemo}
          onJumpToTrigger={playback.jumpToTrigger}
          onPause={playback.pause}
          onResume={playback.resume}
        />
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
            matched={result.matchedCategories}
            onDismiss={() => setDismissedAtLevel(result.level)}
          />
        </div>
      )}
    </div>
  )
}
