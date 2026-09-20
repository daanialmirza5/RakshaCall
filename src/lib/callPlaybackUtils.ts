/**
 * Pure helper functions for driving the demo call-playback timeline.
 * No React, no timers — this is the part of useCallPlayback.ts that's cheap
 * to unit test directly.
 */
import type { Scenario, TranscriptLine } from '../types'
import { analyzeCallerText, type DetectionResult } from './detectionEngine'

export type PlaybackMode = { kind: 'speed'; multiplier: 1 | 2 | 3 } | { kind: 'instant' }

export type PlaybackStatus = 'playing' | 'paused' | 'ended'

export type TimelineStage = 'started' | 'suspicious' | 'escalation' | 'highRisk' | 'intervention'

const INSTANT_TARGET_TOTAL_MS = 5000
const INSTANT_MIN_LINE_MS = 220
const INSTANT_MAX_LINE_MS = 900
const MIN_LINE_MS = 60
const MIN_END_DELAY_MS = 150
const INSTANT_END_DELAY_MS = 400
const DEFAULT_END_DELAY_MS = 1200

/** Per-line reveal delay for the given playback mode. */
export function computeLineDelayMs(originalDelayMs: number, mode: PlaybackMode, totalLines: number): number {
  if (mode.kind === 'instant') {
    const perLine = Math.round(INSTANT_TARGET_TOTAL_MS / Math.max(1, totalLines))
    return Math.max(INSTANT_MIN_LINE_MS, Math.min(INSTANT_MAX_LINE_MS, perLine))
  }
  return Math.max(MIN_LINE_MS, Math.round(originalDelayMs / mode.multiplier))
}

/** Delay before the scenario is marked "ended" after its last line is revealed. */
export function computeEndDelayMs(mode: PlaybackMode): number {
  if (mode.kind === 'instant') return INSTANT_END_DELAY_MS
  return Math.max(MIN_END_DELAY_MS, Math.round(DEFAULT_END_DELAY_MS / mode.multiplier))
}

/** Accumulated caller-only text for all lines up to and including `endIndex`. */
export function accumulatedCallerText(lines: TranscriptLine[], endIndex: number): string {
  return lines
    .slice(0, endIndex + 1)
    .filter((line) => line.speaker === 'caller')
    .map((line) => line.text)
    .join(' ')
}

/**
 * Replays a scenario's caller lines through the real detection engine to
 * find the earliest line index at which accumulated risk first reaches
 * HIGH — the scenario's "scam trigger" moment for the "Jump to Scam
 * Trigger" demo control. Returns null when the scenario never reaches HIGH
 * (e.g. the normal/non-scam demo scenarios), so callers can disable that
 * control rather than jumping nowhere.
 */
export function findScamTriggerLineIndex(scenario: Scenario): number | null {
  let callerTextSoFar = ''
  for (let i = 0; i < scenario.lines.length; i++) {
    const line = scenario.lines[i]
    if (line.speaker !== 'caller') continue
    callerTextSoFar = `${callerTextSoFar} ${line.text}`.trim()
    if (analyzeCallerText(callerTextSoFar).level === 'HIGH') return i
  }
  return null
}

/**
 * Maps the current detection result (plus whether the HIGH-risk warning has
 * ever been shown this play-through) onto a single call-timeline stage.
 * Detection state only ever escalates within one play-through (matched
 * categories accumulate and never un-match), so this is monotonic too.
 */
export function computeTimelineStage(result: DetectionResult, warningEverShown: boolean): TimelineStage {
  if (warningEverShown) return 'intervention'
  if (result.level === 'HIGH') return 'highRisk'
  if (result.level === 'MEDIUM') return 'escalation'
  if (result.matchedCategories.length > 0) return 'suspicious'
  return 'started'
}
