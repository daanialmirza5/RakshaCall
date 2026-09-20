import { describe, expect, it } from 'vitest'
import { STRINGS } from '../i18n/strings'
import type { MatchedCategory } from './detectionEngine'
import {
  buildIncidentSummaryText,
  buildTrustedContactMessage,
  formatDurationMs,
  generateIncidentId,
  scamTypeKeyForCategory,
  type IncidentReportData,
} from './incidentReportUtils'

describe('generateIncidentId', () => {
  it('matches the RC-YYYYMMDD-XXXX shape', () => {
    const id = generateIncidentId(new Date('2026-09-20T10:00:00'))
    expect(id).toMatch(/^RC-20260920-[A-Z0-9]{4}$/)
  })

  it('produces different suffixes across calls (not a constant placeholder)', () => {
    const ids = new Set(Array.from({ length: 20 }, () => generateIncidentId()))
    expect(ids.size).toBeGreaterThan(1)
  })

  it('never includes ambiguous characters (0/O/1/I) in the suffix', () => {
    for (let i = 0; i < 30; i++) {
      const id = generateIncidentId()
      const suffix = id.split('-')[2]
      expect(suffix).not.toMatch(/[01OI]/)
    }
  })
})

describe('scamTypeKeyForCategory', () => {
  it('maps every scenario category to a stable, non-invented key', () => {
    expect(scamTypeKeyForCategory('digital-arrest')).toBe('digitalArrest')
    expect(scamTypeKeyForCategory('fake-bank')).toBe('fakeBank')
    expect(scamTypeKeyForCategory('courier-customs')).toBe('courierCustoms')
    expect(scamTypeKeyForCategory('sim-deactivation')).toBe('simDeactivation')
    expect(scamTypeKeyForCategory('investment')).toBe('investment')
    expect(scamTypeKeyForCategory('normal')).toBe('normal')
  })
})

describe('formatDurationMs', () => {
  it('formats minutes:seconds with zero-padded seconds', () => {
    expect(formatDurationMs(0)).toBe('0:00')
    expect(formatDurationMs(5000)).toBe('0:05')
    expect(formatDurationMs(65000)).toBe('1:05')
    expect(formatDurationMs(600000)).toBe('10:00')
  })

  it('never goes negative, even for a negative input', () => {
    expect(formatDurationMs(-500)).toBe('0:00')
  })
})

describe('buildTrustedContactMessage', () => {
  const matched: MatchedCategory[] = [
    { id: 'authority', weight: 15, matchedPhrases: ['cbi'] },
    { id: 'financialExtraction', weight: 25, matchedPhrases: ['transfer money'] },
    { id: 'threat', weight: 18, matchedPhrases: ['arrest'] },
  ]

  it('includes only the top tactic labels, never the raw matched phrases from the transcript', () => {
    const message = buildTrustedContactMessage(matched, STRINGS.en)
    expect(message).toContain(STRINGS.en.categories.authority.label)
    expect(message).toContain(STRINGS.en.categories.financialExtraction.label)
    // 'cbi' and 'arrest' are the raw matched substrings from the transcript (matchedPhrases),
    // not part of any fixed category label — they must never leak into the message.
    expect(message).not.toContain('cbi')
    expect(message).not.toMatch(/\barrest\b/)
  })

  it('only includes the top 2 tactics, not every detected category', () => {
    const message = buildTrustedContactMessage(matched, STRINGS.en)
    expect(message).not.toContain(STRINGS.en.categories.threat.label)
  })

  it('falls back gracefully when no tactics are given', () => {
    const message = buildTrustedContactMessage([], STRINGS.en)
    expect(message).toContain(STRINGS.en.trustedContact.messageTacticsFallback)
  })

  it('produces a readable message in Hindi and Marathi too', () => {
    expect(buildTrustedContactMessage(matched, STRINGS.hi)).toContain(STRINGS.hi.categories.authority.label)
    expect(buildTrustedContactMessage(matched, STRINGS.mr)).toContain(STRINGS.mr.categories.authority.label)
  })
})

describe('buildIncidentSummaryText', () => {
  const baseData: IncidentReportData = {
    incidentId: 'RC-20260920-AB12',
    generatedAt: new Date('2026-09-20T10:00:00').getTime(),
    source: 'live-call',
    callerName: 'Unknown — "Officer A. Sharma"',
    scenarioTitle: 'Fake "Digital Arrest" — CBI Impersonation',
    scamTypeKey: 'digitalArrest',
    durationMs: 65000,
    peakScore: 92,
    finalScore: 92,
    finalLevel: 'HIGH',
    matchedCategories: [
      { id: 'authority', weight: 15, matchedPhrases: ['cbi'] },
      { id: 'threat', weight: 18, matchedPhrases: ['arrest'] },
    ],
    timeline: [
      { categoryId: 'authority', atMs: 1000, scoreAfter: 15, levelAfter: 'LOW' },
      { categoryId: 'threat', atMs: 5000, scoreAfter: 39, levelAfter: 'MEDIUM' },
    ],
  }

  it('includes the incident id, score, level, and scam type', () => {
    const text = buildIncidentSummaryText(baseData, STRINGS.en)
    expect(text).toContain('RC-20260920-AB12')
    expect(text).toContain('92/100')
    expect(text).toContain(STRINGS.en.risk.HIGH)
    expect(text).toContain(STRINGS.en.incidentReport.scamTypes.digitalArrest)
  })

  it('lists every detected tactic label', () => {
    const text = buildIncidentSummaryText(baseData, STRINGS.en)
    expect(text).toContain(STRINGS.en.categories.authority.label)
    expect(text).toContain(STRINGS.en.categories.threat.label)
  })

  it('lists timeline entries in order with formatted timestamps', () => {
    const text = buildIncidentSummaryText(baseData, STRINGS.en)
    const authorityIndex = text.indexOf('0:01')
    const threatIndex = text.indexOf('0:05')
    expect(authorityIndex).toBeGreaterThan(-1)
    expect(threatIndex).toBeGreaterThan(authorityIndex)
  })

  it('includes the privacy note and the non-forensic disclaimer', () => {
    const text = buildIncidentSummaryText(baseData, STRINGS.en)
    expect(text).toContain(STRINGS.en.incidentReport.privacyNote)
    expect(text).toContain(STRINGS.en.incidentReport.disclaimerNote)
  })

  it('handles a report with no detected tactics and no timeline gracefully', () => {
    const empty: IncidentReportData = {
      ...baseData,
      matchedCategories: [],
      timeline: [],
      scamTypeKey: null,
      durationMs: null,
    }
    const text = buildIncidentSummaryText(empty, STRINGS.en)
    expect(text).toContain(STRINGS.en.incidentReport.noTacticsDetected)
    expect(text).toContain(STRINGS.en.incidentReport.timelineEmpty)
    expect(text).toContain(STRINGS.en.incidentReport.scamTypeUnknown)
    expect(text).not.toContain('undefined')
    expect(text).not.toContain('null')
  })

  it('never claims to BE forensic or legally admissible — it explicitly disclaims both', () => {
    const text = buildIncidentSummaryText(baseData, STRINGS.en)
    expect(text.toLowerCase()).not.toContain('forensic')
    // The disclaimer legitimately contains the phrase as a negation ("not ... legally
    // admissible"); what must never appear is an affirmative claim of either.
    expect(text.toLowerCase()).not.toMatch(/\bis (a )?(certified|legally admissible)\b/)
    expect(text.toLowerCase()).toContain('not a certified or legally admissible')
  })
})
