import { describe, expect, it } from 'vitest'
import { formatNodeValue } from './workflowLayout'

describe('formatNodeValue', () => {
  it('formats an array of matched-category objects by their id, not [object Object]', () => {
    const matched = [
      { id: 'authority', weight: 15, matchedPhrases: ['cbi'] },
      { id: 'threat', weight: 18, matchedPhrases: ['arrest'] },
    ]
    expect(formatNodeValue(matched)).toBe('authority, threat')
  })

  it('formats a plain string array as-is', () => {
    expect(formatNodeValue(['authority', 'threat'])).toBe('authority, threat')
  })

  it('formats an empty array as "none"', () => {
    expect(formatNodeValue([])).toBe('none')
  })

  it('formats a {score, level} object', () => {
    expect(formatNodeValue({ score: 71, level: 'HIGH' })).toBe('71/100 · HIGH')
  })

  it('formats a {speaker, text} transcript line object', () => {
    expect(formatNodeValue({ speaker: 'caller', text: 'This is CBI calling.' })).toBe('caller: "This is CBI calling."')
  })

  it('passes strings and numbers through, truncating long strings', () => {
    expect(formatNodeValue('HIGH')).toBe('HIGH')
    expect(formatNodeValue(71)).toBe('71')
    expect(formatNodeValue('x'.repeat(100)).length).toBeLessThanOrEqual(64)
  })

  it('handles null/undefined without throwing', () => {
    expect(formatNodeValue(null)).toBe('')
    expect(formatNodeValue(undefined)).toBe('')
  })
})
