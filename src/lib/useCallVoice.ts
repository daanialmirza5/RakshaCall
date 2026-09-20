import { useCallback, useEffect, useRef, useState } from 'react'
import { LANG_TO_BCP47 } from '../i18n/strings'
import type { Scenario } from '../types'
import type { CallPlaybackState } from './useCallPlayback'
import {
  cancelSpeech,
  computeVoiceActivityState,
  isTTSSupported,
  pauseSpeech,
  resumeSpeech,
  speak,
  subscribeSpeechState,
  ttsRateForMode,
  type SpeechEngineState,
  type VoiceActivityState,
} from './speechSynthesis'

const VOICE_PREF_STORAGE_KEY = 'rakshacall.voiceEnabled'

function readStoredVoicePref(): boolean {
  try {
    const stored = localStorage.getItem(VOICE_PREF_STORAGE_KEY)
    return stored !== 'false'
  } catch {
    return true
  }
}

export interface CallVoiceState {
  ttsSupported: boolean
  voiceEnabled: boolean
  activityState: VoiceActivityState
  toggleVoice: () => void
  /**
   * Cancels any in-progress speech immediately. Jump-to-Trigger doesn't bump
   * `playback.playId` (it's a fast-forward within the same play-through, not
   * a restart), so it isn't covered by the playId-reset effect below — the
   * caller (CallScreen) must call this itself right before invoking
   * `playback.jumpToTrigger()`. Plain `pauseSpeech()` would not be enough
   * here: it would leave the *pre-jump* utterance resumable, so a later
   * Resume would continue speaking stale, skipped-past dialogue.
   */
  stopSpeaking: () => void
}

/**
 * Wires local browser TTS into an existing `useCallPlayback` result without
 * touching its internals: it watches `playback.visibleLines` for newly
 * revealed *caller* lines and speaks them, following playback pause/resume
 * and cancelling stale speech on every restart/instant-demo/scenario change
 * (via `playback.playId`), on unmount, and — via the exposed `stopSpeaking()`
 * — right before Jump-to-Trigger. The visual transcript — driven by
 * useCallPlayback — remains the single source of truth; this hook never
 * delays or blocks it.
 *
 * Design choices, both deliberate:
 *  - Instant Demo never speaks. It compresses a whole scenario into ~3-7s;
 *    real TTS utterances take far longer than that per line, so speaking
 *    would either overlap badly or fall hopelessly behind the transcript.
 *  - Jump-to-Trigger never speaks either. It reveals several lines at once
 *    synchronously and lands in a *paused* state by design (see Section 2) —
 *    only lines revealed while playback is actively `'playing'` are spoken.
 */
export function useCallVoice(scenario: Scenario, playback: CallPlaybackState): CallVoiceState {
  const [ttsSupported] = useState(() => isTTSSupported())
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(() => ttsSupported && readStoredVoicePref())
  const [engineState, setEngineState] = useState<SpeechEngineState>('idle')
  const lastSpokenIndexRef = useRef(-1)

  useEffect(() => subscribeSpeechState(setEngineState), [])

  const toggleVoice = useCallback(() => {
    setVoiceEnabled((prev) => {
      const next = !prev
      try {
        localStorage.setItem(VOICE_PREF_STORAGE_KEY, String(next))
      } catch {
        // localStorage unavailable (private browsing etc.) — the preference just won't persist.
      }
      return next
    })
  }, [])

  // Muted mid-utterance -> stop immediately.
  useEffect(() => {
    if (!voiceEnabled) cancelSpeech()
  }, [voiceEnabled])

  // A fresh play-through (restart / instant demo / new scenario) cancels stale speech and resets tracking.
  useEffect(() => {
    cancelSpeech()
    lastSpokenIndexRef.current = -1
  }, [playback.playId])

  // Speak newly-revealed caller lines.
  useEffect(() => {
    const lines = playback.visibleLines
    const newestIndex = lines.length - 1
    if (newestIndex <= lastSpokenIndexRef.current) return
    lastSpokenIndexRef.current = newestIndex

    const line = lines[newestIndex]
    if (!line || line.speaker !== 'caller') return
    // Only speech revealed by ordinary timer-driven playback is spoken —
    // never the synchronous batch of lines Jump-to-Trigger reveals at once.
    if (playback.status !== 'playing') return
    if (playback.mode.kind === 'instant') return
    if (!ttsSupported || !voiceEnabled) return

    speak(line.text, {
      langCode: LANG_TO_BCP47[scenario.language ?? 'en'],
      rate: ttsRateForMode(playback.mode),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playback.visibleLines, playback.mode, playback.status, voiceEnabled, ttsSupported, scenario])

  // Follow playback pause/resume.
  useEffect(() => {
    if (playback.status === 'paused') pauseSpeech()
    else if (playback.status === 'playing') resumeSpeech()
  }, [playback.status])

  // Stop speaking if the user leaves the call screen entirely.
  useEffect(() => () => cancelSpeech(), [])

  return {
    ttsSupported,
    voiceEnabled,
    activityState: computeVoiceActivityState(ttsSupported, voiceEnabled, engineState),
    toggleVoice,
    stopSpeaking: cancelSpeech,
  }
}
