import { describe, expect, it } from 'vitest'
import { SCAM_SCENARIOS, NORMAL_SCENARIOS } from '../data/scenarios'
import {
  accumulatedCallerText,
  computeEndDelayMs,
  computeLineDelayMs,
  computeTimelineStage,
  findScamTriggerLineIndex,
} from './callPlaybackUtils'
import { analyzeCallerText } from './detectionEngine'

describe('computeLineDelayMs', () => {
  it('divides the original delay by the speed multiplier', () => {
    expect(computeLineDelayMs(3000, { kind: 'speed', multiplier: 1 }, 5)).toBe(3000)
    expect(computeLineDelayMs(3000, { kind: 'speed', multiplier: 2 }, 5)).toBe(1500)
    expect(computeLineDelayMs(3000, { kind: 'speed', multiplier: 3 }, 5)).toBe(1000)
  })

  it('never returns a delay below the floor, even at 3x on a tiny original delay', () => {
    expect(computeLineDelayMs(100, { kind: 'speed', multiplier: 3 }, 5)).toBeGreaterThanOrEqual(60)
  })

  it('ignores the original delay entirely in instant mode', () => {
    const withOriginal3600 = computeLineDelayMs(3600, { kind: 'instant' }, 10)
    const withOriginal500 = computeLineDelayMs(500, { kind: 'instant' }, 10)
    expect(withOriginal3600).toBe(withOriginal500)
  })

  it('keeps instant-mode total playback time roughly within a 3-7s demo window', () => {
    for (const lineCount of [3, 5, 8, 11, 20]) {
      const perLine = computeLineDelayMs(1000, { kind: 'instant' }, lineCount)
      const total = perLine * lineCount
      expect(total).toBeGreaterThanOrEqual(1500)
      expect(total).toBeLessThanOrEqual(9000)
    }
  })
})

describe('computeEndDelayMs', () => {
  it('scales down with speed', () => {
    const at1x = computeEndDelayMs({ kind: 'speed', multiplier: 1 })
    const at3x = computeEndDelayMs({ kind: 'speed', multiplier: 3 })
    expect(at3x).toBeLessThan(at1x)
  })

  it('is short and fixed in instant mode', () => {
    expect(computeEndDelayMs({ kind: 'instant' })).toBeLessThan(computeEndDelayMs({ kind: 'speed', multiplier: 1 }))
  })
})

describe('accumulatedCallerText', () => {
  it('joins only caller lines up to and including the given index', () => {
    const lines = [
      { speaker: 'caller' as const, text: 'Hello', delayMs: 0 },
      { speaker: 'user' as const, text: 'Hi', delayMs: 0 },
      { speaker: 'caller' as const, text: 'This is urgent', delayMs: 0 },
    ]
    expect(accumulatedCallerText(lines, 0)).toBe('Hello')
    expect(accumulatedCallerText(lines, 1)).toBe('Hello')
    expect(accumulatedCallerText(lines, 2)).toBe('Hello This is urgent')
  })
})

describe('findScamTriggerLineIndex', () => {
  it('finds a valid HIGH-risk trigger line wherever one exists in a scam scenario', () => {
    // Not every authored scam scenario necessarily reaches HIGH on its own text
    // (e.g. investment-task-scam tops out at MEDIUM) — that's a real detection-
    // engine outcome validated in Section 1, not something this helper should
    // paper over. Whenever a trigger IS found, it must be a genuine HIGH point.
    for (const scenario of SCAM_SCENARIOS) {
      const index = findScamTriggerLineIndex(scenario)
      if (index !== null) {
        expect(scenario.lines[index].speaker).toBe('caller')
        const textUpToTrigger = accumulatedCallerText(scenario.lines, index)
        expect(analyzeCallerText(textUpToTrigger).level).toBe('HIGH')
      }
    }
  })

  it('finds a trigger for the scam scenarios known to reach HIGH risk', () => {
    for (const id of ['digital-arrest', 'fake-bank', 'courier-customs', 'sim-deactivation']) {
      const scenario = SCAM_SCENARIOS.find((s) => s.id === id)!
      expect(findScamTriggerLineIndex(scenario), `expected ${id} to have a trigger line`).not.toBeNull()
    }
  })

  it('returns null for scenarios that never reach HIGH risk', () => {
    for (const scenario of NORMAL_SCENARIOS) {
      expect(findScamTriggerLineIndex(scenario)).toBeNull()
    }
  })

  it('finds the earliest HIGH-risk line, not a later one', () => {
    const scenario = SCAM_SCENARIOS.find((s) => s.id === 'digital-arrest')!
    const index = findScamTriggerLineIndex(scenario)!
    if (index > 0) {
      const textBeforeTrigger = accumulatedCallerText(scenario.lines, index - 1)
      expect(analyzeCallerText(textBeforeTrigger).level).not.toBe('HIGH')
    }
  })
})

describe('computeTimelineStage', () => {
  const EMPTY = { score: 0, level: 'LOW' as const, matchedCategories: [], topCategoryIds: [] }

  it('is "started" with no detections and no warning', () => {
    expect(computeTimelineStage(EMPTY, false)).toBe('started')
  })

  it('is "suspicious" once at least one category is matched but risk is still LOW', () => {
    const result = { ...EMPTY, matchedCategories: [{ id: 'urgency' as const, weight: 12, matchedPhrases: ['urgent'] }] }
    expect(computeTimelineStage(result, false)).toBe('suspicious')
  })

  it('is "escalation" at MEDIUM risk', () => {
    expect(computeTimelineStage({ ...EMPTY, level: 'MEDIUM' }, false)).toBe('escalation')
  })

  it('is "highRisk" at HIGH risk before any warning has shown', () => {
    expect(computeTimelineStage({ ...EMPTY, level: 'HIGH' }, false)).toBe('highRisk')
  })

  it('is "intervention" once the warning has ever been shown, regardless of current level', () => {
    expect(computeTimelineStage({ ...EMPTY, level: 'HIGH' }, true)).toBe('intervention')
  })
})
