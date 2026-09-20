import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Lang } from '../i18n/strings'
import { useSpeechRecognition } from './speechRecognition'

class FakeSpeechRecognition {
  static instances: FakeSpeechRecognition[] = []
  continuous = false
  interimResults = false
  lang = ''
  onresult: ((event: unknown) => void) | null = null
  onerror: ((event: { error: string }) => void) | null = null
  onend: (() => void) | null = null
  start = vi.fn()
  stop = vi.fn(() => {
    this.onend?.()
  })
  constructor() {
    FakeSpeechRecognition.instances.push(this)
  }
}

afterEach(() => {
  FakeSpeechRecognition.instances = []
  vi.unstubAllGlobals()
})

describe('useSpeechRecognition — unsupported browser', () => {
  it('reports unsupported when neither SpeechRecognition constructor exists', () => {
    vi.stubGlobal('SpeechRecognition', undefined)
    vi.stubGlobal('webkitSpeechRecognition', undefined)
    const { result } = renderHook(() => useSpeechRecognition('en'))
    expect(result.current.supported).toBe(false)
    expect(result.current.micState).toBe('unsupported')
  })
})

describe('useSpeechRecognition — supported browser (mocked)', () => {
  beforeEach(() => {
    vi.stubGlobal('SpeechRecognition', FakeSpeechRecognition)
  })

  it('reports ready when supported but not yet listening', () => {
    const { result } = renderHook(() => useSpeechRecognition('en'))
    expect(result.current.supported).toBe(true)
    expect(result.current.micState).toBe('ready')
    expect(result.current.listening).toBe(false)
  })

  it('maps the app language to the correct BCP-47 recognition language', () => {
    const { result, rerender } = renderHook(({ lang }) => useSpeechRecognition(lang), {
      initialProps: { lang: 'en' as Lang },
    })
    act(() => result.current.start())
    expect(FakeSpeechRecognition.instances[0].lang).toBe('en-IN')

    rerender({ lang: 'hi' })
    act(() => result.current.stop())
    act(() => result.current.start())
    expect(FakeSpeechRecognition.instances[1].lang).toBe('hi-IN')

    rerender({ lang: 'mr' })
    act(() => result.current.stop())
    act(() => result.current.start())
    expect(FakeSpeechRecognition.instances[2].lang).toBe('mr-IN')
  })

  it('transitions to listening on start and back to ready on stop', () => {
    const { result } = renderHook(() => useSpeechRecognition('en'))
    act(() => result.current.start())
    expect(result.current.micState).toBe('listening')
    expect(result.current.listening).toBe(true)

    act(() => result.current.stop())
    expect(result.current.micState).toBe('ready')
    expect(result.current.listening).toBe(false)
  })

  it('maps a "not-allowed" recognition error to permission-denied', () => {
    const { result } = renderHook(() => useSpeechRecognition('en'))
    act(() => result.current.start())
    act(() => FakeSpeechRecognition.instances[0].onerror?.({ error: 'not-allowed' }))
    expect(result.current.micState).toBe('permission-denied')
  })

  it('maps an "audio-capture" recognition error to no-mic', () => {
    const { result } = renderHook(() => useSpeechRecognition('en'))
    act(() => result.current.start())
    act(() => FakeSpeechRecognition.instances[0].onerror?.({ error: 'audio-capture' }))
    expect(result.current.micState).toBe('no-mic')
  })

  it('maps an unrecognized/network error to a generic error state, never crashing', () => {
    const { result } = renderHook(() => useSpeechRecognition('en'))
    act(() => result.current.start())
    act(() => {
      expect(() => FakeSpeechRecognition.instances[0].onerror?.({ error: 'network' })).not.toThrow()
    })
    expect(result.current.micState).toBe('error')
  })

  it('accumulates final transcript chunks from onresult', () => {
    const { result } = renderHook(() => useSpeechRecognition('en'))
    act(() => result.current.start())
    act(() =>
      FakeSpeechRecognition.instances[0].onresult?.({
        resultIndex: 0,
        results: [{ isFinal: true, 0: { transcript: 'transfer money now' } }],
      }),
    )
    expect(result.current.transcript).toBe('transfer money now')
  })

  it('reset() clears the transcript', () => {
    const { result } = renderHook(() => useSpeechRecognition('en'))
    act(() => result.current.start())
    act(() =>
      FakeSpeechRecognition.instances[0].onresult?.({
        resultIndex: 0,
        results: [{ isFinal: true, 0: { transcript: 'hello' } }],
      }),
    )
    expect(result.current.transcript).toBe('hello')
    act(() => result.current.reset())
    expect(result.current.transcript).toBe('')
  })

  it('stops the recognizer on unmount (no orphan listener)', () => {
    const { result, unmount } = renderHook(() => useSpeechRecognition('en'))
    act(() => result.current.start())
    const instance = FakeSpeechRecognition.instances[0]
    unmount()
    expect(instance.stop).toHaveBeenCalled()
  })
})
