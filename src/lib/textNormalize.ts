/**
 * Lightweight text normalization used before signal matching.
 *
 * This exists so that messy real-world input — extra punctuation, repeated
 * whitespace, mixed case, differently-composed Unicode — still lines up
 * with the literal phrases in `src/data/signals.ts`. It intentionally does
 * NOT attempt spelling correction, stemming, or translation: it only
 * canonicalizes form (case, spacing, punctuation), never meaning. The
 * caller's original transcript text is never mutated by this function —
 * callers pass a copy through for matching and keep the original for
 * display.
 */
export function normalizeForDetection(text: string): string {
  if (!text) return ''

  return text
    .normalize('NFC')
    .toLowerCase()
    // Strip apostrophes/quotes entirely (not to a space) so contractions
    // like "don't" / "it's" still line up with patterns such as /don'?t/.
    .replace(/['''"“”]/g, '')
    // Common ASCII + Devanagari punctuation -> space.
    .replace(/[.,!?;:()[\]{}<>\-_/\\|।॥*~^]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
