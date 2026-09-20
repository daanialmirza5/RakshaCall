import { useCallback, useEffect, useRef, useState } from 'react'
import { LANG_TO_BCP47, type Lang } from '../i18n/strings'

/**
 * Thin wrapper around the browser-native Web Speech API (SpeechRecognition).
 * This is a free, zero-setup, on-device-or-browser-vendor speech-to-text
 * source with no API key and no paid backend — it's feature-detected, and
 * every caller of this hook must handle `supported === false` gracefully
 * (e.g. Firefox and most non-Chromium browsers don't implement it), since
 * the rest of the product must keep working via typed/pasted transcripts.
 *
 * Note on privacy: this wraps the *browser's* recognition implementation,
 * which is browser-controlled — some browsers process speech on-device,
 * others (notably Chrome) may send audio to their own servers to produce
 * the transcript. RakshaCall's detection engine itself never leaves this
 * device either way; see the mic privacy note surfaced in the UI.
 */

interface SpeechRecognitionResultLike {
  isFinal: boolean
  0: { transcript: string }
}

interface SpeechRecognitionEventLike extends Event {
  resultIndex: number
  results: ArrayLike<SpeechRecognitionResultLike>
}

interface SpeechRecognitionErrorEventLike extends Event {
  error: string
}

interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null
  onend: (() => void) | null
}

function getSpeechRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike
    webkitSpeechRecognition?: new () => SpeechRecognitionLike
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

export type MicState = 'unsupported' | 'ready' | 'listening' | 'permission-denied' | 'no-mic' | 'error'

/** Maps a raw SpeechRecognition error code to the mic state it represents, without exposing the raw code to the UI. */
function micStateForError(errorCode: string): MicState {
  if (errorCode === 'not-allowed' || errorCode === 'service-not-allowed') return 'permission-denied'
  if (errorCode === 'audio-capture') return 'no-mic'
  // 'network', 'aborted', 'no-speech', 'language-not-supported', or anything unrecognized.
  return 'error'
}

export function useSpeechRecognition(lang: Lang) {
  const [supported] = useState(() => getSpeechRecognitionCtor() !== null)
  const [micState, setMicState] = useState<MicState>(() => (supported ? 'ready' : 'unsupported'))
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const langRef = useRef(lang)

  useEffect(() => {
    langRef.current = lang
  }, [lang])

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
    }
  }, [])

  const start = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor()
    if (!Ctor) {
      setMicState('unsupported')
      return
    }

    const recognition = new Ctor()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = LANG_TO_BCP47[langRef.current]

    recognition.onresult = (event) => {
      let finalChunk = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) finalChunk += `${result[0].transcript} `
      }
      if (finalChunk) setTranscript((prev) => `${prev} ${finalChunk}`.trim())
    }
    recognition.onerror = (event) => setMicState(micStateForError(event.error))
    recognition.onend = () => setMicState((prev) => (prev === 'listening' ? 'ready' : prev))

    recognitionRef.current = recognition
    recognition.start()
    setMicState('listening')
  }, [])

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
    setMicState((prev) => (prev === 'listening' ? 'ready' : prev))
  }, [])

  const reset = useCallback(() => setTranscript(''), [])

  return {
    supported,
    micState,
    /** Convenience boolean, equivalent to `micState === 'listening'`. */
    listening: micState === 'listening',
    transcript,
    start,
    stop,
    reset,
  }
}
