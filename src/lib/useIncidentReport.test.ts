import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Scenario } from '../types'
import type { DetectionResult } from './detectionEngine'
import type { CallPlaybackState } from './useCallPlayback'
import { useIncidentReport } from './useIncidentReport'

const scenario: Scenario = {
  id: 'digital-arrest',
  title: 'Fake "Digital Arrest" — CBI Impersonation',
  description: '',
  category: 'digital-arrest',
  isScam: true,
  language: 'en',
  callerName: 'Unknown — "Officer A. Sharma"',
  lines: [],
}

const normalScenario: Scenario = {
  ...scenario,
  id: 'friend-chat',
  category: 'normal',
  isScam: false,
  callerName: 'Priya (Contact)',
}

const EMPTY_RESULT: DetectionResult = { score: 0, level: 'LOW', matchedCategories: [], topCategoryIds: [] }

function makePlayback(overrides: Partial<CallPlaybackState> = {}): CallPlaybackState {
  return {
    visibleLines: [],
    result: EMPTY_RESULT,
    status: 'playing',
    mode: { kind: 'speed', multiplier: 1 },
    warningEverShown: false,
    hasTrigger: false,
    playId: 0,
    setSpeed: vi.fn(),
    startInstantDemo: vi.fn(),
    jumpToTrigger: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    restart: vi.fn(),
    ...overrides,
  }
}

describe('useIncidentReport', () => {
  it('starts with a fresh incident id, zero peak score, and an empty timeline', () => {
    const { result } = renderHook(({ playback }) => useIncidentReport(scenario, playback), {
      initialProps: { playback: makePlayback() },
    })
    expect(result.current.incidentId).toMatch(/^RC-\d{8}-[A-Z0-9]{4}$/)
    expect(result.current.peakScore).toBe(0)
    expect(result.current.timeline).toEqual([])
    expect(result.current.finalLevel).toBe('LOW')
  })

  it('infers the scam type from a scam scenario, and leaves it null for a normal scenario', () => {
    const { result: scamResult } = renderHook(({ playback }) => useIncidentReport(scenario, playback), {
      initialProps: { playback: makePlayback() },
    })
    expect(scamResult.current.scamTypeKey).toBe('digitalArrest')

    const { result: normalResult } = renderHook(({ playback }) => useIncidentReport(normalScenario, playback), {
      initialProps: { playback: makePlayback() },
    })
    expect(normalResult.current.scamTypeKey).toBeNull()
  })

  it('tracks the peak score even after the score later drops relative to a later render', () => {
    const { result, rerender } = renderHook(({ playback }) => useIncidentReport(scenario, playback), {
      initialProps: {
        playback: makePlayback({ result: { score: 80, level: 'HIGH', matchedCategories: [], topCategoryIds: [] } }),
      },
    })
    expect(result.current.peakScore).toBe(80)

    // A later render reports a lower score (shouldn't happen in real detection, but the
    // peak tracker must still hold the max ever seen this play-through regardless).
    rerender({ playback: makePlayback({ result: { score: 40, level: 'MEDIUM', matchedCategories: [], topCategoryIds: [] } }) })
    expect(result.current.peakScore).toBe(80)
    expect(result.current.finalScore).toBe(40)
  })

  it('records a timeline entry the first time each category appears, and only once', () => {
    const authorityOnly: DetectionResult = {
      score: 15,
      level: 'LOW',
      matchedCategories: [{ id: 'authority', weight: 15, matchedPhrases: ['cbi'] }],
      topCategoryIds: ['authority'],
    }
    const authorityAndThreat: DetectionResult = {
      score: 39,
      level: 'MEDIUM',
      matchedCategories: [
        { id: 'authority', weight: 15, matchedPhrases: ['cbi'] },
        { id: 'threat', weight: 18, matchedPhrases: ['arrest'] },
      ],
      topCategoryIds: ['threat', 'authority'],
    }

    const { result, rerender } = renderHook(({ playback }) => useIncidentReport(scenario, playback), {
      initialProps: { playback: makePlayback({ result: authorityOnly }) },
    })
    expect(result.current.timeline).toHaveLength(1)
    expect(result.current.timeline[0].categoryId).toBe('authority')

    rerender({ playback: makePlayback({ result: authorityAndThreat }) })
    expect(result.current.timeline).toHaveLength(2)
    expect(result.current.timeline[1].categoryId).toBe('threat')

    // Re-rendering with the same matched categories must not duplicate entries.
    rerender({ playback: makePlayback({ result: authorityAndThreat }) })
    expect(result.current.timeline).toHaveLength(2)
  })

  it('resets peak score, timeline, and gets a new incident id when playId changes (restart)', () => {
    const highResult: DetectionResult = {
      score: 90,
      level: 'HIGH',
      matchedCategories: [{ id: 'threat', weight: 18, matchedPhrases: ['arrest'] }],
      topCategoryIds: ['threat'],
    }
    const { result, rerender } = renderHook(({ playback }) => useIncidentReport(scenario, playback), {
      initialProps: { playback: makePlayback({ result: highResult, playId: 0 }) },
    })
    const firstId = result.current.incidentId
    expect(result.current.peakScore).toBe(90)
    expect(result.current.timeline).toHaveLength(1)

    rerender({ playback: makePlayback({ result: EMPTY_RESULT, playId: 1 }) })
    expect(result.current.incidentId).not.toBe(firstId)
    expect(result.current.peakScore).toBe(0)
    expect(result.current.timeline).toEqual([])
  })

  it('duration becomes fixed once playback status is "ended"', () => {
    const { result, rerender } = renderHook(({ playback }) => useIncidentReport(scenario, playback), {
      initialProps: { playback: makePlayback({ status: 'playing' }) },
    })
    expect(result.current.durationMs).not.toBeNull()

    rerender({ playback: makePlayback({ status: 'ended' }) })
    const durationAtEnd = result.current.durationMs

    // Re-rendering later (simulating time passing) must not keep advancing the duration
    // once the call has ended.
    rerender({ playback: makePlayback({ status: 'ended' }) })
    expect(result.current.durationMs).toBe(durationAtEnd)
  })

  it('exposes the live matchedCategories and finalLevel straight from the detection engine, never inventing its own', () => {
    const result3: DetectionResult = {
      score: 71,
      level: 'HIGH',
      matchedCategories: [
        { id: 'authority', weight: 15, matchedPhrases: ['cbi'] },
        { id: 'threat', weight: 18, matchedPhrases: ['arrest'] },
        { id: 'financialExtraction', weight: 25, matchedPhrases: ['transfer money'] },
      ],
      topCategoryIds: ['financialExtraction', 'threat', 'authority'],
    }
    const { result } = renderHook(({ playback }) => useIncidentReport(scenario, playback), {
      initialProps: { playback: makePlayback({ result: result3 }) },
    })
    expect(result.current.matchedCategories).toBe(result3.matchedCategories)
    expect(result.current.finalLevel).toBe('HIGH')
    expect(result.current.finalScore).toBe(71)
  })
})
