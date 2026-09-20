import type { Lang } from './i18n/strings'

export type Speaker = 'caller' | 'user'

export interface TranscriptLine {
  speaker: Speaker
  text: string
  /** Milliseconds to wait after the previous line before this line appears, when streaming. */
  delayMs: number
}

export type ScenarioCategory =
  | 'digital-arrest'
  | 'fake-bank'
  | 'courier-customs'
  | 'sim-deactivation'
  | 'investment'
  | 'normal'

export interface Scenario {
  id: string
  title: string
  description: string
  category: ScenarioCategory
  /** Whether this scenario is a genuine scam pattern or a normal, benign call. */
  isScam: boolean
  callerName: string
  /**
   * The language the scenario's dialogue is written in — drives caller-voice
   * TTS selection. Independent of the UI language: switching the app's UI to
   * Hindi must not make an English-language scenario get spoken with a Hindi
   * voice. Defaults to 'en' when omitted (all current scenarios are English).
   */
  language?: Lang
  lines: TranscriptLine[]
}
