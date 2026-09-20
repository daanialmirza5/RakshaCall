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
  lines: TranscriptLine[]
}
