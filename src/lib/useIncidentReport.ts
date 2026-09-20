import { useEffect, useMemo, useRef, useState } from 'react'
import type { SignalCategoryId } from '../data/signals'
import type { Scenario } from '../types'
import {
  generateIncidentId,
  scamTypeKeyForCategory,
  type IncidentReportData,
  type IncidentTimelineEntry,
} from './incidentReportUtils'
import type { CallPlaybackState } from './useCallPlayback'

/**
 * Derives a live incident-report snapshot from an existing `useCallPlayback`
 * result, without touching its internals or duplicating its scoring: every
 * field here is read straight from `playback.result` (the one real
 * detection-engine output) or from timestamps this hook adds on top.
 *
 * A "new incident" starts whenever `playback.playId` changes (restart /
 * instant demo / scenario switch) — peak score, the detection timeline, and
 * the incident id all reset then, exactly mirroring how the rest of the
 * call-screen state already resets on that signal.
 */
export function useIncidentReport(scenario: Scenario, playback: CallPlaybackState): IncidentReportData {
  const [incidentId, setIncidentId] = useState(() => generateIncidentId())
  const [startedAt, setStartedAt] = useState(() => Date.now())
  const [endedAt, setEndedAt] = useState<number | null>(null)
  const [peakScore, setPeakScore] = useState(0)
  const [timeline, setTimeline] = useState<IncidentTimelineEntry[]>([])
  const seenRef = useRef<Set<SignalCategoryId>>(new Set())

  // A fresh play-through -> a fresh incident.
  useEffect(() => {
    setIncidentId(generateIncidentId())
    setStartedAt(Date.now())
    setEndedAt(null)
    setPeakScore(0)
    setTimeline([])
    seenRef.current = new Set()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playback.playId])

  useEffect(() => {
    setPeakScore((prev) => Math.max(prev, playback.result.score))

    const newlyMatched = playback.result.matchedCategories.filter((m) => !seenRef.current.has(m.id))
    if (newlyMatched.length === 0) return
    newlyMatched.forEach((m) => seenRef.current.add(m.id))

    const now = Date.now()
    setTimeline((prev) => [
      ...prev,
      ...newlyMatched.map((m) => ({
        categoryId: m.id,
        atMs: Math.max(0, now - startedAt),
        scoreAfter: playback.result.score,
        levelAfter: playback.result.level,
      })),
    ])
  }, [playback.result, startedAt])

  useEffect(() => {
    if (playback.status === 'ended') setEndedAt((prev) => prev ?? Date.now())
  }, [playback.status])

  return useMemo<IncidentReportData>(
    () => ({
      incidentId,
      generatedAt: Date.now(),
      source: 'live-call',
      callerName: scenario.callerName,
      scenarioTitle: scenario.title,
      scamTypeKey: scenario.isScam ? scamTypeKeyForCategory(scenario.category) : null,
      durationMs: (endedAt ?? Date.now()) - startedAt,
      peakScore,
      finalScore: playback.result.score,
      finalLevel: playback.result.level,
      matchedCategories: playback.result.matchedCategories,
      timeline,
    }),
    [incidentId, scenario, endedAt, startedAt, peakScore, playback.result, timeline],
  )
}
