import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Scenario, TranscriptLine } from '../types'
import { analyzeCallerText, type DetectionResult } from './detectionEngine'
import {
  accumulatedCallerText,
  computeEndDelayMs,
  computeLineDelayMs,
  findScamTriggerLineIndex,
  type PlaybackMode,
  type PlaybackStatus,
} from './callPlaybackUtils'

const EMPTY_RESULT: DetectionResult = { score: 0, level: 'LOW', matchedCategories: [], topCategoryIds: [] }

export type SpeedMultiplier = 1 | 2 | 3

export interface CallPlaybackState {
  visibleLines: TranscriptLine[]
  result: DetectionResult
  status: PlaybackStatus
  mode: PlaybackMode
  /** True once this play-through has ever reached HIGH risk. */
  warningEverShown: boolean
  /** True if this scenario has a HIGH-risk moment to jump to. */
  hasTrigger: boolean
  /** Bumped on every restart/instant-demo/scenario-change — lets dependents (e.g. detection-event toasts, dismissed-warning state) know to reset. */
  playId: number
  setSpeed: (speed: SpeedMultiplier) => void
  startInstantDemo: () => void
  jumpToTrigger: () => void
  pause: () => void
  resume: () => void
  restart: () => void
}

/**
 * Drives the demo call-transcript playback: reveals scenario lines on a
 * timer, runs the real detection engine on accumulated caller text as each
 * caller line lands, and exposes controls (speed, pause/resume, restart,
 * instant demo, jump-to-trigger) for the hackathon-demo UI.
 *
 * Design: exactly one JS timer is ever pending at a time (`timeoutRef`),
 * scheduled by `scheduleFrom(index)` for the *next* unrevealed line. Every
 * control (speed change, pause, resume, restart, jump) first clears that
 * pending timer before doing anything else, so there is never more than one
 * in-flight timer and no possibility of duplicated/overlapping playback.
 * Speed changes take effect by cancelling the current wait and restarting
 * it (from now) using the new speed's delay for the next line — simple and
 * fully predictable, at the cost of not prorating a partially-elapsed wait.
 */
export function useCallPlayback(scenario: Scenario): CallPlaybackState {
  const [visibleLines, setVisibleLines] = useState<TranscriptLine[]>([])
  const [result, setResult] = useState<DetectionResult>(EMPTY_RESULT)
  const [status, setStatus] = useState<PlaybackStatus>('playing')
  const [mode, setModeState] = useState<PlaybackMode>({ kind: 'speed', multiplier: 1 })
  const [warningEverShown, setWarningEverShown] = useState(false)
  const [playId, setPlayId] = useState(0)

  const lineIndexRef = useRef(0)
  const modeRef = useRef<PlaybackMode>(mode)
  const timeoutRef = useRef<number | null>(null)
  // Pure function of `scenario` alone, so a memo (not an effect+ref) is enough.
  const triggerIndex = useMemo(() => findScamTriggerLineIndex(scenario), [scenario])

  const clearPendingTimer = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const applyLine = useCallback(
    (index: number) => {
      const line = scenario.lines[index]
      setVisibleLines((prev) => [...prev, line])
      if (line.speaker === 'caller') {
        const next = analyzeCallerText(accumulatedCallerText(scenario.lines, index))
        setResult(next)
        if (next.level === 'HIGH') setWarningEverShown(true)
      }
    },
    [scenario],
  )

  const scheduleFrom = useCallback(
    (index: number) => {
      clearPendingTimer()
      if (index >= scenario.lines.length) {
        timeoutRef.current = window.setTimeout(() => {
          timeoutRef.current = null
          setStatus('ended')
        }, computeEndDelayMs(modeRef.current))
        return
      }
      const delay = computeLineDelayMs(scenario.lines[index].delayMs, modeRef.current, scenario.lines.length)
      timeoutRef.current = window.setTimeout(() => {
        timeoutRef.current = null
        lineIndexRef.current = index + 1
        applyLine(index)
        scheduleFrom(index + 1)
      }, delay)
    },
    [applyLine, clearPendingTimer, scenario],
  )

  const resetState = useCallback(() => {
    clearPendingTimer()
    lineIndexRef.current = 0
    setVisibleLines([])
    setResult(EMPTY_RESULT)
    setWarningEverShown(false)
    setPlayId((id) => id + 1)
  }, [clearPendingTimer])

  // (Re)start whenever the scenario identity changes — covers both the
  // initial mount and switching to a different scenario mid-session.
  useEffect(() => {
    resetState()
    setStatus('playing')
    scheduleFrom(0)
    return () => clearPendingTimer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario])

  const setSpeed = useCallback(
    (speed: SpeedMultiplier) => {
      const next: PlaybackMode = { kind: 'speed', multiplier: speed }
      modeRef.current = next
      setModeState(next)
      if (status === 'playing') scheduleFrom(lineIndexRef.current)
    },
    [scheduleFrom, status],
  )

  const startInstantDemo = useCallback(() => {
    const next: PlaybackMode = { kind: 'instant' }
    modeRef.current = next
    setModeState(next)
    resetState()
    setStatus('playing')
    scheduleFrom(0)
  }, [resetState, scheduleFrom])

  const jumpToTrigger = useCallback(() => {
    if (triggerIndex === null) return
    clearPendingTimer()
    setVisibleLines(scenario.lines.slice(0, triggerIndex + 1))
    lineIndexRef.current = triggerIndex + 1
    const next = analyzeCallerText(accumulatedCallerText(scenario.lines, triggerIndex))
    setResult(next)
    if (next.level === 'HIGH') setWarningEverShown(true)
    setStatus('paused')
  }, [clearPendingTimer, scenario, triggerIndex])

  const pause = useCallback(() => {
    if (status !== 'playing') return
    clearPendingTimer()
    setStatus('paused')
  }, [clearPendingTimer, status])

  const resume = useCallback(() => {
    if (status !== 'paused') return
    setStatus('playing')
    scheduleFrom(lineIndexRef.current)
  }, [scheduleFrom, status])

  const restart = useCallback(() => {
    resetState()
    setStatus('playing')
    scheduleFrom(0)
  }, [resetState, scheduleFrom])

  return {
    visibleLines,
    result,
    status,
    mode,
    warningEverShown,
    hasTrigger: triggerIndex !== null,
    playId,
    setSpeed,
    startInstantDemo,
    jumpToTrigger,
    pause,
    resume,
    restart,
  }
}
