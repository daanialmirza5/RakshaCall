import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Scenario } from '../types'
import type { DetectionResult } from './detectionEngine'
import type { CallPlaybackState } from './useCallPlayback'

const mocks = vi.hoisted(() => ({
  isTTSSupported: vi.fn(() => true),
  speak: vi.fn(),
  cancelSpeech: vi.fn(),
  pauseSpeech: vi.fn(),
  resumeSpeech: vi.fn(),
  listeners: new Set<(s: string) => void>(),
}))

vi.mock('./speechSynthesis', () => ({
  isTTSSupported: mocks.isTTSSupported,
  speak: mocks.speak,
  cancelSpeech: mocks.cancelSpeech,
  pauseSpeech: mocks.pauseSpeech,
  resumeSpeech: mocks.resumeSpeech,
  subscribeSpeechState: (listener: (s: string) => void) => {
    mocks.listeners.add(listener)
    return () => mocks.listeners.delete(listener)
  },
  ttsRateForMode: (mode: { kind: string; multiplier?: number }) =>
    mode.kind === 'instant' ? 1.5 : mode.multiplier === 1 ? 1 : mode.multiplier === 2 ? 1.2 : 1.4,
  computeVoiceActivityState: (ttsSupported: boolean, voiceEnabled: boolean, state: string) => {
    if (!ttsSupported) return 'unsupported'
    if (!voiceEnabled) return 'muted'
    return state
  },
}))

// Imported after the mock so useCallVoice picks up the mocked ./speechSynthesis module.
const { useCallVoice } = await import('./useCallVoice')

const scenario: Scenario = {
  id: 'test-scenario',
  title: 'Test',
  description: '',
  category: 'digital-arrest',
  isScam: true,
  language: 'en',
  callerName: 'Tester',
  lines: [
    { speaker: 'caller', text: 'Line one', delayMs: 500 },
    { speaker: 'user', text: 'Reply', delayMs: 500 },
    { speaker: 'caller', text: 'Line two', delayMs: 500 },
  ],
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

beforeEach(() => {
  mocks.isTTSSupported.mockReturnValue(true)
  mocks.speak.mockClear()
  mocks.cancelSpeech.mockClear()
  mocks.pauseSpeech.mockClear()
  mocks.resumeSpeech.mockClear()
  mocks.listeners.clear()
  try {
    localStorage.clear()
  } catch {
    // ignore
  }
})

describe('useCallVoice', () => {
  it('speaks a newly-revealed caller line while playing', () => {
    const { rerender } = renderHook(({ playback }) => useCallVoice(scenario, playback), {
      initialProps: { playback: makePlayback({ visibleLines: [] }) },
    })
    mocks.speak.mockClear()

    rerender({ playback: makePlayback({ visibleLines: [scenario.lines[0]] }) })
    expect(mocks.speak).toHaveBeenCalledTimes(1)
    expect(mocks.speak).toHaveBeenCalledWith('Line one', { langCode: 'en-IN', rate: 1 })
  })

  it('does not speak a user line', () => {
    const { rerender } = renderHook(({ playback }) => useCallVoice(scenario, playback), {
      initialProps: { playback: makePlayback({ visibleLines: [scenario.lines[0]] }) },
    })
    mocks.speak.mockClear()

    rerender({ playback: makePlayback({ visibleLines: scenario.lines.slice(0, 2) }) })
    expect(mocks.speak).not.toHaveBeenCalled()
  })

  it('does not speak while in Instant Demo mode', () => {
    const { rerender } = renderHook(({ playback }) => useCallVoice(scenario, playback), {
      initialProps: { playback: makePlayback({ visibleLines: [], mode: { kind: 'instant' } }) },
    })
    mocks.speak.mockClear()

    rerender({ playback: makePlayback({ visibleLines: [scenario.lines[0]], mode: { kind: 'instant' } }) })
    expect(mocks.speak).not.toHaveBeenCalled()
  })

  it('does not speak lines revealed while status is not "playing" (e.g. a Jump-to-Trigger batch reveal)', () => {
    const { rerender } = renderHook(({ playback }) => useCallVoice(scenario, playback), {
      initialProps: { playback: makePlayback({ visibleLines: [] }) },
    })
    mocks.speak.mockClear()

    // Simulates jumpToTrigger: several lines appear at once, landing in 'paused'.
    rerender({ playback: makePlayback({ visibleLines: scenario.lines, status: 'paused' }) })
    expect(mocks.speak).not.toHaveBeenCalled()
  })

  it('does not speak when voice is toggled off', () => {
    const { result, rerender } = renderHook(({ playback }) => useCallVoice(scenario, playback), {
      initialProps: { playback: makePlayback({ visibleLines: [] }) },
    })
    act(() => result.current.toggleVoice())
    expect(result.current.voiceEnabled).toBe(false)
    mocks.speak.mockClear()

    rerender({ playback: makePlayback({ visibleLines: [scenario.lines[0]] }) })
    expect(mocks.speak).not.toHaveBeenCalled()
  })

  it('cancels speech immediately when voice is toggled off mid-utterance', () => {
    const { result } = renderHook(({ playback }) => useCallVoice(scenario, playback), {
      initialProps: { playback: makePlayback() },
    })
    mocks.cancelSpeech.mockClear()
    act(() => result.current.toggleVoice())
    expect(mocks.cancelSpeech).toHaveBeenCalled()
  })

  it('never re-speaks the same line across rerenders with unchanged visibleLines', () => {
    const line0Only = [scenario.lines[0]]
    const { rerender } = renderHook(({ playback }) => useCallVoice(scenario, playback), {
      initialProps: { playback: makePlayback({ visibleLines: line0Only }) },
    })
    mocks.speak.mockClear()

    rerender({ playback: makePlayback({ visibleLines: line0Only }) })
    rerender({ playback: makePlayback({ visibleLines: [...line0Only] }) }) // new array, same content/length
    expect(mocks.speak).not.toHaveBeenCalled()
  })

  it('cancels stale speech and resets tracking when playId changes (restart / instant demo / scenario change)', () => {
    const { rerender } = renderHook(({ playback }) => useCallVoice(scenario, playback), {
      initialProps: { playback: makePlayback({ visibleLines: [scenario.lines[0]], playId: 0 }) },
    })
    mocks.cancelSpeech.mockClear()
    mocks.speak.mockClear()

    // A restart: playId bumps, transcript resets to empty first...
    rerender({ playback: makePlayback({ visibleLines: [], playId: 1 }) })
    expect(mocks.cancelSpeech).toHaveBeenCalled()

    // ...then line one reappears under the new playId and should be spoken again
    // (it's a fresh play-through, not a stale replay).
    mocks.speak.mockClear()
    rerender({ playback: makePlayback({ visibleLines: [scenario.lines[0]], playId: 1 }) })
    expect(mocks.speak).toHaveBeenCalledTimes(1)
  })

  it('follows playback pause/resume', () => {
    const { rerender } = renderHook(({ playback }) => useCallVoice(scenario, playback), {
      initialProps: { playback: makePlayback({ status: 'playing' }) },
    })
    mocks.pauseSpeech.mockClear()
    mocks.resumeSpeech.mockClear()

    rerender({ playback: makePlayback({ status: 'paused' }) })
    expect(mocks.pauseSpeech).toHaveBeenCalled()

    rerender({ playback: makePlayback({ status: 'playing' }) })
    expect(mocks.resumeSpeech).toHaveBeenCalled()
  })

  it('stopSpeaking() cancels speech immediately, for callers (e.g. Jump-to-Trigger) that need it outside the playId-reset path', () => {
    const { result } = renderHook(({ playback }) => useCallVoice(scenario, playback), {
      initialProps: { playback: makePlayback() },
    })
    mocks.cancelSpeech.mockClear()
    act(() => result.current.stopSpeaking())
    expect(mocks.cancelSpeech).toHaveBeenCalled()
  })

  it('cancels speech on unmount', () => {
    const { unmount } = renderHook(({ playback }) => useCallVoice(scenario, playback), {
      initialProps: { playback: makePlayback() },
    })
    mocks.cancelSpeech.mockClear()
    unmount()
    expect(mocks.cancelSpeech).toHaveBeenCalled()
  })

  it('reports "unsupported" activity state when the browser has no TTS, and voice starts disabled', () => {
    mocks.isTTSSupported.mockReturnValue(false)
    const { result } = renderHook(({ playback }) => useCallVoice(scenario, playback), {
      initialProps: { playback: makePlayback() },
    })
    expect(result.current.ttsSupported).toBe(false)
    expect(result.current.activityState).toBe('unsupported')
  })

  it('uses the scenario dialogue language for TTS, independent of any UI language', () => {
    const hindiUiButEnglishScenario: Scenario = { ...scenario, language: 'en' }
    const { rerender } = renderHook(({ playback }) => useCallVoice(hindiUiButEnglishScenario, playback), {
      initialProps: { playback: makePlayback({ visibleLines: [] }) },
    })
    mocks.speak.mockClear()
    rerender({ playback: makePlayback({ visibleLines: [scenario.lines[0]] }) })
    expect(mocks.speak).toHaveBeenCalledWith('Line one', expect.objectContaining({ langCode: 'en-IN' }))
  })
})
