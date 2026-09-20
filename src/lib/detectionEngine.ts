import { SIGNAL_CATEGORIES, riskLevelForScore, type RiskLevel, type SignalCategoryId } from '../data/signals'
import { normalizeForDetection } from './textNormalize'

export interface MatchedCategory {
  id: SignalCategoryId
  weight: number
  matchedPhrases: string[]
}

export interface DetectionResult {
  /** 0-100 aggregate risk score. */
  score: number
  level: RiskLevel
  matchedCategories: MatchedCategory[]
  /** Ordered, highest-priority-first, for building the plain-language explanation. */
  topCategoryIds: SignalCategoryId[]
}

const CATEGORY_PRIORITY: SignalCategoryId[] = [
  'remoteAccess',
  'credentialExtraction',
  'financialExtraction',
  'isolation',
  'surveillance',
  'threat',
  'authority',
  'urgency',
]

/**
 * Scans a block of caller speech and returns matched scam-signal categories.
 * Pure, synchronous, and fully local — no network calls, so it can never fail
 * due to an external outage and always returns in well under a millisecond
 * for hackathon-scale transcripts.
 *
 * Matching runs against a normalized copy of the text (case, whitespace, and
 * punctuation canonicalized — see textNormalize.ts); the caller's original
 * transcript is never touched, so the UI can keep displaying it verbatim.
 */
export function detectSignals(callerText: string): MatchedCategory[] {
  const matched: MatchedCategory[] = []
  const normalized = normalizeForDetection(callerText)
  if (!normalized) return matched

  for (const category of SIGNAL_CATEGORIES) {
    const matchedPhrases = new Set<string>()
    for (const pattern of category.patterns) {
      const found = normalized.match(pattern)
      if (found) matchedPhrases.add(found[0])
    }
    if (matchedPhrases.size > 0) {
      matched.push({ id: category.id, weight: category.weight, matchedPhrases: [...matchedPhrases] })
    }
  }

  return matched
}

/**
 * Combines matched categories into a single 0-100 risk score.
 *
 * Real digital-arrest scams work by *stacking* tactics (authority + urgency +
 * isolation + a payment request, all in one call), so co-occurrence across
 * distinct categories is weighted more heavily than any single strong phrase
 * — this mirrors how these scams are actually run and keeps a single
 * ambiguous phrase (e.g. "urgent" alone, common in legitimate calls) from
 * tripping a HIGH verdict by itself.
 */
export function scoreFromCategories(matched: MatchedCategory[]): number {
  if (matched.length === 0) return 0

  const baseScore = matched.reduce((sum, m) => sum + m.weight, 0)

  let comboBonus = 0
  if (matched.length >= 5) comboBonus = 30
  else if (matched.length >= 3) comboBonus = 16
  else if (matched.length >= 2) comboBonus = 6

  return Math.max(0, Math.min(100, Math.round(baseScore + comboBonus)))
}

export function analyzeCallerText(callerText: string): DetectionResult {
  const matchedCategories = detectSignals(callerText)
  const score = scoreFromCategories(matchedCategories)
  const level = riskLevelForScore(score)
  const matchedIds = new Set(matchedCategories.map((m) => m.id))
  const topCategoryIds = CATEGORY_PRIORITY.filter((id) => matchedIds.has(id))

  return { score, level, matchedCategories, topCategoryIds }
}
