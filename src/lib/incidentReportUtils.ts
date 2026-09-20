/**
 * Pure helpers for building an incident (scam-detection) summary from real
 * runtime state — the detection engine's own output, never a second,
 * independent scoring system. No React, no timers: cheap to unit test.
 */
import type { RiskLevel, SignalCategoryId } from '../data/signals'
import type { MatchedCategory } from './detectionEngine'
import type { ScenarioCategory } from '../types'
import type { Strings } from '../i18n/strings'

export type ScamTypeKey = 'digitalArrest' | 'fakeBank' | 'courierCustoms' | 'simDeactivation' | 'investment' | 'normal'

const SCENARIO_CATEGORY_TO_SCAM_TYPE_KEY: Record<ScenarioCategory, ScamTypeKey> = {
  'digital-arrest': 'digitalArrest',
  'fake-bank': 'fakeBank',
  'courier-customs': 'courierCustoms',
  'sim-deactivation': 'simDeactivation',
  investment: 'investment',
  normal: 'normal',
}

export function scamTypeKeyForCategory(category: ScenarioCategory): ScamTypeKey {
  return SCENARIO_CATEGORY_TO_SCAM_TYPE_KEY[category]
}

export interface IncidentTimelineEntry {
  categoryId: SignalCategoryId
  /** Milliseconds since the start of this play-through/session. */
  atMs: number
  scoreAfter: number
  levelAfter: RiskLevel
}

export interface IncidentReportData {
  incidentId: string
  generatedAt: number
  source: 'live-call' | 'paste-analysis'
  callerName: string | null
  scenarioTitle: string | null
  /** null when the scam type can't be reliably identified (e.g. free-text paste analysis) — never invented. */
  scamTypeKey: ScamTypeKey | null
  /** null when duration isn't meaningful (e.g. a single paste-analysis snapshot). */
  durationMs: number | null
  peakScore: number
  finalScore: number
  finalLevel: RiskLevel
  matchedCategories: MatchedCategory[]
  timeline: IncidentTimelineEntry[]
}

const ID_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no ambiguous 0/O/1/I

function randomSuffix(length: number): string {
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = crypto.getRandomValues(new Uint8Array(length))
    return Array.from(bytes, (b) => ID_ALPHABET[b % ID_ALPHABET.length]).join('')
  }
  return Array.from({ length }, () => ID_ALPHABET[Math.floor(Math.random() * ID_ALPHABET.length)]).join('')
}

/** A local, non-sensitive session identifier — cosmetic only, never a database key or tied to any account/person. */
export function generateIncidentId(now: Date = new Date()): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `RC-${y}${m}${d}-${randomSuffix(4)}`
}

export function formatDurationMs(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

/**
 * Builds the trusted-contact alert message from the actual incident, not a
 * static placeholder — but keeps it short and non-technical, and never
 * includes the raw transcript (privacy: only the detected tactic labels).
 */
export function buildTrustedContactMessage(matched: MatchedCategory[], strings: Strings): string {
  const t = strings.trustedContact
  const topLabels = matched.slice(0, 2).map((m) => strings.categories[m.id].label)
  const tacticsPhrase = topLabels.length > 0 ? topLabels.join('; ') : t.messageTacticsFallback
  return t.messageTemplate.replace('{tactics}', tacticsPhrase)
}

/** Plain-text incident summary for Copy/Download — never HTML, so there's no injection surface. */
export function buildIncidentSummaryText(data: IncidentReportData, strings: Strings): string {
  const r = strings.incidentReport
  const lines: string[] = []

  lines.push(`RakshaCall — ${r.title}`)
  lines.push(`${r.idLabel}: ${data.incidentId}`)
  lines.push(`${r.generatedAtLabel}: ${new Date(data.generatedAt).toLocaleString()}`)
  lines.push(`${r.sourceLabel}: ${data.source === 'live-call' ? r.sourceLiveCall : r.sourcePaste}`)
  if (data.scenarioTitle) lines.push(`${r.scenarioLabel}: ${data.scenarioTitle}`)
  if (data.durationMs !== null) lines.push(`${r.durationLabel}: ${formatDurationMs(data.durationMs)}`)
  lines.push(`${r.peakScoreLabel}: ${data.peakScore}/100`)
  lines.push(`${r.finalLevelLabel}: ${strings.risk[data.finalLevel]}`)
  lines.push(`${r.scamTypeLabel}: ${data.scamTypeKey ? r.scamTypes[data.scamTypeKey] : r.scamTypeUnknown}`)

  lines.push('')
  lines.push(`${r.detectedTacticsTitle}:`)
  if (data.matchedCategories.length === 0) {
    lines.push(`- ${r.noTacticsDetected}`)
  } else {
    data.matchedCategories.forEach((m) => lines.push(`- ${strings.categories[m.id].label}`))
  }

  lines.push('')
  lines.push(`${r.timelineTitle}:`)
  if (data.timeline.length === 0) {
    lines.push(`- ${r.timelineEmpty}`)
  } else {
    data.timeline.forEach((e) =>
      lines.push(`- [${formatDurationMs(e.atMs)}] ${strings.categories[e.categoryId].label} → ${strings.risk[e.levelAfter]} (${e.scoreAfter}/100)`),
    )
  }

  lines.push('')
  lines.push(r.privacyNote)
  lines.push(r.disclaimerNote)

  return lines.join('\n')
}
