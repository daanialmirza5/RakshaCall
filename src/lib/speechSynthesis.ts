/**
 * Thin wrapper around the browser's native SpeechSynthesis API
 * (`window.speechSynthesis`) — RakshaCall's local caller-voice engine. No
 * network calls, no API keys, no server-side audio generation: whatever
 * voice the browser exposes is used as-is.
 *
 * One caveat worth being explicit about (see `pickVoice`): some browsers'
 * "enhanced"/network voices synthesize speech by sending the text to a
 * remote server, rather than generating it on-device. `pickVoice` prefers
 * `localService` voices where one is available for this reason (and for
 * reliability), but cannot guarantee an on-device voice exists for every
 * language/browser combination.
 */
import type { PlaybackMode } from './callPlaybackUtils'

export type SpeechEngineState = 'idle' | 'speaking' | 'paused'

const MIN_RATE = 0.5
const MAX_RATE = 2

export function isTTSSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof (window as unknown as { SpeechSynthesisUtterance?: unknown }).SpeechSynthesisUtterance !== 'undefined'
  )
}

let cachedVoices: SpeechSynthesisVoice[] = []
let voicesListenerAttached = false

function refreshVoiceCache(): void {
  if (!isTTSSupported()) return
  cachedVoices = window.speechSynthesis.getVoices()
}

function ensureVoiceListener(): void {
  if (voicesListenerAttached || !isTTSSupported()) return
  voicesListenerAttached = true
  refreshVoiceCache()
  window.speechSynthesis.addEventListener('voiceschanged', refreshVoiceCache)
}

/** Available voices, refreshed as the browser loads them (often asynchronous, e.g. in Chrome). */
export function getVoices(): SpeechSynthesisVoice[] {
  if (!isTTSSupported()) return []
  ensureVoiceListener()
  return cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices()
}

export interface VoiceLike {
  lang: string
  name: string
  localService?: boolean
}

/**
 * Picks the best available voice for a BCP-47 language code: an exact
 * region match is preferred, then any voice sharing the base language,
 * with an Indian-region ("-IN") voice and an on-device ("local service")
 * voice both scored higher when available. Returns undefined — letting the
 * browser fall back to its own default voice — when nothing matches at
 * all; never throws, and never assumes a language is available.
 */
export function pickVoice<T extends VoiceLike>(langCode: string, voices: T[]): T | undefined {
  const lower = langCode.toLowerCase()
  const primary = lower.split('-')[0]

  let best: T | undefined
  let bestScore = -1
  for (const voice of voices) {
    const voiceLang = voice.lang.toLowerCase()
    let score: number
    if (voiceLang === lower) score = 4
    else if (voiceLang.startsWith(primary)) score = 2
    else continue
    if (voiceLang.endsWith('-in')) score += 1
    if (voice.localService) score += 1
    if (score > bestScore) {
      bestScore = score
      best = voice
    }
  }
  return best
}

export function clampRate(rate: number): number {
  return Math.min(MAX_RATE, Math.max(MIN_RATE, rate))
}

/** Caller-voice speech rate for a given playback mode — never fast enough to become unintelligible. */
export function ttsRateForMode(mode: PlaybackMode): number {
  if (mode.kind === 'instant') return 1.5
  if (mode.multiplier === 1) return 1
  if (mode.multiplier === 2) return 1.2
  return 1.4
}

const stateListeners = new Set<(state: SpeechEngineState) => void>()
let engineState: SpeechEngineState = 'idle'

function setEngineState(next: SpeechEngineState): void {
  engineState = next
  stateListeners.forEach((listener) => listener(next))
}

/** Subscribes to speech-engine state changes; returns an unsubscribe function. Single source of truth for "is the caller currently speaking." */
export function subscribeSpeechState(listener: (state: SpeechEngineState) => void): () => void {
  stateListeners.add(listener)
  return () => stateListeners.delete(listener)
}

export function getSpeechState(): SpeechEngineState {
  return engineState
}

export interface SpeakOptions {
  /** BCP-47 language code, e.g. "en-IN". */
  langCode: string
  rate?: number
}

/** Speaks `text` aloud, cancelling any speech already in progress first — utterances never overlap. No-ops safely if TTS is unsupported or the text is blank. */
export function speak(text: string, options: SpeakOptions): void {
  if (!isTTSSupported() || !text.trim()) return
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = options.langCode
  utterance.rate = clampRate(options.rate ?? 1)
  const voice = pickVoice(options.langCode, getVoices())
  if (voice) utterance.voice = voice

  utterance.onstart = () => setEngineState('speaking')
  utterance.onend = () => setEngineState('idle')
  utterance.onerror = () => setEngineState('idle')

  window.speechSynthesis.speak(utterance)
}

/** Stops any current/queued speech immediately. */
export function cancelSpeech(): void {
  if (!isTTSSupported()) return
  window.speechSynthesis.cancel()
  setEngineState('idle')
}

export function pauseSpeech(): void {
  if (!isTTSSupported() || engineState !== 'speaking') return
  window.speechSynthesis.pause()
  setEngineState('paused')
}

export function resumeSpeech(): void {
  if (!isTTSSupported() || engineState !== 'paused') return
  window.speechSynthesis.resume()
  setEngineState('speaking')
}

export type VoiceActivityState = 'unsupported' | 'muted' | SpeechEngineState

/**
 * Single source of truth for "what should the voice UI show" — folds
 * browser TTS support and the user's mute preference in with the raw
 * speech-engine state, so components never need to re-derive this
 * themselves from multiple separate booleans.
 */
export function computeVoiceActivityState(
  ttsSupported: boolean,
  voiceEnabled: boolean,
  state: SpeechEngineState,
): VoiceActivityState {
  if (!ttsSupported) return 'unsupported'
  if (!voiceEnabled) return 'muted'
  return state
}
