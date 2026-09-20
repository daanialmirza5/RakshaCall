import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Scenario } from '../types'
import { useCallPlayback } from './useCallPlayback'

const scenario: Scenario = {
  id: 'test-scenario',
  title: 'Test scenario',
  description: 'A tiny scripted scenario for playback-hook tests.',
  category: 'digital-arrest',
  isScam: true,
  callerName: 'Tester',
  lines: [
    { speaker: 'caller', text: 'This is CBI calling.', delayMs: 1000 },
    { speaker: 'user', text: 'Okay, who is this?', delayMs: 1000 },
    { speaker: 'caller', text: 'Transfer the money immediately or you will be arrested.', delayMs: 1000 },
  ],
}

const normalScenario: Scenario = {
  id: 'test-normal',
  title: 'Normal test scenario',
  description: 'A benign scenario that never reaches HIGH risk.',
  category: 'normal',
  isScam: false,
  callerName: 'Friend',
  lines: [
    { speaker: 'caller', text: 'Hey, are we still on for dinner?', delayMs: 500 },
    { speaker: 'user', text: 'Yes!', delayMs: 500 },
  ],
}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
})

describe('useCallPlayback', () => {
  it('reveals no lines immediately, then reveals them one at a time on their delay', () => {
    const { result } = renderHook(() => useCallPlayback(scenario))
    expect(result.current.visibleLines).toHaveLength(0)

    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.visibleLines).toHaveLength(1)
    expect(result.current.visibleLines[0].text).toBe('This is CBI calling.')

    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.visibleLines).toHaveLength(2)

    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.visibleLines).toHaveLength(3)
  })

  it('runs the real detection engine as caller lines land, and reaches HIGH by the end', () => {
    const { result } = renderHook(() => useCallPlayback(scenario))
    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.result.level).toBe('LOW')

    act(() => vi.advanceTimersByTime(2000))
    expect(result.current.result.level).toBe('HIGH')
    expect(result.current.warningEverShown).toBe(true)
  })

  it('marks status "ended" shortly after the last line, with no further changes', () => {
    const { result } = renderHook(() => useCallPlayback(scenario))
    act(() => vi.advanceTimersByTime(3000))
    expect(result.current.status).not.toBe('ended')
    act(() => vi.advanceTimersByTime(2000))
    expect(result.current.status).toBe('ended')
    const lineCountAtEnd = result.current.visibleLines.length
    act(() => vi.advanceTimersByTime(10000))
    expect(result.current.visibleLines).toHaveLength(lineCountAtEnd)
  })

  it('pause stops progression and resume continues from the same point', () => {
    const { result } = renderHook(() => useCallPlayback(scenario))
    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.visibleLines).toHaveLength(1)

    act(() => result.current.pause())
    expect(result.current.status).toBe('paused')

    // No progression while paused, even after a long wait.
    act(() => vi.advanceTimersByTime(5000))
    expect(result.current.visibleLines).toHaveLength(1)

    act(() => result.current.resume())
    expect(result.current.status).toBe('playing')
    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.visibleLines).toHaveLength(2)
  })

  it('does not duplicate or skip lines when speed changes mid-playback', () => {
    const { result } = renderHook(() => useCallPlayback(scenario))
    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.visibleLines).toHaveLength(1)

    act(() => result.current.setSpeed(3))
    // 3x means ~333ms for the next 1000ms-authored line; well under 1000ms confirms speed took effect.
    act(() => vi.advanceTimersByTime(400))
    expect(result.current.visibleLines).toHaveLength(2)
    expect(result.current.visibleLines[1].text).toBe('Okay, who is this?')

    act(() => vi.advanceTimersByTime(400))
    expect(result.current.visibleLines).toHaveLength(3)
    // Never more than the scenario's 3 lines, however fast: no duplication.
    act(() => vi.advanceTimersByTime(5000))
    expect(result.current.visibleLines).toHaveLength(3)
  })

  it('restart clears the transcript, score, and warning, and replays from line one', () => {
    const { result } = renderHook(() => useCallPlayback(scenario))
    act(() => vi.advanceTimersByTime(3000))
    expect(result.current.result.level).toBe('HIGH')
    expect(result.current.warningEverShown).toBe(true)

    act(() => result.current.restart())
    expect(result.current.visibleLines).toHaveLength(0)
    expect(result.current.result.level).toBe('LOW')
    expect(result.current.warningEverShown).toBe(false)
    expect(result.current.status).toBe('playing')

    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.visibleLines).toHaveLength(1)
  })

  it('bumps playId on restart so dependents can reset their own state', () => {
    const { result } = renderHook(() => useCallPlayback(scenario))
    const firstPlayId = result.current.playId
    act(() => result.current.restart())
    expect(result.current.playId).not.toBe(firstPlayId)
  })

  it('jumpToTrigger reveals lines up through the HIGH-risk moment instantly and pauses there', () => {
    const { result } = renderHook(() => useCallPlayback(scenario))
    expect(result.current.hasTrigger).toBe(true)

    act(() => result.current.jumpToTrigger())
    expect(result.current.result.level).toBe('HIGH')
    expect(result.current.warningEverShown).toBe(true)
    expect(result.current.status).toBe('paused')
    expect(result.current.visibleLines.length).toBeGreaterThan(0)

    // Paused after the jump — no further lines appear on their own.
    act(() => vi.advanceTimersByTime(5000))
    expect(result.current.status).toBe('paused')
  })

  it('hasTrigger is false for a scenario that never reaches HIGH risk, and jumpToTrigger is a no-op', () => {
    const { result } = renderHook(() => useCallPlayback(normalScenario))
    expect(result.current.hasTrigger).toBe(false)

    act(() => result.current.jumpToTrigger())
    expect(result.current.visibleLines).toHaveLength(0)
    expect(result.current.status).toBe('playing')
  })

  it('startInstantDemo replays the full scenario in well under its authored duration', () => {
    const { result } = renderHook(() => useCallPlayback(scenario))
    act(() => result.current.startInstantDemo())
    expect(result.current.visibleLines).toHaveLength(0)

    // Authored duration is 3000ms; instant mode (capped at 900ms/line) must
    // finish comfortably before that, and always within the 3-7s demo target.
    act(() => vi.advanceTimersByTime(2700))
    expect(result.current.visibleLines).toHaveLength(3)
    expect(result.current.result.level).toBe('HIGH')
  })

  it('clears its pending timer on unmount, so no state updates fire afterwards', () => {
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout')
    const { unmount } = renderHook(() => useCallPlayback(scenario))
    act(() => vi.advanceTimersByTime(500))
    unmount()
    expect(clearTimeoutSpy).toHaveBeenCalled()
    // If a stale timer fired after unmount, this would throw/log a React warning; advancing time here must be inert.
    act(() => vi.advanceTimersByTime(10000))
    clearTimeoutSpy.mockRestore()
  })

  it('switching scenarios resets all state — no leakage from the previous scenario', () => {
    const { result, rerender } = renderHook(({ s }) => useCallPlayback(s), { initialProps: { s: scenario } })
    act(() => vi.advanceTimersByTime(3000))
    expect(result.current.result.level).toBe('HIGH')

    rerender({ s: normalScenario })
    expect(result.current.visibleLines).toHaveLength(0)
    expect(result.current.result.level).toBe('LOW')
    expect(result.current.warningEverShown).toBe(false)
    expect(result.current.hasTrigger).toBe(false)

    act(() => vi.advanceTimersByTime(500))
    expect(result.current.visibleLines).toHaveLength(1)
    expect(result.current.visibleLines[0].text).toBe('Hey, are we still on for dinner?')
  })
})
