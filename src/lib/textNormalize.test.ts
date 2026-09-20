import { describe, expect, it } from 'vitest'
import { normalizeForDetection } from './textNormalize'

describe('normalizeForDetection', () => {
  it('collapses repeated punctuation and whitespace', () => {
    expect(normalizeForDetection('PAISE!!! TRANSFER   KARO')).toBe('paise transfer karo')
  })

  it('collapses repeated whitespace in Devanagari text without altering the script', () => {
    expect(normalizeForDetection('पैसे   ट्रांसफर करो')).toBe('पैसे ट्रांसफर करो')
  })

  it('lowercases Latin text', () => {
    expect(normalizeForDetection('AnYdEsK')).toBe('anydesk')
  })

  it('preserves contractions when apostrophes are stripped', () => {
    expect(normalizeForDetection("Don't hang up")).toBe('dont hang up')
  })

  it('handles empty and whitespace-only input safely', () => {
    expect(normalizeForDetection('')).toBe('')
    expect(normalizeForDetection('   \n\t ')).toBe('')
  })

  it('does not mutate the input string', () => {
    const original = '  PAISE!!! TRANSFER   KARO  '
    normalizeForDetection(original)
    expect(original).toBe('  PAISE!!! TRANSFER   KARO  ')
  })

  it('is idempotent', () => {
    const once = normalizeForDetection('PAISE!!! TRANSFER   KARO')
    expect(normalizeForDetection(once)).toBe(once)
  })
})
