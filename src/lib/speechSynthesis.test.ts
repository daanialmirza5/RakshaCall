import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  cancelSpeech,
  clampRate,
  computeVoiceActivityState,
  getSpeechState,
  isTTSSupported,
  pauseSpeech,
  pickVoice,
  resumeSpeech,
  speak,
  subscribeSpeechState,
  ttsRateForMode,
  type VoiceLike,
} from './speechSynthesis'

describe('pickVoice (pure)', () => {
  const voices: VoiceLike[] = [
    { lang: 'en-US', name: 'US English', localService: true },
    { lang: 'en-GB', name: 'UK English', localService: true },
    { lang: 'en-IN', name: 'Indian English (network)', localService: false },
    { lang: 'en-IN', name: 'Indian English (on-device)', localService: true },
    { lang: 'hi-IN', name: 'Hindi', localService: true },
  ]

  it('prefers an exact region match over other same-language voices', () => {
    const picked = pickVoice('en-IN', voices)
    expect(picked?.lang).toBe('en-IN')
  })

  it('prefers an on-device ("local service") voice over a network one when both match the region', () => {
    const picked = pickVoice('en-IN', voices)
    expect(picked?.localService).toBe(true)
  })

  it('falls back to same base language when no exact region match exists', () => {
    const picked = pickVoice('en-AU', voices)
    expect(picked?.lang.startsWith('en')).toBe(true)
  })

  it('returns undefined when no voice matches the language at all (never throws)', () => {
    expect(pickVoice('mr-IN', voices)).toBeUndefined()
  })

  it('returns undefined for an empty voice list', () => {
    expect(pickVoice('en-IN', [])).toBeUndefined()
  })

  it('is case-insensitive', () => {
    const picked = pickVoice('EN-in', voices)
    expect(picked?.lang).toBe('en-IN')
  })
})

describe('clampRate', () => {
  it('clamps below the floor up to the minimum', () => {
    expect(clampRate(0.1)).toBe(0.5)
  })

  it('clamps above the ceiling down to the maximum', () => {
    expect(clampRate(10)).toBe(2)
  })

  it('passes through an in-range rate unchanged', () => {
    expect(clampRate(1.2)).toBe(1.2)
  })
})

describe('ttsRateForMode', () => {
  it('never exceeds the sensible intelligibility ceiling, even at 3x', () => {
    expect(ttsRateForMode({ kind: 'speed', multiplier: 3 })).toBeLessThanOrEqual(2)
  })

  it('increases with speed but stays modest, not literally 2x/3x', () => {
    const r1 = ttsRateForMode({ kind: 'speed', multiplier: 1 })
    const r2 = ttsRateForMode({ kind: 'speed', multiplier: 2 })
    const r3 = ttsRateForMode({ kind: 'speed', multiplier: 3 })
    expect(r1).toBe(1)
    expect(r2).toBeGreaterThan(r1)
    expect(r2).toBeLessThan(2)
    expect(r3).toBeGreaterThan(r2)
    expect(r3).toBeLessThan(2)
  })
})

describe('computeVoiceActivityState', () => {
  it('is "unsupported" whenever TTS is unsupported, regardless of the mute preference', () => {
    expect(computeVoiceActivityState(false, true, 'idle')).toBe('unsupported')
    expect(computeVoiceActivityState(false, false, 'speaking')).toBe('unsupported')
  })

  it('is "muted" when supported but disabled', () => {
    expect(computeVoiceActivityState(true, false, 'idle')).toBe('muted')
  })

  it('passes through the raw engine state when supported and enabled', () => {
    expect(computeVoiceActivityState(true, true, 'speaking')).toBe('speaking')
    expect(computeVoiceActivityState(true, true, 'paused')).toBe('paused')
    expect(computeVoiceActivityState(true, true, 'idle')).toBe('idle')
  })
})

describe('isTTSSupported', () => {
  it('is false in the vitest/jsdom environment (no real speechSynthesis implementation)', () => {
    expect(isTTSSupported()).toBe(false)
  })
})

// --- Mocked-browser-API tests: exercise the impure service functions with a fake SpeechSynthesis. ---
describe('speech service against a mocked window.speechSynthesis', () => {
  let mockUtterances: FakeUtterance[]

  class FakeUtterance {
    text: string
    lang = ''
    rate = 1
    voice: unknown = null
    onstart: (() => void) | null = null
    onend: (() => void) | null = null
    onerror: (() => void) | null = null
    constructor(text: string) {
      this.text = text
    }
  }

  const mockSpeechSynthesis = {
    getVoices: vi.fn(() => []),
    speak: vi.fn((utterance: FakeUtterance) => {
      mockUtterances.push(utterance)
      utterance.onstart?.()
    }),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    addEventListener: vi.fn(),
  }

  beforeEach(() => {
    mockUtterances = []
    mockSpeechSynthesis.getVoices.mockClear()
    mockSpeechSynthesis.speak.mockClear()
    mockSpeechSynthesis.cancel.mockClear()
    mockSpeechSynthesis.pause.mockClear()
    mockSpeechSynthesis.resume.mockClear()
    vi.stubGlobal('speechSynthesis', mockSpeechSynthesis)
    vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance)
    cancelSpeech() // reset module-level engine state between tests
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('reports supported once the browser APIs are present', () => {
    expect(isTTSSupported()).toBe(true)
  })

  it('speak() calls the browser API and transitions engine state to "speaking"', () => {
    const listener = vi.fn()
    const unsubscribe = subscribeSpeechState(listener)
    speak('Hello', { langCode: 'en-IN' })
    expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(1)
    expect(getSpeechState()).toBe('speaking')
    expect(listener).toHaveBeenCalledWith('speaking')
    unsubscribe()
  })

  it('speak() always cancels any prior speech first — no overlap', () => {
    speak('First line', { langCode: 'en-IN' })
    speak('Second line', { langCode: 'en-IN' })
    // cancel() is called once per speak() as a guard, so at least 2 calls for 2 speak()s.
    expect(mockSpeechSynthesis.cancel.mock.calls.length).toBeGreaterThanOrEqual(2)
    expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(2)
  })

  it('does not call speak() for blank text', () => {
    speak('   ', { langCode: 'en-IN' })
    expect(mockSpeechSynthesis.speak).not.toHaveBeenCalled()
  })

  it('cancelSpeech() stops speech and resets state to idle', () => {
    speak('Hello', { langCode: 'en-IN' })
    expect(getSpeechState()).toBe('speaking')
    cancelSpeech()
    expect(mockSpeechSynthesis.cancel).toHaveBeenCalled()
    expect(getSpeechState()).toBe('idle')
  })

  it('pauseSpeech() only pauses while actually speaking, and resumeSpeech() only resumes while paused', () => {
    // Not speaking yet — both should no-op.
    pauseSpeech()
    expect(mockSpeechSynthesis.pause).not.toHaveBeenCalled()
    resumeSpeech()
    expect(mockSpeechSynthesis.resume).not.toHaveBeenCalled()

    speak('Hello', { langCode: 'en-IN' })
    pauseSpeech()
    expect(mockSpeechSynthesis.pause).toHaveBeenCalledTimes(1)
    expect(getSpeechState()).toBe('paused')

    // Pausing again while already paused should not double-call pause().
    pauseSpeech()
    expect(mockSpeechSynthesis.pause).toHaveBeenCalledTimes(1)

    resumeSpeech()
    expect(mockSpeechSynthesis.resume).toHaveBeenCalledTimes(1)
    expect(getSpeechState()).toBe('speaking')
  })

  it('onend transitions state back to idle', () => {
    speak('Hello', { langCode: 'en-IN' })
    expect(getSpeechState()).toBe('speaking')
    mockUtterances[0].onend?.()
    expect(getSpeechState()).toBe('idle')
  })

  it('applies the clamped rate and the requested language to the utterance', () => {
    speak('Hello', { langCode: 'hi-IN', rate: 99 })
    expect(mockUtterances[0].lang).toBe('hi-IN')
    expect(mockUtterances[0].rate).toBe(2) // clamped
  })
})
